import { LightningElement, api, track } from 'lwc';

export default class BookingForm extends LightningElement {

    @api selectedRoom;

    @track formData = {
        name: '',
        checkIn: '',
        checkOut: '',
        extraServices: false
    };

    handleChange(event) {
        const field = event.target.name;

        const value = field === 'extraServices' ? event.target.checked : event.target.value;

        this.formData = {
            ...this.formData,
            [field]: value
        };

        this.dispatchEvent(new CustomEvent('bookingchange', {
            detail: { ...this.formData }
        }));
    }

    handleSubmit() {
        this.dispatchEvent(new CustomEvent('booknow', {
            detail: { ...this.formData }
        }));
    }

    @api
    resetForm() {
        this.formData = {
            name: '',
            checkIn: '',
            checkOut: '',
            extraServices: false
        };
    }
}