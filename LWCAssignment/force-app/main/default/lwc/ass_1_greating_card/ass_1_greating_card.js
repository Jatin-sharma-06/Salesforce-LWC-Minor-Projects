import { LightningElement } from 'lwc';

export default class GreetingComponent extends LightningElement {
    name = 'Guest';
    tempName = '';
    nameList = [];

    handleChange(event) {
        this.tempName = event.target.value;
    }

    handleClick() {
        this.name = this.tempName || 'Guest';

        //alert(this.name);

        this.nameList.push(this.name);
        console.log(this.nameList);
    }
}