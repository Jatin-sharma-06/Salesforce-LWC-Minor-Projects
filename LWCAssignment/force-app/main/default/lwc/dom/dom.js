import { LightningElement } from 'lwc';

export default class ShadowExample extends LightningElement {

    handleClick() {
        const heading = this.template.querySelector('h1');
        heading.innerText = 'Text Changed!';
    }
}