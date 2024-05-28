const root = document.documentElement;
let rarity = 0;
let alreadyClicked = false;

$(".side").click(function(){
    if(alreadyClicked)
        return;

    alreadyClicked = true;
    rarity = getRarity();
    root.style.setProperty('--complementary-hue', getHueValue(rarity).toString());
    $(".side").addClass("active");
    $(".box-wrapper").addClass("active");
    $(".box").addClass("active");
    $(".engram-wrapper").addClass("active");
    $(".face").addClass("active");
    $("h1").addClass("active");
    setTimeout(function(){
        document.getElementById("box").style.visibility = "hidden";
        document.getElementById("loot").style.visibility = "visible";
        document.getElementById("infoContainer").classList.add("active");

        document.getElementById("body").style.background = `${hueToHex(getHueValue(rarity))}`;

        for(const circle of document.getElementsByClassName("circles"))
        {
            circle.style.background = `${hueToHex(getHueValue(rarity))}`;
        }

        fetch('./rarities.json')
            .then(response => response.json())
            .then(data => {
                const skin = getRandomSkinByInt(rarity, data.skins);
                const skinName = capitalizeFirstLetter(skin);
                const rarityToAssign = capitalizeFirstLetter(data.rarities[rarity]);
                document.getElementById("rarity").innerText = rarityToAssign;
                document.getElementById("item").innerText = skinName;
                document.getElementById("skinPrev").src = `./Textures/${skin}.png`;
            })
            .catch(error => console.error('Error:', error));
    }, 10000);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomSkinByInt(intValue, skins) {
    const skinKeys = [];
    for(const skin of skins)
    {
        if(skin.rarity === intValue)
        {
            skinKeys.push(skin.name);
        }
    }

    const randomIndex = Math.floor(Math.random() * skinKeys.length);
    return skinKeys[randomIndex];
}

function getItems(skins, specificItem) {
    return skins
        .filter(skin => skin.rarity === specificItem)
        .select(skin => skin.name);
}

function getHueValue(rarity)
{
    switch (rarity)
    {
        case 0:
            return 120;
        case 1:
            return 240;
        case 2:
            return 300;
        case 3:
            return 0;
        default:
            return 60;
    }
}

function getRarity() {
    const rand = Math.random();
    if (rand <= 0.5) {
        return 0;
    } else if (rand <= 0.75) {
        return 1;
    } else if (rand <= 0.9) {
        return 2;
    } else {
        return 3;
    }
}


function hueToHex(hue) {
    let r, g, b;
    let h = hue / 60;
    let c = 1;
    let x = c * (1 - Math.abs(h % 2 - 1));
    let m = 0.5 - c / 2;

    if (0 <= h && h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (1 <= h && h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (2 <= h && h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (3 <= h && h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (4 <= h && h < 5) {
        r = x;
        g = 0;
        b = c;
    } else if (5 <= h && h < 6) {
        r = c;
        g = 0;
        b = x;
    } else {
        r = 0;
        g = 0;
        b = 0;
    }

    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    if (r.length === 1)
        r = "0" + r;
    if (g.length === 1)
        g = "0" + g;
    if (b.length === 1)
        b = "0" + b;

    return "#" + r + g + b;
}