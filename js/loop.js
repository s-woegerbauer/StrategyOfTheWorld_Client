import {Game} from "./game.js";

document.addEventListener("DOMContentLoaded", async ()=> {
    await start("Europe")
});

function initSizes(map) {
    readJSON("./maps/" + map + "/sizes.json")
        .then(data => {
            document.getElementById("map").style.width = data.width + "px";
            document.getElementById("map").style.height = data.height + "px";

            for(const element of document.getElementsByClassName("country"))
            {
                element.style.width = data.width + "px";
                element.style.height = data.height + "px";
            }
        })
        .catch(error => {
            console.error('Error initializing sizes:', error);
        });
}

async function start(map)
{
    initSizes(map);

    let players = new Array(5);
    players[0] = "white";
    players[1] = "blue";
    players[2] = "yellow";
    players[3] = "red";
    players[4] = "green";

    const game = new Game(players, await initCountries(map), map);

    document.getElementById('flexSwitchCheckRainbow').addEventListener('change', function() {
        checkRainbowMode();
    });

    document.getElementById('flexSwitchCheckDark').addEventListener('change', function() {
        checkDarkMode();
    });

    document.getElementById("flexSwitchCheckDark").click();
}

function initCountries(map) {
    return new Promise((resolve, reject) => {
        readJSON("./maps/" + map + "/init.json")
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

function checkRainbowMode()
{
    if(document.getElementById("flexSwitchCheckRainbow").checked)
    {
        document.getElementById("map").classList.add("rainbow");
    }
    else
    {
        document.getElementById("map").classList.remove("rainbow");
    }
}

function checkDarkMode()
{
    if(document.getElementById("flexSwitchCheckDark").checked)
    {
        document.getElementById("body").classList.add("dark");
    }
    else
    {
        document.getElementById("body").classList.remove("dark");
    }
}