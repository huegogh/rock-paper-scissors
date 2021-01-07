const gameOutcomes = {
    // userChoice wins against choices in array
    'rock': ['scissors', 'lizard'],
    'paper': ['rock', 'spock'],
    'scissors': ['paper', 'lizard'],
    'lizard': ['spock', 'paper'],
    'spock': ['rock', 'scissors']
};
const playArea = document.querySelector('#playArea');
let selectable = document.getElementsByClassName('selectable');
selectable = Array.from(selectable);

let firstChoice = false, secondChoice = false;
let numOfRounds, p1Score = 0, p2Score = 0, roundsPlayed = 0;

selectable.forEach((element, i) => {
    element.addEventListener('click', () => {
        element.classList.remove('pulse');
        playArea.classList.add('zoomerOut');
        setTimeout(() => { getChoices(i) }, 1000);
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
    const rounds = await fetch('./HTMLObjects/numberOfRounds.html').then(data => data.text());
    document.querySelector('#app').innerHTML = rounds;
    selectable = document.getElementsByClassName('selectable');
    selectable = Array.from(selectable);

    selectable.forEach((element, i) => {
        element.addEventListener('click', () => {
            element.classList.remove('pulse');
            document.getElementById('playArea').classList.add('zoomerOut');
            setTimeout(() => getGame(i, twoPlayers), 1000);
        });
        element.addEventListener('mouseover', () => {
            element.classList.add('pulse')
        });

        element.addEventListener('mouseout', () => {
            element.classList.remove('pulse')
        });
    });
}

async function getGame(rounds, twoPlayers) {
    numOfRounds = rounds === 0 ? 1 : rounds === 1 ? 5 : 7;
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
    results.innerText = '';
    if (twoPlayers && firstChoice) secondChoice = choice;
    if (!firstChoice) firstChoice = choice;
    let p2Title = 'Player 2';

    if (!twoPlayers) {
        p2Title = 'CPU';
        secondChoice = await fetch("https://csa2020studentapi.azurewebsites.net/rpsls")
            .then(response => response.text());
        secondChoice = secondChoice.toLowerCase();
        if (gameOutcomes[firstChoice].includes(secondChoice)) {
            p1Score++;
            results.innerText = 'Player Wins against ' + secondChoice.replace(secondChoice[0], secondChoice[0].toUpperCase());
        } else if (firstChoice == secondChoice) results.innerText = 'tie';
        else {
            p2Score++;
            results.innerText = 'Player Loses to ' + secondChoice.replace(secondChoice[0], secondChoice[0].toUpperCase());
        }
        roundsPlayed++;
    } else if (firstChoice && secondChoice) {
        if (gameOutcomes[firstChoice].includes(secondChoice)) {
            results.innerText = 'Player 1 Wins';
        } else if (firstChoice == secondChoice) results.innerText = 'tie';
        else {
            p2Score++
            results.innerText = 'Player 2 Wins';
        }
        firstChoice = false, secondChoice = false;
        roundsPlayed++;
    }

    if (roundsPlayed === numOfRounds) {
        document.getElementById('playArea').classList.add('zoomerOut');
        setTimeout(() => {
            document.getElementById('playArea').classList = 'd-none';
        }, 500);
        document.getElementById('finalResults').classList = 'row fadeIn d-flex justify-content-center mt-3';
        document.getElementById('finalResultsText').innerText = p1Score > p2Score ? 'Player 1 Wins the Game' : p1Score < p2Score ? p2Title + ' Wins the Game' : 'Tie Game';
        p1Score = 0;
        p2Score = 0;
    }
}

