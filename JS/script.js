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

    let cpuChoice;
    if(!twoPlayers) cpuChoice = await fetch("https://csa2020studentapi.azurewebsites.net/rpsls")
        .then(response => response.text());
    cpuChoice = cpuChoice.toLowerCase();
    if(gameOutcomes[choice].includes(cpuChoice))results.innerText = 'Player Wins against ' + cpuChoice;
    else if(choice == cpuChoice) results.innerText = 'tie';
    else results.innerText = 'Player Loses to ' + cpuChoice;
}
