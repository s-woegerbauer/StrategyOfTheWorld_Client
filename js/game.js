export class Game {
    constructor(players, countries, map, playerIndex) {
        this.currentPlayer = 0;
        this.players = players;
        this.countries = countries;
        this.map = map;
        this.phases = ["End Reinforcement", "End Attack", "End Fortification", "End Turn"];
        this.phaseIndex = 0;
        this.playerIndex = playerIndex;

        getContinentData(map).then(data => {
            this.continentData = data["continents"];
            this.continentsConquered = [];

            for(const continent of this.continentData)
            {
                this.continentsConquered.push(continent.name, "none");
            }

            this.startMap();
        });

        document.getElementById("actionBtn").addEventListener("click", () => {
            if(this.currentPlayer === this.playerIndex)
            {
                if(this.phases[this.phaseIndex] !== "End Turn") {
                    const phaseElements = Array.from(document.getElementById("actions").children);
                    phaseElements.reverse();

                    for (let i = 0; i < phaseElements.length; i++) {
                        const element = phaseElements[i];

                        element.disabled = this.phaseIndex + 1 !== i;
                    }
                }
            }


            if(this.phaseIndex + 1 === this.phases.length)
            {
                this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
                this.onPlayerChange();
            }

            if(this.phases[this.phaseIndex] !== "End Turn") {
                showOverlay(this.phases[this.phaseIndex], 2000, this.players[this.currentPlayer]);
            }

            this.phaseIndex = (this.phaseIndex + 1) % this.phases.length;
            document.getElementById("actionBtn").textContent = this.phases[this.phaseIndex];
        });
    }

    startMap() {
        const worldMap = document.getElementById('map');
        worldMap.style.backgroundImage = `url("../maps/${this.map}/sea-routes.png")`;
        this.countries = this.delegateTroops();
        this.update();
    }

    onPlayerChange() {
        if(this.currentPlayer === this.playerIndex)
        {
            const phaseElements = Array.from(document.getElementById("actions").children);
            phaseElements.reverse();

            for (let i = 0; i < phaseElements.length; i++) {
                const element = phaseElements[i];

                element.disabled = i !== 0;
            }
        }
        showOverlay("It's " + this.players[this.currentPlayer] + "'s turn", 2000, this.players[this.currentPlayer]);
    }

    update() {
        const worldMap = document.getElementById('map');

        for (let i = 0; i < this.countries.length; i++) {
            const element = worldMap;
            let contentContainer = document.createElement('div');
            contentContainer.id = this.countries[i].name;
            contentContainer.classList.add('content');
            let textWrapper = document.createElement("span");
            textWrapper.textContent = this.countries[i].troops;
            textWrapper.style.top = this.countries[i].posY + "px";
            textWrapper.style.left = this.countries[i].posX + "px";
            textWrapper.style.position = "absolute";
            textWrapper.style.zIndex = "100";
            contentContainer.appendChild(textWrapper);
            element.appendChild(contentContainer);
        }

        let i = 0;
        this.countries.forEach(country => {
            const countryElement = document.createElement('div');

            countryElement.style.position = "absolute";
            countryElement.className = `country ${country.color}`;
            countryElement.style.color = "black";
            countryElement.style.backgroundImage = `url('./maps/${this.map}/${country.name}.png')`;

            document.getElementById(this.countries[i].name).appendChild(countryElement);

            countryElement.addEventListener("click", (event) => {
                const rect = countryElement.getBoundingClientRect();
                const clickedX = event.offsetX + rect.left;
                const clickedY = event.offsetY + rect.top;

                let j = 0;
                document.querySelectorAll('.country').forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementX = clickedX - rect.left;
                    const elementY = clickedY - rect.top;

                    const img = new Image();
                    img.src = element.style.backgroundImage.replace('url("', '').replace('")', '');

                    img.onload =  () => {
                        const onClickCountry = (name) => {
                            console.log("clicked on: " + name);
                            const elementContainer = document.getElementById(name);
                            if (elementContainer.classList.contains("clicked")) {
                                elementContainer.classList.remove("clicked");
                            } else {
                                elementContainer.classList.add("clicked");
                            }
                        }

                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);

                        const imageData = ctx.getImageData(elementX, elementY, 1, 1).data;

                        if (imageData[3] !== 0) {

                            let elements = document.getElementsByClassName("clicked");
                            for (let i = 0; i < elements.length; i++) {
                                elements[i].classList.remove("clicked");
                            }

                            const name = img.src.replace(".png", "").split("/")[6];
                            onClickCountry(name);
                        }
                    };

                    j++;
                });
            });
            i++;
        });

        this.checkContinents();
    }

    delegateTroops() {
        const troopsPerPlayer = this.getTroops(this.players.length);

        // =============================== Every Country gets one troop ===============================
        const countriesPerColor = Math.floor(this.countries.length / this.players.length);
        console.log(this.countries.length / this.players.length)
        const left = new Array(this.players.length).fill(countriesPerColor);

        for (let i = 0; i < this.countries.length - (countriesPerColor * this.players.length); i++) {
            left[i]++;
        }
        const leftRec = Array.from(left);

        for (let countryIndex = 0; countryIndex < this.countries.length; countryIndex++) {
            let rnd;

            do {
                rnd = Math.floor(Math.random() * this.players.length)
            } while (left[rnd] === 0);

            left[rnd]--;

            this.countries[countryIndex].color = this.players[rnd];
            this.countries[countryIndex].troops = 1;
        }
        // ============================================================================================


        // ================================ Rest is randomly delegated ================================
        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < troopsPerPlayer - leftRec[i]; j++) {
                this.countries[this.getIndexOfRandomCountryOfPlayer(this.players[i], this.countries)].troops++;
            }
        }
        // ============================================================================================

        return this.countries;
    }

    getIndexOfRandomCountryOfPlayer(color) {
        const count = this.countries.filter(value => value.color === color).length;
        const rnd = Math.floor(Math.random() * count);
        let curI = 0;

        for (let i = 0; i < this.countries.length; i++) {
            if (this.countries[i].color === color) {
                if (curI === rnd)
                    return i;

                curI++;
            }
        }
    }

    getTroops(amountOfPlayers) {
        switch (amountOfPlayers) {
            case 2:
                return 40;
            case 3:
                return 35;
            case 4:
                return 25;
            case 5:
                return 20;
            case 6:
                return 15;
            case 7:
                return 15;
            case 8:
                return 10;
            default:
                break;
        }
        return 0;
    }

    log() {
        let newCountries = this.countries.sort((a, b) => {
            return a.color.localeCompare(b.color);
        });
        for (let i = 0; i < newCountries.length; i++) {
            console.log(newCountries[i].name + " | " + newCountries[i].color + " | " + newCountries[i].troops)
        }
    }

    checkContinents() {

        for(const continent of this.continentData)
        {
            const countries = this.countries.filter(country => continent.countries.includes(country.name));
            let color = countries[0].color;

            for(const country of countries)
            {
                if(country.color !== countries[0].color)
                {
                    color = undefined;
                    this.onNotContinent(continent);
                }
            }

            if(color)
            {
                this.onContinent(continent, color)
            }
        }
    }

    onContinent(continent, color)
    {
        if(this.continentsConquered[this.continentsConquered.indexOf(continent.name) + 1] !== color)
        {
            this.continentsConquered[this.continentsConquered.indexOf(continent.name) + 1] = color;

            showOverlay(color + " has conquered " + continent.name, 4000, color)
        }

        for(const country of this.countries.filter(country => continent.countries.includes(country.name)))
        {
            document.getElementById(country.name).children[1].classList.add("continent-" + color);
            document.getElementById(country.name).children[1].classList.add("conquered");
        }
    }

    onNotContinent(continent)
    {
        this.continentsConquered[this.continentsConquered.indexOf(continent.name) + 1] = "none";

        for(const country of this.countries.filter(country => continent.countries.includes(country.name)))
        {
            removeClassesWithSpecificString(document.getElementById(country.name).children[1], "continent-");
            removeClassesWithSpecificString(document.getElementById(country.name).children[1], "conquered");
        }
    }
}

async function readJSON(path) {
    return fetch(path)
        .then(response => response.json())
        .catch(error => {
            console.error('Error reading JSON:', error);
        });
}

function removeClassesWithSpecificString(element, specificString) {
    const classes = Array.from(element.classList);
    for (let i = 0; i < classes.length; i++) {
        if (classes[i].includes(specificString)) {
            element.classList.remove(classes[i]);
        }
    }
}

function showOverlay(text, duration, color) {
    const overlay = document.getElementById("overlay");
    const overlayText = document.getElementById("overlayText");

    overlayText.textContent = text;
    overlayText.style.color = color || "black";
    overlay.style.display = "block";

    overlay.classList.add("fadeIn");

    setTimeout(function() {
        overlay.classList.remove("fadeIn");

        overlay.classList.add("fadeOut");

        setTimeout(function() {
            overlay.style.display = "none";
            overlay.classList.remove("fadeOut");
        }, duration / 4);
    }, duration / 4);
}

function getContinentData(map) {
    return new Promise((resolve, reject) => {
        readJSON("./maps/" + map + "/continents.json")
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error('Error initializing countries:', error);
                reject(error);
            });
    });
}