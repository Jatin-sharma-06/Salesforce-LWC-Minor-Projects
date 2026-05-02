import { LightningElement, api } from 'lwc';

export default class RoomList extends LightningElement {
    @api rooms;

    handleSelect(event) {
        const roomId = event.target.dataset.id;

        const selected = this.rooms.find(r => r.Id === roomId);

        const selectEvent = new CustomEvent('roomselect', {
            detail: selected
        });

        this.dispatchEvent(selectEvent);
    }
}