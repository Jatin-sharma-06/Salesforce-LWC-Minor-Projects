import { LightningElement } from 'lwc';

export default class Child extends LightningElement {

    handleClick() {

        const event = new CustomEvent('senddata', {detail : 'Hello Parent'});
        this.dispatchEvent(event);
    }
}