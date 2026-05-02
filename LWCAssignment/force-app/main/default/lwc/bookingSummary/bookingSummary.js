import { LightningElement, api } from 'lwc';

export default class BookingSummary extends LightningElement {

    @api room;
    @api booking;
    @api total;

    get totalDays() {
        if (!this.booking?.checkIn || !this.booking?.checkOut) {
            return 0;
        }

        const checkIn = new Date(this.booking.checkIn);
        const checkOut = new Date(this.booking.checkOut);

        return Math.floor(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
}