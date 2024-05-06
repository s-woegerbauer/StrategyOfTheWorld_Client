class Game {
    constructor(players, countries, map) {
        this.players = players;
        this.countries = countries;
        this.currentPlayer = 0;
        this.map = map;
    }

    async startMap()
    {
        const worldMap = document.getElementById('map');
        worldMap.style.backgroundImage = `url("../${this.map}/sea-routes.png")`;
        this.countries = this.delegateTroops();
        this.update();
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
            countryElement.style.backgroundImage = `url('${this.map}/${country.name}.png')`;

            document.getElementById(this.countries[i].name).appendChild(countryElement);

            countryElement.addEventListener("click", (event) => {
                const clickedX = event.offsetX;
                const clickedY = event.offsetY;

                let j = 0;
                document.querySelectorAll('.country').forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementX = clickedX - rect.left;
                    const elementY = clickedY - rect.top;

                    const img = new Image();
                    img.src = element.style.backgroundImage.replace('url("', '').replace('")', '');

                    img.onload = function () {
                        function onClickCountry(name)
                        {
                            const elementContainer = document.getElementById(name);
                            if(elementContainer.classList.contains("clicked"))
                            {
                                elementContainer.classList.remove("clicked");
                            }
                            else
                            {
                                elementContainer.classList.add("clicked");
                            }

                            console.log("clicked on: " + name);
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

                            const name = img.src.replace(".png", "").split("/")[5];
                            onClickCountry(name);
                        }
                    };

                    j++;
                });
            });
            i++;
        });
    }

    delegateTroops()
    {
        const troopsPerPlayer = this.getTroops(this.players.length);

        // =============================== Every Country gets one troop ===============================
        const countriesPerColor = Math.floor(this.countries.length / this.players.length);
        console.log(this.countries.length / this.players.length)
        const left = new Array(this.players.length).fill(countriesPerColor);

        for(let i = 0; i < this.countries.length - (countriesPerColor * this.players.length); i++)
        {
            left[i]++;
        }
        const leftRec = Array.from(left);

        for(let countryIndex = 0; countryIndex < this.countries.length; countryIndex++)
        {
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
        for(let i = 0; i < this.players.length; i++)
        {
            for(let j = 0; j < troopsPerPlayer - leftRec[i]; j++)
            {
                this.countries[this.getIndexOfRandomCountryOfPlayer(this.players[i], this.countries)].troops++;
            }
        }
        // ============================================================================================

        return this.countries;
    }

    getIndexOfRandomCountryOfPlayer(color)
    {
        const count = this.countries.filter(value => value.color === color).length;
        const rnd = Math.floor(Math.random() * count);
        let curI = 0;

        for(let i = 0; i < this.countries.length; i++)
        {
            if(this.countries[i].color === color)
            {
                if(curI === rnd)
                    return i;

                curI++;
            }
        }
    }

    getTroops(amountOfPlayers)
    {
        switch (amountOfPlayers)
        {
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

    log()
    {
        let newCountries = this.countries.sort((a, b) => {
            return a.color.localeCompare(b.color);
        });
        for(let i = 0; i < newCountries.length; i++)
        {
            console.log(newCountries[i].name + " | " + newCountries[i].color + " | " + newCountries[i].troops)
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let players = new Array(5);
    players[0] = "white";
    players[1] = "blue";
    players[2] = "yellow";
    players[3] = "red";
    players[4] = "green";

    const game = new Game(players, await initCountries("Europe"), "Europe");

    await game.startMap();
});

function initCountries(map) {
    return new Promise((resolve, reject) => {
        this.readJSON(map + "/init.json")
            .then(data => {
                let initializedCountries = new Array(data.length)
                let i = 0;

                for(const country of data) {
                    initializedCountries[i] = ({
                        name: country.name,
                        posX: country.posX,
                        posY: country.posY,
                        color: "",
                        troops: 0
                    });
                    i++;
                }

                resolve(initializedCountries);
            })
            .catch(error => {
                console.error('Error initializing countries:', error);
                reject(error);
            });
    });
}

function readJSON(path) {
    return fetch(path)
        .then(response => response.json())
        .catch(error => {
            console.error('Error reading JSON:', error);
        });
}

