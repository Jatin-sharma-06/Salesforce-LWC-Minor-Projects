import { LightningElement } from 'lwc';

export default class PixelEraRainbow extends LightningElement {
    season = 'Spring';
    dayTime = 'Morning';
    clock = '12';

    seasonOptions = [
        { label:'Spring', value:'Spring' },
        { label:'Winter', value:'Winter' },
        { label:'Summer', value:'Summer' }
    ];

    dayOptions = [
        { label:'Morning', value:'Morning' },
        { label:'Noon', value:'Noon' },
        { label:'Evening', value:'Evening' }
    ];

    clockOptions = [
        { label:'12', value:'12' },
        { label:'3', value:'3' },
        { label:'6', value:'6' },
        { label:'9', value:'9' }
    ];

    handleSeason(event){
        this.season = event.target.value;
    }

    handleDay(event){
        this.dayTime = event.target.value;
    }

    handleClock(event){
        this.clock = event.target.value;
    }

    /* Day Effect */
    get effectClass(){
        if(this.dayTime === 'Morning'){
            return 'morning';
        } else if(this.dayTime === 'Evening'){
            return 'evening';
        }
        return '';
    }
    
    /* Direction */
    get directionClass(){
        if(this.clock === '3'){
            return 'east';
        } else if(this.clock === '6'){
            return 'south';
        } else if(this.clock === '9'){
            return 'west';
        }
        return 'north';
    }

    get c1(){ return 'arc arc1 ' + this.getColor(0) + ' ' + this.effectClass; }
    get c2(){ return 'arc arc2 ' + this.getColor(1) + ' ' + this.effectClass; }
    get c3(){ return 'arc arc3 ' + this.getColor(2) + ' ' + this.effectClass; }
    get c4(){ return 'arc arc4 ' + this.getColor(3) + ' ' + this.effectClass; }
    get c5(){ return 'arc arc5 ' + this.getColor(4) + ' ' + this.effectClass; }
    get c6(){ return 'arc arc6 ' + this.getColor(5) + ' ' + this.effectClass; }   

    getColor(i){
        let spring = ['red','orange','yellow','green','blue','indigo'];
        let winter = ['blue1','blue2','blue3','blue4','blue5','blue6'];
        let summer = ['red','orange','yellow','red','orange','yellow'];

        if(this.season === 'Winter'){
            return winter[i];
        } else if(this.season === 'Summer'){
            return summer[i];
        }
        return spring[i];
    }

    
}