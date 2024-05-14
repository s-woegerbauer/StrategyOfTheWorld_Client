document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('flexSwitchCheckDark').addEventListener('change', function() {
        checkDarkMode();
    });

    document.getElementById("flexSwitchCheckDark").click();

    const container = document.getElementById('map-container');
    container.className = 'card-container';

    const data = new Array(2);
    data[0] = 'World';
    data[1] = 'Europe';

    data.forEach(directory => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = `./maps/${directory}/map.png`;
        img.alt = directory;
        img.classList.add('map-image');
        img.classList.add('black');
        card.appendChild(img);

        const title = document.createElement('h2');
        title.textContent = directory;
        card.appendChild(title);
        container.appendChild(card);

        card.addEventListener('click', () => {
            for(const element of document.getElementsByClassName('selected'))
            {
                element.classList.remove('selected');
            }
            card.classList.add('selected');
        });
    });
});

function start()
{
    const element = document.getElementsByClassName('selected')[0];
    if(element)
    {
        const map = element.getElementsByTagName('h2')[0].textContent;
        window.location.href = `./game.html?map=${map}`;
    }
    else
    {
        alert('No map selected');
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