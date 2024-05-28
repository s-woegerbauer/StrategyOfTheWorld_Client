import {Game} from "./game.js";

document.addEventListener("DOMContentLoaded", async ()=> {
    const url = new URL(window.location.href);
    const map = url.searchParams.get("map");
    await start(map);
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

    let skins = new Array(7);
    skins[0] = "circles";
    skins[1] = "clouds";
    skins[2] = "water";
    skins[3] = "none";
    skins[4] = "waves";
    skins[5] = "carbon";
    skins[6] = "binary";
    skins[7] = "champion";

    const playerIndex = 4;

    const game = new Game(skins, players, await initCountries(map), map, playerIndex);

    document.getElementById('scale').addEventListener('input', function(event) {
        document.documentElement.style.setProperty('--scale-factor', event.target.value);
    });

    document.getElementById("overlay").addEventListener("click", function() {
       document.getElementById("overlay").style.display = "none";
    });

    document.getElementById('flexSwitchCheckRainbow').addEventListener('change', function() {
        checkRainbowMode();
    });

    document.getElementById('flexSwitchCheckDark').addEventListener('change', function() {
        checkDarkMode();
    });

    document.getElementById("flexSwitchCheckDark").click();

    const dropdownItems = document.getElementById("dropdownItems");

    for(const skin of skins)
    {
        let a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = '#';
        a.textContent = skin;
        a.addEventListener("click", function() {
            game.changeSkin(a.textContent);
            document.getElementById("dropdownMenuButton").textContent = a.textContent;
        });
        dropdownItems.appendChild(a);
    }
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