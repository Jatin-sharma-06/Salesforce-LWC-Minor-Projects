public class AccountQueueable implements Queueable, Database.AllowsCallouts {

    private List<Id> accountsIds;
    private Integer startIndex;
    private Integer endIndex;

    private static final Integer CHUNK_SIZE = 60;
    
    String endpoint = 'callout:QuickBooksNameCredential/v3/company/9341457160598857/customer';

    public AccountQueueable(List<Id> accountIds, Integer startIndex, Integer endIndex) {
        this.accountsIds = accountIds;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    //method for parst through list of chunk
    public List<Id> chunkOfList(Integer startIndex, Integer endIndex) {
        List<Id> accId = new List<Id>();
        for(Integer i = startIndex; i < endIndex; i++) {
            accId.add(accountsIds[i]);
        }
        return accId;
    }

    public void execute(QueueableContext context) {

        Integer nextIndex = Math.min(startIndex+ CHUNK_SIZE, endIndex);
        List<Id> currentChunkIds = chunkOfList(startIndex, nextIndex);

        List<Account> accList = [
            SELECT Id, Name, Phone, Email__c
            FROM Account
            WHERE id IN :currentChunkIds                  
        ];
        System.debug('Running job: ' + context.getJobId() + ' for ' + accList.size() + ' records');

        List<Account> accountsToUpdate = new List<Account>();

        Http http = new Http();

        for(Account acc : accList) {
            try {
                HttpRequest request = new HttpRequest();
                request.setEndpoint(endpoint);
                request.setMethod('POST');
                request.setHeader('Content-Type', 'application/json');
                request.setHeader('Accept', 'application/json');

                Map<String, Object> bodyMap = new Map<String, Object>();
                if(acc.Name != null) {
                    bodyMap.put('DisplayName', acc.Name);
                }

                //use nested map here to pass value inside map
                if(acc.Phone != null) {
                    bodyMap.put(
                        'PrimaryPhone', 
                        new Map<String, Object> {
                            'FreeFormNumber' => acc.Phone
                        }
                    );
                }

                if(acc.Email__c != null) {
                    bodyMap.put(
                        'PrimaryEmailAddr',
                        new Map<String, Object> {
                            'Address' => acc.Email__c
                        } 
                    );
                }

                request.setBody(JSON.serialize(bodyMap));

                HttpResponse response = http.send(request);

                // system.debug('Http response  : ' + response.getBody());

                if(response.getStatusCode() == 200){
                    Map<String,Object> responseMap = (Map<String,Object>) JSON.deserializeUntyped(response.getBody());
                    Map<String,Object> customerMap = (Map<String,Object>) responseMap.get('Customer');

                    if(customerMap != null){
                        acc.Quickbooks_Customer_Id__c = String.valueOf(customerMap.get('Id'));
                    }
                }

            } catch (Exception ex) {
                System.debug('Quickbook Exception : ' + ex.getMessage());
            } 

            accountsToUpdate.add(acc);
        }
        
        if(!accountsToUpdate.isEmpty()) {
            update accountsToUpdate ;
        }

        if(nextIndex < endIndex) {
            System.enqueueJob( new  AccountQueueable(accountsIds, nextIndex, endIndex));
        }
    }
}
