import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import PRODUCT_CHANNEL from '@salesforce/messageChannel/ProductMessageChannel__c';

export default class NotificationPanel extends LightningElement {

    @wire(MessageContext)
    messageContext;

    subscription;
    message = 'No activity';

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            PRODUCT_CHANNEL,
            (msg) => {
                const price = msg.product.Price;
                this.message = price > 50000
                    ? 'Expensive Product'
                    : 'Product Added';
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}