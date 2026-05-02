import { LightningElement } from 'lwc';
import saveFormData from '@salesforce/apex/FormController.saveFormData';


export default class FormComponent extends LightningElement {

    formData = {};
    isSubmitted = false;

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        this.formData = { ...this.formData, [field]: value };
    }

    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    countryOptions = [
        { label: 'India', value: 'India' },
        { label: 'USA', value: 'USA' },
        { label: 'UK', value: 'UK' }
    ];

    handleSubmit() {

        const record = {
            First_Name__c: this.formData.firstName,
            Name: this.formData.lastName,
            Email__c: this.formData.email,
            Phone__c: this.formData.phone,
            Age__c: this.formData.age,
            DOB__c: this.formData.dob,         
            Gender__c: this.formData.gender,
            Country__c: this.formData.country,    
            Description__c: this.formData.description
        };

        saveFormData({ formData: record })
            .then(() => {
                this.isSubmitted = true;
                console.log('Data Saved');

                this.formData = {};
                
                const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea');
                
                
                inputs.forEach(input => {
                    input.value = null;
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}