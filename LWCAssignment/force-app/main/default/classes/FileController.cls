public with sharing class FileController {
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getFiles(Id recordId) {

        List<ContentDocumentLink> links = [
            SELECT ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :recordId
        ];

        Set<Id> documentIds = new Set<Id>();

        for(ContentDocumentLink link : links) {
            documentIds.add(link.ContentDocumentId);
        }

        if(documentIds.isEmpty()) {
            return new List<ContentVersion>();
        }

        return [
            SELECT Id, Title, FileType, FileExtension, ContentSize, ContentDocumentId, CreatedDate
            FROM ContentVersion
            WHERE ContentDocumentId IN :documentIds
            AND IsLatest = true
            ORDER BY CreatedDate DESC
        ];
    }

}