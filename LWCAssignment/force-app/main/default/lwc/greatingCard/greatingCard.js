import { LightningElement } from 'lwc';

export default class greetingCard extends LightningElement {
	name = 'Guest';
	tempName = '';
	nameList = [];

	handleChange(event) {
		this.tempName = event.target.value;

		console.log("user input "  +  this.tempName);

		const a = 20;
		console.log("Value of a : " + a);
		a = 30;
		console.log("Value of a : " + a);
	}
	

	handleClick() {
		this.name = this.tempName || this.name;

		this.nameList.push(this.name);
		

		console.log("Name List : " + this.nameList);
	
	}

}