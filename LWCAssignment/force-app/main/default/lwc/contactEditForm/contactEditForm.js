import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactEditForm extends LightningElement {

    @api recordId; // 🔥 dynamic (comes from record page)

    handleSubmit() {
        console.log('Form Submitted');
    }

    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact updated successfully',
                variant: 'success'
            })
        );
    }

    handleCancel() {
        // 🔥 Reset form
        const fields = this.template.querySelectorAll('lightning-input-field');
        if (fields) {
            fields.forEach(field => field.reset());
        }
    }
}