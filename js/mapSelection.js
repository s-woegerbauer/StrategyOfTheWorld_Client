document.addEventListener('DOMContentLoaded', async () => {
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
        img.className = 'map-image';
        card.appendChild(img);

        const title = document.createElement('h2');
        title.textContent = directory;
        card.appendChild(title);
        container.appendChild(card);
    });
});