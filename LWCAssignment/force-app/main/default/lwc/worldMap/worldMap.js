import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/leaflet';
import getLatLong from '@salesforce/apex/StreetMapController.getLatLong';

export default class worldMap extends LightningElement {

    @track inputValue = '';
    
    map;
    markers = [];
    isLibLoaded = false;

    renderedCallback() {

        if (this.isLibLoaded) {
            return;
        }

        this.isLibLoaded = true;

        Promise.all([
            loadStyle(this, LEAFLET + '/leaflet.css'),
            loadScript(this, LEAFLET + '/leaflet.js')
        ])
        .then(() => {
            this.initializeMap();
        })
        .catch(error => {
            console.error('Leaflet Load Error:', error);
        });
    }

    initializeMap() {
        const container = this.template.querySelector('.map-container');
        this.map = L.map(container).setView([20, 0], 2);
        //console.log(L.map(container).setView([20, 0], 2));
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '© OpenStreetMap contributors'
            }
        ).addTo(this.map);
        //after 0.5 second refresh map size
        setTimeout(() => {
            this.map.invalidateSize();
        }, 500);        
    }

    handleInputChange(event) {
        this.inputValue = event.target.value;
    }

    handleKeyPress(event) {
        if(event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    async handleSubmit() {
        if (!this.inputValue) {
            return;
        }

        const locations = this.inputValue.split(',').map(item => item.trim()).filter(item => item);
        for (let loc of locations) {
            try {
                const result = await getLatLong({ locationName: loc });
                console.log('API Result:', result);

                const data = JSON.parse(result);
                console.log('Parsed Data:', data);

                console.log('this data is used for the feature extraction : ' + data.fearures[0].geometry.coordinates);

                if ( data.features && data.features.length > 0) {
                    const coords = data.features[0].geometry.coordinates;
                    const longitude = coords[0];
                    const latitude = coords[1];
                    this.addMarker( latitude, longitude, loc);
                } else {
                    alert('Location not found: ' + loc);
                }
            } catch (error) {
                console.error('Location Error:', error);
                if (error.body && error.body.message) {
                    alert(error.body.message);
                } else {
                    alert('Error fetching location: ' + loc);
                }
            }
        }
        this.inputValue = '';
    }

    addMarker(lat, lng) {
        const count = this.markers.length + 1;

        let color;
        if(count === 1) {
            color = 'blue';
        } else if(count === 2) {
            color = 'green';
        } else if (count === 3) {
            color = 'red';
        } else {
            color = 'yellow';
        }

        const markerHtmlStyles = `
            background-color: ${color};
            width: 2rem;
            height: 2rem;
            display: block;
            left: -1rem;
            top: -1rem;
            position: relative;
            border-radius: 2rem 2rem 0;
            transform: rotate(45deg);
            border: 2px solid #FFFFFF;
            box-shadow: 0 0 5px #0000004d;
        `;

        const icon = L.divIcon({
            className: 'custom-pin',
            iconAnchor: [0, 24],
            popupAnchor: [0, -36],
            html:
                `<span style="${markerHtmlStyles}"></span>`
        });

        const marker = L.marker(
            [lat, lng],
            { icon: icon }
        ).addTo(this.map);

        this.markers.push(marker);
        this.map.flyTo([lat, lng], 8);
    }

    handleClear() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
        this.map.setView([20, 0], 2);
    }
}