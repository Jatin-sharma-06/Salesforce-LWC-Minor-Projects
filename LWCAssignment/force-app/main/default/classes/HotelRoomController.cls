public with sharing class HotelRoomController {
    @AuraEnabled(cacheable=true)
    public static List<Room__c> getAvailableRooms(){
        return [
            SELECT Id, Name, Room_Type__c, Price__c, Available__c FROM Room__c WHERE Available__c = true ORDER BY Price__c ASC
        ];
    }
}