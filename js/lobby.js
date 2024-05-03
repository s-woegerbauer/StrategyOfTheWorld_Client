const defaultUrl = 'https://localhost:5128';

function login()
{
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(defaultUrl + `/Player/Login?username=${username}&password=${password}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }})
        .catch((error) => {
            console.log(error)
        });
}

function register()
{
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch(defaultUrl + `/Player/Login?username=${newUsername}&password=${newPassword}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }})
        .catch((error) => {
            console.log(error)
        })
        .then(() => {
            document.getElementById('username').value = newUsername;
            document.getElementById('password').value = newPassword;
            document.getElementById('login').click();
        });
}

function host()
{
    fetch(defaultUrl + `/Lobby/Create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }})
        .catch((error) => {
            console.log(error)
        });
}

function join()
{
    const gameCode = document.getElementById('gameCode').value;

    fetch(defaultUrl + `/Player/JoinLobby`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gameCode: gameCode
        })})
        .catch((error) => {
            console.log(error)
        });
}