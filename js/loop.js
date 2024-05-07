import {Game} from "./game.js";

document.addEventListener('DOMContentLoaded', async () => {
    let players = new Array(5);
    players[0] = "white";
    players[1] = "blue";
    players[2] = "yellow";
    players[3] = "red";
    players[4] = "green";

    const game = new Game(players, await initCountries("Europe"), "Europe");
});

function initCountries(map) {
    return new Promise((resolve, reject) => {
        readJSON(map + "/init.json")
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

