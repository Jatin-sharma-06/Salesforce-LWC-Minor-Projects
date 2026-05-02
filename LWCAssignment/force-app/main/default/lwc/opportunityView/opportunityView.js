import { LightningElement, api } from 'lwc';

export default class OpportunityView extends LightningElement {
    @api recordId; // it get the dynamic record id from the record page where this component is added
}