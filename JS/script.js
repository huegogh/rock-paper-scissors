const gameOutcomes = {
    // userChoice wins against choices in array
    'rock': ['scissors', 'lizard'],
    'paper': ['rock', 'spock'],
    'scissors': ['paper', 'lizard'],
    'lizard': ['spock', 'paper'],
    'spock': ['rock', 'scissors']
};
let firstChoice = false,
    secondChoice = false;
let numOfRounds,
    p1Score = 0,
    p2Score = 0,
    roundsPlayed = 0;

async function getMainButtons() {
    const mainButtons = await fetch('./HTMLObjects/mainmenuButtons.html').then(data => data.text());
    document.querySelector('#app').innerHTML = mainButtons;
    const playArea = document.querySelector('#playArea');
    const selectable = Array.from(document.getElementsByClassName('selectable'));
    selectable.forEach((element, i) => {
        element.addEventListener('click', () => {
            element.classList.remove('pulse');
            playArea.classList.add('zoomerOut');
            setTimeout(() => { getChoices(i + 1) }, 1000);
        });
        element.addEventListener('mouseover', () => {
            element.classList.add('pulse')
        });

        element.addEventListener('mouseout', () => {
            element.classList.remove('pulse')
        });
    });

}//getMainButtons

async function getChoices(numberOfPlayers) {
    console.log(numberOfPlayers);
    let twoPlayers = numberOfPlayers == 2;
    const rounds = await fetch('./HTMLObjects/numberOfRounds.html').then(data => data.text());
    document.querySelector('#app').innerHTML = rounds;
    const selectable = Array.from(document.getElementsByClassName('selectable'));

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
}//getChoices

async function getGame(rounds, twoPlayers) {
    let buttonEnabled = true;
    numOfRounds = rounds === 0 ? 1 : rounds === 1 ? 5 : 7;
    const choices = await fetch('./HTMLObjects/choices.html').then(data => data.text());
    document.querySelector('#app').innerHTML = choices;
    if (twoPlayers) twoPlayerText();
    const selectable = Array.from(document.getElementsByClassName('selectable'));

    selectable.forEach((element, i) => {
        element.addEventListener('click', (e) => {
            console.log(buttonEnabled);
            if(buttonEnabled){
                buttonEnabled = false;
                console.log('button was clicked');
                element.classList.remove('pulse');
                getRoundResults(e.target.innerText, twoPlayers);
                setTimeout(() => {buttonEnabled = true}, 1000);
            }
        });
        element.addEventListener('mouseover', () => {
            element.classList.add('pulse')
        });

        element.addEventListener('mouseout', () => {
            element.classList.remove('pulse')
        });
    });
}//getGame

function twoPlayerText() {
    const resultsTitle = document.getElementById('resultsTitle');

    if (!firstChoice) {
        resultsTitle.innerText = "Player 2 avert your eyes";
        results.innerText = 'Player 1 select a weapon';
    } else {
        resultsTitle.innerText = "Player 1 avert your eyes";
        results.innerText = 'Player 2 select a weapon';
    }
}// twoPlayerText

async function getRoundResults(choice, twoPlayers) {
    if(twoPlayers) twoPlayerText();
    const results = document.getElementById('results');
    const resultsTitle = document.getElementById('resultsTitle');
    results.innerText = '';
    if (twoPlayers && firstChoice) secondChoice = choice;
    if (!firstChoice) firstChoice = choice;
    let p2Title = 'Player 2';
    if (twoPlayers) twoPlayerText();


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
        firstChoice = false;
    } else if (firstChoice && secondChoice) {
        resultsTitle.innerText = 'Round Results';
        if (gameOutcomes[firstChoice].includes(secondChoice)) {
            p1Score++;
            results.innerText = 'Player 1 Wins';
        } else if (firstChoice == secondChoice) results.innerText = 'tie';
        else {
            p2Score++
            results.innerText = 'Player 2 Wins';
        }
        firstChoice = false, secondChoice = false;
        roundsPlayed++;
        if(roundsPlayed !== numOfRounds) setTimeout(() => {
            twoPlayerText()
        }, 1250);
    }

    if (roundsPlayed === numOfRounds)  getFinalResults(p2Title);

}//getRoundResults

function getFinalResults(p2Title) {
    document.getElementById('playArea').classList.add('zoomerOut');
        setTimeout(() => {
            document.getElementById('playArea').classList = 'd-none';
        }, 500);
        document.getElementById('finalResults').classList = 'row fadeIn d-flex justify-content-center mt-3';
        document.getElementById('finalResultsText').innerText = p1Score > p2Score ? 'Player 1 Wins the Game' : p1Score < p2Score ? p2Title + ' Wins the Game' : 'Tie Game';
        const returnButton = document.getElementById('returnButton');
        returnButton.addEventListener('click', () => {
            playArea.classList.add('zoomerOut');
            getMainButtons();
        });
        returnButton.addEventListener('mouseover', () => {returnButton.classList.add('pulse')});

        returnButton.addEventListener('mouseout', () => {returnButton.classList.remove('pulse')});
        p1Score = 0;
        p2Score = 0;
        roundsPlayed = 0;
        firstChoice = false;
        secondChoice = false;
}//getFinalResults

getMainButtons();