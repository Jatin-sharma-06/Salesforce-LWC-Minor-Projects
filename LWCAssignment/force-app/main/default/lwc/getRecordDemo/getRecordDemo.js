import { LightningElement, api, wire } from 'lwc'; 
 
import { getRecord } from 'lightning/uiRecordApi'; 
 
import NAME_FIELD from '@salesforce/schema/Account.Name'; 
import PHONE_FIELD from '@salesforce/schema/Account.Phone'; 
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry'; 
 
export default class GetRecordDemo extends LightningElement { 
 
   @api recordId; 
 
  @wire(getRecord, { 
       recordId: '$recordId', 
       fields: [NAME_FIELD, PHONE_FIELD, INDUSTRY_FIELD] 
   }) 
   account; 
 
   get accountName() { 
       return this.account.data 
           ? this.account.data.fields.Name.value 
           : ''; 
   } 
 
   get phone() { 
       return this.account.data 
           ? this.account.data.fields.Phone.value 
           : ''; 
   } 
 
   get industry() { 
       return this.account.data 
           ? this.account.data.fields.Industry.value 
           : ''; 
   } 
}