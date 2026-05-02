public with sharing class FormController {
    // Assignment 3 : LWC Form
    @AuraEnabled
    public static void saveFormData(Form_Data__c formData) {
        insert formData;
    }
}