import { LightningElement } from "lwc";
import bulletImages from "@salesforce/resourceUrl/HoneycombBulletpoint";

export default class HorseRaceBoard extends LightningElement {
    todayDate = new Date().toLocaleDateString();
    redBullet = bulletImages + "/HoneycombBulletpoint_colorRed.png";
    greenBullet = bulletImages + "/HoneycombBulletpoint_colorGreen.png";

    myLots = [];
    races = [];

    isLoading = true;

    currentView = 'races'; 

    // Getter for template conditional directives
    get isRacesView() {
        return this.currentView === 'races';
    }

    get isLotsView() {
        return this.currentView === 'lots';
    }

    handleViewChange(event) {
        this.currentView = event.target.dataset.view;
    }

    connectedCallback() {
        const day = new Date().getDay();
        const totalRaces = (day === 0 || day === 6) ? 4 : 3; //4 races on weekend else 3

        for (let i = 1; i <= totalRaces; i++) {
            this.races.push(this.createRace(i,"R"+i));
        }

        setTimeout(()=>{
            this.isLoading = false;
        }, 1000);
    }

    createRace(id, name) {
        return {
            id: id,
            name: name,
            status: "Scheduled",
            startDisabled: false,
            endDisabled: true,

            horses: [
                this.createHorse(id * 10 + 1, "Flying Beast"),
                this.createHorse(id * 10 + 2, "Earth Fire"),
                this.createHorse(id * 10 + 3, "Thunder Beetal"),
                this.createHorse(id * 10 + 4, "Water Doom"),
                this.createHorse(id * 10 + 5, "KnightRider "),
                this.createHorse(id * 10 + 6, "Flying Furry"),
                this.createHorse(id * 10 + 7, "Charlie"),
                this.createHorse(id * 10 + 8, "Spring Boss")
            ]
        };
    }

    createHorse(id, name) {
        return {
            id: id,
            name: name,
            selected: false,
            icon: this.redBullet,
            buttonLabel: "Select",
        };
    }

    startRace(event) {
        const raceId = Number(event.target.dataset.raceid);

        this.races = this.races.map((race) => {
            if (race.id === raceId) {
                race.status = "Ongoing";
                race.startDisabled = true;
                race.endDisabled = false;
            }
            return race;
        });
    }

    endRace(event) {
        const raceId = Number(event.target.dataset.raceid);

        this.races = this.races.map((race) => {
            if (race.id === raceId) {
                const randomIndex = Math.floor(
                    Math.random() * race.horses.length
                );

                const winnerHorse = race.horses[randomIndex];

                race.displayWinner = winnerHorse.name;
                race.status = "Completed";
                race.startDisabled = true; //start/end disable after race completed
                race.endDisabled = true;

                // Update winner in My Lots
                this.myLots = this.myLots.map((lot) => {
                    if (lot.raceName === race.name) {
                        return {
                            ...lot,
                            winner: winnerHorse.name
                        };
                    }
                    return lot;
                });

                race.horses = race.horses.map((horse) => {
                    horse.selected = false;
                    horse.icon = this.redBullet;
                    horse.buttonLabel = "Select";
                    return horse;
                });
            }

            return race;
        });
    }

    selectHorse(event) {
        const raceId = Number(event.target.dataset.raceid);
        const horseId = Number(event.target.dataset.horseid);

        this.races = this.races.map((race) => {
            if (race.id === raceId) {

                if (race.status === "Ongoing") {
                    alert("Race already started");
                    return race;
                }

                race.horses = race.horses.map((horse) => {
                    if (horse.id === horseId) {
                        horse.selected = true;
                        horse.icon = this.greenBullet;
                        horse.buttonLabel = "Deselect";

                        this.addMyLot(race, horse);
                    } else {
                        horse.selected = false;
                        horse.icon = this.redBullet;
                        horse.buttonLabel = "Select";
                    }

                    return horse;
                });
            }

            return race;
        });
    }

    addMyLot(race, horse) {

        // One horse per race
        this.myLots = this.myLots.filter(
            (item) => item.raceName !== race.name
        );

        this.myLots = [
            ...this.myLots,
            {
                id: Date.now(),
                date: this.todayDate,
                raceName: race.name,
                horseName: horse.name,
                winner: race.displayWinner
            }
        ];
    }

    removeMyLot(raceName) {
        this.myLots = this.myLots.filter(
            (item) => item.raceName !== raceName
        );
    }

}