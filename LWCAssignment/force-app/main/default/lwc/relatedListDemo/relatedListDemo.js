import { LightningElement, api, wire } from 'lwc'; 
 
import { getRelatedListRecords } from 'lightning/uiRelatedListApi'; 
 
export default class RelatedListDemo extends LightningElement { 
 
   @api recordId; 
 
   @wire(getRelatedListRecords, { 
       parentRecordId: '$recordId', 
       relatedListId: 'Contacts', 
       fields: ['Contact.Name'] 
   }) 
   relatedContacts; 
 
   get contacts() { 
       return this.relatedContacts.data 
           ? this.relatedContacts.data.records 
           : []; 
   } 
}