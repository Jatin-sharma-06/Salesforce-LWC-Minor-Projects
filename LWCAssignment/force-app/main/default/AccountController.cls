public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getRecentAccounts() {

        return [
            SELECT Id, Name, Type, Industry, Phone, CreatedDate
            FROM Account
            WHERE CreatedDate = LAST_N_DAYS:30
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void deleteAccount(Id accountId) {

        Account acc = [
            SELECT Id
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];

        delete acc;
        system.debug('Account deleted successfully.' + acc);
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Phone, Industry, Type  FROM Account];
    }
}