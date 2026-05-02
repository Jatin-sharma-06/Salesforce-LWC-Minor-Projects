import { LightningElement } from 'lwc';

export default class LifecycleDemo extends LightningElement {
    count = 0;

    constructor() {
        super();
        console.log('1. Constructor called');
    }

    connectedCallback() {
        console.log('2. Connected Callback called');
    }

    render() {
        console.log('3. Render method called');
        return super.render();
    }

    renderedCallback() {
        console.log('4. Rendered Callback called');
    }

    disconnectedCallback() {
        console.log('5. Disconnected Callback called');
    }

    errorCallback(error, stack) {
        console.log('6. Error Callback called', error, stack);
    }

    handleClick() {
        this.count++;
    }
}