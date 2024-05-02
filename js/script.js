document.addEventListener('DOMContentLoaded', async () => {
    let players = new Array(5);
    players[0] = "white";
    players[1] = "blue";
    players[2] = "yellow";
    players[3] = "red";
    players[4] = "green";

    await startMap("Europe", players);
});

async function startMap(map, players)
{
    const worldMap = document.getElementById('map');
    worldMap.style.backgroundImage = `url("../${map}/sea-routes.png")`;
    console.log(`url("../${map}/sea_routes.png")`);

    let countries = await initCountries(map);
    countries = delegateTroops(players, countries);
    update(countries, map);
    log(countries);
}

function update(countries, map)
{
    const worldMap = document.getElementById('map');

    for(let i = 0; i < countries.length; i++)
    {
        const element = worldMap;
        let contentContainer = document.createElement('div');
        contentContainer.id = countries[i].name;
        contentContainer.classList.add('content');
        let textWrapper = document.createElement("span");
        textWrapper.textContent = countries[i].troops;
        textWrapper.style.paddingTop = countries[i].posY + "px";
        textWrapper.style.paddingLeft = countries[i].posX + "px";
        textWrapper.style.position = "absolute";
        textWrapper.style.zIndex = "100";
        contentContainer.appendChild(textWrapper);
        element.appendChild(contentContainer);
    }

    let i = 0;
    countries.forEach(country => {
        const countryElement = document.createElement('div');

        countryElement.style.position = "absolute";
        countryElement.className = `country ${country.color}`;
        countryElement.style.color = "black";
        countryElement.style.backgroundImage = `url('${map}/${country.name}.png')`;

        document.getElementById(countries[i].name).appendChild(countryElement);

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

                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(elementX, elementY, 1, 1).data;

                    if (imageData[3] !== 0) {

                        let elements = document.getElementsByClassName("clicked");
                        for(let i = 0; i < elements.length; i++) {
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

function delegateTroops(colors, countries)
{
    const troopsPerPlayer = getTroops(colors.length);

    // =============================== Every Country gets one troop ===============================
    const countriesPerColor = Math.floor(countries.length / colors.length);
    console.log(countries.length / colors.length)
    const left = new Array(colors.length).fill(countriesPerColor);

    for(let i = 0; i < countries.length - (countriesPerColor * colors.length); i++)
    {
        left[i]++;
    }
    const leftRec = Array.from(left);

    for(let countryIndex = 0; countryIndex < countries.length; countryIndex++)
    {
        let rnd;

        do {
            rnd = Math.floor(Math.random() * colors.length)
        } while (left[rnd] === 0);

        left[rnd]--;

        countries[countryIndex].color = colors[rnd];
        countries[countryIndex].troops = 1;
    }
    // ============================================================================================


    // ================================ Rest is randomly delegated ================================
    for(let i = 0; i < colors.length; i++)
    {
        for(let j = 0; j < troopsPerPlayer - leftRec[i]; j++)
        {
            countries[getIndexOfRandomCountryOfPlayer(colors[i], countries)].troops++;
        }
    }
    // ============================================================================================

    return countries;
}

function getIndexOfRandomCountryOfPlayer(color, countries)
{
    const count = countries.filter(value => value.color === color).length;
    const rnd = Math.floor(Math.random() * count);
    let curI = 0;

    for(let i = 0; i < countries.length; i++)
    {
        if(countries[i].color === color)
        {
            if(curI === rnd)
                return i;

            curI++;
        }
    }
}

function getTroops(amountOfPlayers)
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

function log(countries)
{
    let newCountries = countries.sort((a, b) => {
        return a.color.localeCompare(b.color);
    });
    for(let i = 0; i < newCountries.length; i++)
    {
        console.log(newCountries[i].name + " | " + newCountries[i].color + " | " + newCountries[i].troops)
    }
}