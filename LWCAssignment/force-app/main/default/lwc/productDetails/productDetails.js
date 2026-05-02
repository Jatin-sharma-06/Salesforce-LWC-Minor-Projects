import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import PRODUCT_CHANNEL from '@salesforce/messageChannel/ProductMessageChannel__c';

export default class ProductDetails extends LightningElement {

    @wire(MessageContext)
    messageContext;

    subscription = null;
    product;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            PRODUCT_CHANNEL,
            (message) => {
                this.product = message.product;
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}