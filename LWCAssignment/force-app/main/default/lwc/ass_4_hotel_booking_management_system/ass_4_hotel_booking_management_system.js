import { LightningElement } from 'lwc';
import getRooms from '@salesforce/apex/HotelRoomController.getAvailableRooms';
import createBooking from '@salesforce/apex/CreateBooking.createBooking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ass_4_hotel_booking_management_system extends LightningElement {

    rooms = [];
    selectedRoom = null;
    bookingDetails = {};
    totalAmount = 0;

    connectedCallback() {
        this.loadRooms();
    }

    loadRooms() {
        getRooms()
            .then(result => {
                this.rooms = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleRoomSelect(event) {
        this.selectedRoom = event.detail;
        this.calculateTotal();
    }

    handleBookingChange(event) {
        this.bookingDetails = event.detail;

        const { checkIn, checkOut } = this.bookingDetails;

        if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
            this.showToast('Error', 'Check-out must be after check-in', 'error');
            return;
        }

        this.calculateTotal();
    }

    calculateTotal() {
        if (!this.selectedRoom) {
            this.totalAmount = 0;
            return;
        }

        const { checkIn, checkOut, extraServices } = this.bookingDetails;

        if (!checkIn || !checkOut) {
            this.totalAmount = 0;
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            this.totalAmount = 0;
            return;
        }

        let total = days * this.selectedRoom.Price__c;

        if (extraServices) {
            total += 500;
        }

        this.totalAmount = total;
    }

    handleBookingSubmit(event) {
        const data = event.detail;

        if (!this.selectedRoom) {
            this.showToast('Error', 'Please select a room first', 'error');
            return;
        }

        createBooking({
            name: data.name,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            roomId: this.selectedRoom.Id
        })
        .then(() => {
            this.showToast('Success', 'Booking Created Successfully', 'success');

            this.bookingDetails = {};
            this.totalAmount = 0;
            this.selectedRoom = null;

            this.template.querySelector('c-booking-form')?.resetForm?.();

            // reload rooms
            this.loadRooms();
        })
        .catch(error => {
            this.showToast('Error', error.body?.message || 'Failed to create booking', 'error');
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}