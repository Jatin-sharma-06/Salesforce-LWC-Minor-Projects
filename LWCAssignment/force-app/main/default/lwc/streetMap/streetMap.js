import { LightningElement, track } from 'lwc';

export default class StateMap extends LightningElement {

    stateNames = [];
    isLoading = true;
    @track mapMarkers = [];

    connectedCallback() {
        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }

    handleChange(event) {
        this.stateNames = event.target.value;
    }

    showLocations() {
        let states = this.stateNames.split(',');
        for (let i = 0; i < states.length; i++) {
            let state = states[i].trim();
            if(state != '') {
                let color = this.getColor(this.mapMarkers.length);
                let marker = {
                    location: {
                        State: state
                    },
                    title: state,
                    description: 'Location : ' + state,
                    icon: 'standard:location',
                    mapIcon: {
                        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 Z',
                        fillColor: color,
                        fillOpacity: 1,
                        scale: 1
                    }
                };

                this.mapMarkers = [...this.mapMarkers, marker];
            }
        }
    }

    handleEnter(event) {
        if(event.keyCode === 13) {  // enter
            this.showLocations();
        }
    }

    getColor(index) {
        if(index == 0) {
            return 'blue';
        }
        else if(index == 1) {
            return 'green';
        }
        else if(index == 2) {
            return 'red';
        }
        else {
            return 'yellow';
        }
    }

    clearLocations() {
        this.mapMarkers = [];
    }
}