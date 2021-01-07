const gameOutcomes = {
    // userChoice wins against choices in array
    'rock' : ['scissors', 'lizard'],
    'paper' : ['rock', 'spock'],
    'scissors' : ['paper', 'lizard'],
    'lizard' : ['spock', 'paper'],
    'spock' : ['rock', 'scissors']
};
const playArea = document.querySelector('#playArea');
let selectable = document.getElementsByClassName('selectable');
selectable = Array.from(selectable);

let firstChoice = false, secondChoice = false;

selectable.forEach((element, i) => {
    element.addEventListener('click', () => {
        element.classList.remove('pulse');
        playArea.classList.add('zoomerOut');
        setTimeout(() => {getChoices(i)}, 1000);
    });
    element.addEventListener('mouseover', () => {
        element.classList.add('pulse')
    });

    element.addEventListener('mouseout', () => {
        element.classList.remove('pulse')
    });
});

async function getChoices(numberOfPlayers) {
    numberOfPlayers += 1;
    let twoPlayers = numberOfPlayers == 2;
    const choices = await fetch('./HTMLObjects/choices.html').then(data => data.text());
    document.querySelector('#app').innerHTML = choices;
    selectable = document.getElementsByClassName('selectable');
    selectable = Array.from(selectable);

    selectable.forEach((element, i) => {
        element.addEventListener('click', (e) => {
            element.classList.remove('pulse');
            playArea.classList.add('zoomerOut');
            getResults(e.target.innerText, twoPlayers);
        });
        element.addEventListener('mouseover', () => {
            element.classList.add('pulse')
        });

        element.addEventListener('mouseout', () => {
            element.classList.remove('pulse')
        });
    });
}

async function getResults(choice, twoPlayers) {
    const results = document.getElementById('results');
    if(twoPlayers && firstChoice) secondChoice = choice;
    if(!firstChoice) firstChoice = choice;

    if(!twoPlayers){
        secondChoice = await fetch("https://csa2020studentapi.azurewebsites.net/rpsls")
        .then(response => response.text());
        secondChoice = secondChoice.toLowerCase();
        if(gameOutcomes[firstChoice].includes(secondChoice))results.innerText = 'Player Wins against ' + secondChoice.replace(secondChoice[0],secondChoice[0].toUpperCase());
        else if(firstChoice == secondChoice) results.innerText = 'tie';
        else results.innerText = 'Player Loses to ' + secondChoice.replace(secondChoice[0],secondChoice[0].toUpperCase());
    } else if(firstChoice && secondChoice){
        if(gameOutcomes[firstChoice].includes(secondChoice))results.innerText = 'Player 1 Wins';
        else if(firstChoice == secondChoice) results.innerText = 'tie';
        else results.innerText = 'Player 2 Wins';
        firstChoice = false, secondChoice = false;
        setTimeout(() => {
            results.innerHTML = '';
        }, 3000);
    }
}
