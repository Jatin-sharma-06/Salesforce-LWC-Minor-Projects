import { LightningElement, wire } from 'lwc'; 
 
import { getObjectInfo } from 'lightning/uiObjectInfoApi'; 
 
import { getPicklistValues } from 'lightning/uiObjectInfoApi'; 
 
import ACCOUNT_OBJECT from '@salesforce/schema/Account'; 
 
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry'; 
 
export default class PicklistDemo extends LightningElement { 
 
   recordTypeId; 
 
   @wire(getObjectInfo, { 
       objectApiName: ACCOUNT_OBJECT 
   }) 
   objectInfo({ data }) { 
 
       if (data) { 
           this.recordTypeId = data.defaultRecordTypeId; 
       } 
   } 
 
   @wire(getPicklistValues, { 
       recordTypeId: '$recordTypeId', 
       fieldApiName: INDUSTRY_FIELD 
   }) 
   picklistValues; 
 
   get industryOptions() { 
       return this.picklistValues.data 
           ? this.picklistValues.data.values 
           : []; 
   } 
}