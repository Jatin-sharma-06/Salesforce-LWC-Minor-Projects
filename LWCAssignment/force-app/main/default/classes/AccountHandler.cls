public class AccountHandler {
    public static void afterInsert(List<Account> newAccountList) {
        System.debug('Trigger called here, inside handler');

        List<Id> accountIds = new List<Id>();
        for(Account accountRecord : newAccountList) {
            accountIds.add(accountRecord.Id);
        }

        if(accountIds != null && !accountIds.isEmpty()) {
            //System.debug('Queueable call start here.');
            Integer startIndex = 0;
            Integer endIndex = accountIds.size();
            System.enqueueJob(new AccountQueueable(accountIds, startIndex, endIndex)); 
        }
        else {
            System.debug('empty accountIds in handler.');
        }
    }
}