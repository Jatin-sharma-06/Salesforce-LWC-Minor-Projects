import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import MARKUS_METRO from '@salesforce/resourceUrl/MarkusMetro';

export default class MarkusMetro extends LightningElement {
    clockImg = MARKUS_METRO + '/Clock.png';
    metroImg = MARKUS_METRO + '/Metro.png';
    railwayLinesImg = MARKUS_METRO + '/RailwayLines.png';
    stationMasterImg = MARKUS_METRO + '/StationMaster.png';

    showClockModal = false;
    showStationMasterModal = false;
    selectedTime = '';
    currentDisplayTime = '';
    newTrain = {
        name: '',
        arrival: '',
        departure: '',
        track: '1'
    };

    trackOptions = [
        { label: 'Track 1', value: '1' },
        { label: 'Track 2', value: '2' },
        { label: 'Track 3', value: '3' },
        { label: 'Track 4', value: '4' },
        { label: 'Track 5', value: '5' },
        { label: 'Track 6', value: '6' }
    ];

    trains = [
        {
            id: 1,
            name: 'Metro Express',
            arrival: '08:00',
            departure: '08:20',
            track: '1'
        },
        {
            id: 2,
            name: 'Blue Line',
            arrival: '09:00',
            departure: '09:30',
            track: '4'
        }
    ];
    columns = [
        {
            label: 'Train Name',
            fieldName: 'name',
            type: 'text'
        },
        {
            label: 'Track',
            fieldName: 'track',
            type: 'text'
        },
        {
            label: 'Arrival',
            fieldName: 'arrival',
            type: 'text'
        },
        {
            label: 'Departure',
            fieldName: 'departure',
            type: 'text'
        }
    ];

    get platforms() {
        return [
            {
                id: 1,
                label: 'Platform 1',
                tracks: [
                    this.buildTrack('1'),
                    this.buildTrack('2')
                ]
            },
            {
                id: 2,
                label: 'Platform 2',
                tracks: [
                    this.buildTrack('3'),
                    this.buildTrack('4')
                ]
            },
            {
                id: 3,
                label: 'Platform 3',
                tracks: [
                    this.buildTrack('5'),
                    this.buildTrack('6')
                ]
            },
            {
                id: 4,
                label: 'Platform 4',
                tracks: []
            }
        ];
    }

    buildTrack(trackNumber) {
        const activeTrain = this.getActiveTrain(trackNumber);
        return {
            id: trackNumber,
            trackNumber: trackNumber,
            hasTrain: activeTrain !== null, // check if train is available or not.
            trainName: activeTrain ? activeTrain.name : '',
            arrival: activeTrain ? activeTrain.arrival : '',
            departure: activeTrain ? activeTrain.departure : ''
        };
    }

    getActiveTrain(trackNumber) {
        if (!this.currentDisplayTime) {
            return null;
        }
        const currentMinutes = this.timeToMinutes(this.currentDisplayTime);
        const train = this.trains.find(item => {
            return item.track === trackNumber && (currentMinutes >= this.timeToMinutes(item.arrival)) && (currentMinutes <= this.timeToMinutes(item.departure));
        });
        return train || null;
    }

    timeToMinutes(timeValue) {
        if (!timeValue) {
            return 0;
        }
        const parts = timeValue.split(':');
        const hour = parseInt(parts[0], 10);
        const minute = parseInt(parts[1], 10);
        
        return (hour * 60) + minute;
    }

    get tableData() {
        return [...this.trains].sort((a, b) => {
            return this.timeToMinutes(a.arrival) - this.timeToMinutes(b.arrival);
        });
    }

    handleClockClick() {
        this.selectedTime = this.currentDisplayTime;
        this.showClockModal = true;
    }

    handleClockModalClose() {
        this.showClockModal = false;
    }

    handleTimeInput(event) {
        this.selectedTime = event.target.value;
    }

    handleSetTime() {
        if (!this.selectedTime) {
            this.showToast(
                'Error',
                'Please select a time',
                'error'
            );

            return;
        }

        this.currentDisplayTime = this.selectedTime;
        this.showClockModal = false;
    }

    handleStationMasterClick() {
        this.newTrain = {
            name: '',
            arrival: '',
            departure: '',
            track: '1'
        };
        this.showStationMasterModal = true;
    }

    handleStationMasterModalClose() {
        this.showStationMasterModal = false;
    }

    handleNewTrainField(event) {
        const field = event.target.dataset.field;
        this.newTrain = {
            ...this.newTrain,
            [field]: event.target.value
        };
    }

    handleAddTrain() {
        const {name, arrival, departure, track} = this.newTrain;

        if (!name || !arrival || !departure || !track) {
            this.showToast(
                'Error',
                'All fields are required',
                'error'
            );
            return;
        }

        const arrivalMinutes = this.timeToMinutes(arrival);
        const departureMinutes = this.timeToMinutes(departure);
        if (departureMinutes <= arrivalMinutes) {
            this.showToast(
                'Error',
                'Departure must be after Arrival',
                'error'
            );
            return;
        }

        // Check Track Conflict 
        const hasConflict = this.trains.some(existingTrain => {
            if (existingTrain.track !== track) {
                return false;
            }
            const existingArrival = this.timeToMinutes(existingTrain.arrival);
            const existingDeparture = this.timeToMinutes(existingTrain.departure );

            return (arrivalMinutes < existingDeparture && departureMinutes > existingArrival );
        });

        if (hasConflict) {
            this.showToast('Error', 'Selected track is already occupied during this time.', 'error');
            return;
        }

        const newId = this.trains.length > 0 ? Math.max( ...this.trains.map( item => item.id ) ) + 1 : 1;
        const trainRecord = { id: newId, name: name, arrival, departure, track};
        this.trains = [...this.trains, trainRecord];
        this.showStationMasterModal = false;
        this.showToast( 'Success', 'Train added successfully', 'success');
    }

    showToast(title, message, variant ) {
        this.dispatchEvent(
            new ShowToastEvent({title, message, variant})
        );
    }

    get hasDisplayTime() {
        return !!this.currentDisplayTime;
    }

    get tableData() {
        return this.trains.map(train => {
            let status = 'Scheduled';
            if (this.currentDisplayTime) {
                const current = this.timeToMinutes(this.currentDisplayTime);
                const arrival = this.timeToMinutes(train.arrival);
                const departure = this.timeToMinutes(train.departure);
                if (current >= arrival && current <= departure) {
                    status = 'At Station';
                }
                else if (current > departure) {
                    status = 'Departed';
                }
            }
            return {...train, status};
        });
    }

    get trainCount() {
        return this.trains.length;
    }

    formatTime(timeValue) {
        if (!timeValue) {
            return '';
        }
        return timeValue.substring(0, 5);
    }
}