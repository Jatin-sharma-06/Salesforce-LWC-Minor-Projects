public class QuickbooksSyncService {
    @AuraEnabled
    public static void syncCustomerData(Id accountId) {
        Account accountRecord = [SELECT Id, Name, Quickbooks_Customer_Id__c FROM Account WHERE Id = :accountId LIMIT 1];
        if(String.isBlank(accountRecord.Quickbooks_Customer_Id__c)) {
            throw new AuraHandledException(     // throw custom exception.  
                'QuickBooks Customer Id not found'
            );
        }
        Set<String> billIds = new Set<String>();
        List<Bill__c> bills = fetchBills(accountRecord, billIds);
        List<Bill_Payment__c> payments =   fetchBillPayments(accountRecord, billIds);

        if(!bills.isEmpty()) {
            insert bills;
        }

        if(!payments.isEmpty()) {
            insert payments;
        }
    }

    public static List<Bill__c> fetchBills(Account accountRecord, Set<String> billIds) {
        List<Bill__c> billsToInsert = new List<Bill__c>();
        String query = 'select * from Bill';
        HttpRequest request = new HttpRequest();

        request.setEndpoint('callout:QuickBooksNameCredential' + '/v3/company/9341457160598857/query?query=' + EncodingUtil.urlEncode(query, 'UTF-8'));
        request.setMethod('GET');
        request.setHeader('Accept', 'application/json');
        request.setHeader('Content-Type', 'application/text');

        Http http = new Http();
        HttpResponse res = http.send(request);
 
        System.debug('Bills Response : ' + res.getBody());

        if(res.getStatusCode() == 200) {
            Map<String,Object> response = (Map<String,Object>) JSON.deserializeUntyped(res.getBody());
            Map<String,Object> queryResponse = (Map<String,Object>) response.get('QueryResponse');
            if(queryResponse != null && queryResponse.containsKey('Bill')) {
                List<Object> billList = (List<Object>) queryResponse.get('Bill');
                for(Object obj : billList) {
                    Map<String,Object> bill = (Map<String,Object>) obj;
                    List<Object> lineList = (List<Object>) bill.get('Line');
                    Boolean customerMatched = false;
                    if(lineList != null) {
                        for(Object lineObj : lineList) {
                            Map<String,Object> line = (Map<String,Object>) lineObj;
                            if(line.containsKey('AccountBasedExpenseLineDetail')) {
                                Map<String,Object> detailMap = (Map<String,Object>) line.get('AccountBasedExpenseLineDetail');
                                if(detailMap.containsKey('CustomerRef')) {
                                    Map<String,Object> customerRef = (Map<String,Object>) detailMap.get('CustomerRef');
                                    String customerId = String.valueOf(customerRef.get('value'));
                                    if(customerId == accountRecord.Quickbooks_Customer_Id__c) {
                                        customerMatched = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if(customerMatched) {
                        Bill__c b = new Bill__c();
                        b.Account__c = accountRecord.Id;
                        b.Name = 'Bill-' + String.valueOf(bill.get('Id'));
                        b.Quickbooks_Bill_Id__c = String.valueOf(bill.get('Id'));
                        if(bill.containsKey('TotalAmt')) {
                            b.Amount__c = Decimal.valueOf(String.valueOf(bill.get('TotalAmt')));
                        }
                        if(bill.containsKey('DueDate')) {
                            b.Due_Date__c = Date.valueOf(String.valueOf(bill.get('DueDate')));
                        }
                        billsToInsert.add(b);
                        billIds.add(String.valueOf(bill.get('Id')));
                    }
                }
            }
        }
        return billsToInsert;
    }

    public static List<Bill_Payment__c> fetchBillPayments(Account accountRecord, Set<String> billIds) {
        List<Bill_Payment__c> paymentsToInsert = new List<Bill_Payment__c>();
        String query = 'select * from BillPayment';
        HttpRequest request = new HttpRequest();

        request.setEndpoint('callout:QuickBooksNameCredential' + '/v3/company/9341457160598857/query?query=' + EncodingUtil.urlEncode(query, 'UTF-8'));
        request.setMethod('GET');
        request.setHeader('Accept', 'application/json');
        request.setHeader('Content-Type', 'application/text');

        Http http = new Http();
        HttpResponse res = http.send(request);
        System.debug('Payments Response : ' + res.getBody());

        if(res.getStatusCode() == 200) {
            Map<String,Object> response = (Map<String,Object>) JSON.deserializeUntyped(res.getBody());
            Map<String,Object> queryResponse = (Map<String,Object>) response.get('QueryResponse');

            if(queryResponse != null && queryResponse.containsKey('BillPayment' )) {
                List<Object> paymentList = (List<Object>) queryResponse.get('BillPayment');
                for(Object obj : paymentList) {
                    Map<String,Object> payment = (Map<String,Object>) obj;
                    Boolean matched = false;
                    List<Object> lineList = (List<Object>) payment.get('Line');
                    if(lineList != null) {
                        for(Object lineObj : lineList) {
                            Map<String,Object> line = (Map<String,Object>) lineObj;
                            List<Object> linkedTxnList = (List<Object>) line.get('LinkedTxn');
                            if(linkedTxnList != null) {
                                for(Object txnObj : linkedTxnList) {
                                    Map<String,Object> txn = (Map<String,Object>) txnObj;
                                    String txnId = String.valueOf(txn.get('TxnId'));
                                    if(billIds.contains(txnId)) {
                                        matched = true;
                                        break;
                                    }
                                }
                            }
                            if(matched) {
                                break;
                            }
                        }
                    }
                    if(matched) {
                        Bill_Payment__c bp = new Bill_Payment__c();
                        bp.Account__c = accountRecord.Id;
                        bp.Name = 'Payment-' + String.valueOf(payment.get('Id'));
                        bp.Payment_Number__c = String.valueOf(payment.get('Id'));
                        if(payment.containsKey('TotalAmt')) {
                            bp.Amount__c = Decimal.valueOf(String.valueOf(payment.get('TotalAmt')));
                        }

                        if(payment.containsKey('TxnDate')) {
                            bp.Payment_Date__c = Date.valueOf(String.valueOf(payment.get('TxnDate')));
                        }
                        paymentsToInsert.add(bp);
                    }
                }
            }
        }

        return paymentsToInsert;
    }
}