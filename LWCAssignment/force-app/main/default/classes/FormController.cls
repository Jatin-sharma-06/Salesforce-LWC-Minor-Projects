public with sharing class FormController {

    @AuraEnabled
    public static void saveFormData(Form_Data__c formData) {
        insert formData;
    }
}