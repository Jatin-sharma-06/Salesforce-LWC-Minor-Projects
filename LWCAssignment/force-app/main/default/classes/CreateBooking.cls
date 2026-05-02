public with sharing class CreateBooking {

    @AuraEnabled
    public static void createBooking(String name, Date checkIn, Date checkOut, Id roomId) {

        if (String.isBlank(name) || checkIn == null || checkOut == null || roomId == null) {
            throw new AuraHandledException('All fields are required');
        }

        if (checkOut <= checkIn) {
            throw new AuraHandledException('Check-out must be after check-in');
        }

        // Double booking check
        List<Booking__c> existing = [
            SELECT Id FROM Booking__c
            WHERE Room__c = :roomId
            AND (Check_In__c <= :checkOut AND Check_Out__c >= :checkIn)
        ];

        if (!existing.isEmpty()) {
            throw new AuraHandledException('Room already booked for selected dates');
        }

        // Create booking
        Booking__c booking = new Booking__c(
            Name = name,
            Check_In__c = checkIn,
            Check_Out__c = checkOut,
            Room__c = roomId
        );

        insert booking;

        // Mark room unavailable
        Room__c room = [SELECT Id, Available__c FROM Room__c WHERE Id = :roomId LIMIT 1];
        room.Available__c = false;
        update room;
    }
}