import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_CHANNEL from '@salesforce/messageChannel/ProductMessageChannel__c';

export default class ProductList extends LightningElement {

    @wire(MessageContext)
    messageContext;

    products = [
        { Id: '1', Name: 'Laptop', Price: 70000, Category: 'Electronics' },
        { Id: '2', Name: 'Phone', Price: 30000, Category: 'Electronics' },
        { Id: '3', Name: 'Watch', Price: 8000, Category: 'Accessories' }
    ];

    handleSelect(event) {
        const id = event.currentTarget.dataset.id;
        const selected = this.products.find(p => p.Id === id);

        publish(this.messageContext, PRODUCT_CHANNEL, {
            product: selected
        });
    }
}