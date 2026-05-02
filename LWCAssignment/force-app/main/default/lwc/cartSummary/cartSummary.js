import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import PRODUCT_CHANNEL from '@salesforce/messageChannel/ProductMessageChannel__c';

export default class CartSummary extends LightningElement {

    @wire(MessageContext)
    messageContext;

    subscription;
    cart = [];

    get count() {
        return this.cart.length;
    }

    get total() {
        return this.cart.reduce((sum, p) => sum + (p?.Price || 0), 0);
    }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            PRODUCT_CHANNEL,
            (message) => {
                if (message?.product) {
                    this.cart = [...this.cart, message.product];
                }
            }
        );
    }

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }
}