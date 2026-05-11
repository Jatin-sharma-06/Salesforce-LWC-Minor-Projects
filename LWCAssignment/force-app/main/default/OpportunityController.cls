// Created By :  Jatin Sharma
// Date :        07-05-2026
// Description : This class is used to fetch all closed Opportunities{either Won or Lost} inside org. 

public with sharing class OpportunityController {  

    //return all closed Opportunities.
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getAllClosedOpportunities() {
        return [
            SELECT Id, Name, Amount, CloseDate, StageName, Owner.Name, Account.Name 
            FROM Opportunity
            WHERE IsClosed = TRUE 
        ];
    }


    @AuraEnabled
    public static Integer createOpportunities(List<String> selectedDates){

        if(selectedDates == null || selectedDates.isEmpty()) {
            return 0 ;
        }

        List<Opportunity> opportunityList = new List<Opportunity>();

        for(String dateString : selectedDates) {
            Date closeDate = Date.valueOf(dateString);
            Opportunity opp = new Opportunity(
                Name = 'Opportunity - ' + dateString,
                StageName = 'Prospecting',
                CloseDate = closeDate //close date for date and time
            );
            opportunityList.add(opp);
        }

        insert opportunityList;
        return opportunityList.size();
    }
}

