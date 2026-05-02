import { LightningElement } from 'lwc';

export default class Calculator extends LightningElement {
	display='';

	buttons = [
		'7','8','9','C',
		'4','5','6','/',
		'1','2','3','*',
		'0','+','-','='
	];

	handleKeyPress(event) {
		const key = event.key;

		if(!isNaN(key) || ['+', '-', '*', '/'].includes(key)) {
			this.display += key;
		} else if (key === 'Enter') {
			this.calculate();
		} else if (key === 'Backspace') {
			this.display = this.display.slice(0, -1);
		} else if (key.toLowerCase() === 'c' ) {
			this.display = '';
		}			
	}

	handleClick(event) {
		let value = event.target.dataset.value;

		if(value === 'C') {
			this.display = '';
		} else if (value === '=') {
			this.calculate();
		} else {
			this.display += value;
		}
	}
	
	calculate() {
		let tokens = this.display.match(/(\d+|\+|\-|\*|\/)/g);
		let result = parseInt(tokens[0]);

		for( let i = 1; i < tokens.length; i+=2) {
			let op = tokens[i];
			let num = parseInt(tokens[i + 1]);

			if (op === '+') {
				result += num;
			} else if (op === '-') {
				result -= num;
			} else if (op === '*') {
				result *= num;
			} else if (op === '/') {
				result /= num;
			}
		}

		this.display = result;
	}
}