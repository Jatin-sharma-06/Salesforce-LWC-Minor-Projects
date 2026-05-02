import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {
    @api message; // receives data from parent
}