import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {
    receivedMessage = '';

    handleData(event) {
        this.receivedMessage = event.detail;
    }
}