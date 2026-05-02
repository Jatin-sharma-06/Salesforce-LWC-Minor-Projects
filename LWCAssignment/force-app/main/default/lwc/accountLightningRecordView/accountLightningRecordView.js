import { LightningElement, api } from 'lwc';

export default class AccountRecordView extends LightningElement {
    @api recordId;
    @api objectApiName;
}