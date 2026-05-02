import { LightningElement, wire } from 'lwc'; 
 
import { getObjectInfo } from 'lightning/uiObjectInfoApi'; 
 
import ACCOUNT_OBJECT from '@salesforce/schema/Account'; 
 
export default class ObjectInfoDemo extends LightningElement { 
 
   @wire(getObjectInfo, { 
       objectApiName: ACCOUNT_OBJECT 
   }) 
   objectInfo; 
 
   get objectLabel() { 
       return this.objectInfo.data 
           ? this.objectInfo.data.label 
           : ''; 
   } 
 
   get apiName() { 
       return this.objectInfo.data 
           ? this.objectInfo.data.apiName 
           : ''; 
   } 
}