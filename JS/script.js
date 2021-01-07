const playArea = document.querySelector('#playArea');
let selectable = document.getElementsByClassName('selectable');
selectable = Array.from(selectable);

selectable.forEach(element => {
    element.addEventListener('click', () => {
        element.classList.remove('pulse');
        playArea.classList.add('zoomerOut');
        getChoices();
    });
    element.addEventListener('mouseover', () => {
        element.classList.add('pulse')
    });

    element.addEventListener('mouseout', () => {
        element.classList.remove('pulse')
    });
});

async function getChoices() {
    const choices = await fetch('./HTMLObjects/choices.html').then(data => data.text());
    document.querySelector('#app').innerHTML = choices;
    selectable = document.getElementsByClassName('selectable');
    selectable = Array.from(selectable);

    selectable.forEach((element, i) => {
        element.addEventListener('click', () => {
            element.classList.remove('pulse');
            playArea.classList.add('zoomerOut');
            getResults(i);
        });
        element.addEventListener('mouseover', () => {
            element.classList.add('pulse')
        });

        element.addEventListener('mouseout', () => {
            element.classList.remove('pulse')
        });
    });
}

function getResults(choice) {
    switch (choice) {
        case 0:
            console.log('rock');
            break;
        case 1:
            console.log('paper');
            break;
        case 2:
            console.log('scissors');
            break;
        case 3:
            console.log('lizzard');
            break;
        case 4:
            console.log('spock');
            break;
    }
}
