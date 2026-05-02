import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseRecordForm extends LightningElement {

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Case record created successfully!',
            variant: 'success'
        });
        this.dispatchEvent(evt);
    }
}