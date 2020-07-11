import './styles/main.css';

window.addEventListener('DOMContentLoaded', (event) => {
    // Initialize variables required for the game
    const squares = document.querySelectorAll('.square');
    const newGameButton = document.querySelector('.new-game-button');
    const resetScoreButton = document.querySelector('.reset-score-button');
    const X = 'X';
    const O = 'O';
    const turnLimit = 9;
    let gameInProgress = true;
    let turnValue = X;
    let turnCount = 0
    const scoreboard = {
        'X': {
            score : 0,
            class : '.x-score'
        },
        'O' : {
            score : 0,
            class : '.o-score'
        }
    }

    let gameBoard = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
    ];

    const newGameBoard = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
    ];

    const gameBoardPositions = {}

    const isGameWon = turnValue => {
        const winningCombos = [
            // By rows
            [gameBoard[0][0], gameBoard[0][1], gameBoard[0][2]],
            [gameBoard[1][0], gameBoard[1][1], gameBoard[1][2]],
            [gameBoard[2][0], gameBoard[2][1], gameBoard[2][2]],
            // By columns
            [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]],
            [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]],
            [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]],
            // By Crossses or Straight down the middle
            [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
            [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]],
            [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]]
        ]

        for(const idx in winningCombos) {
            const result = winningCombos[idx].every( e => e == turnValue );
            if(!result) {
                continue;
            }
            else {
                scoreboard[turnValue].score = scoreboard[turnValue].score + 1;
                const elem = document.querySelector(scoreboard[turnValue].class);
                elem.innerText = scoreboard[turnValue].score;
                return true;
            }
        }

        return false;
    };

    // Cleans the board and sets it up for a new game
    const newGameHandle = e => {
        e.preventDefault;

        gameInProgress = true;
        gameBoard = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
        ];
        turnValue = X;
        turnCount = 0;

        squares.forEach(e => {
            e.classList.remove('checked');
            e.innerHTML = ``;
        });
    };

    // Resets the scoreboard and sets up a new game
    const resetScoreHandle = e => {
        e.preventDefault();

        for(const prop in scoreboard) {
            const score = document.querySelector(scoreboard[prop].class);
            score.innerText = 0;
            scoreboard[prop].score = 0;
        }
    };

    const turnHandle = e => {
        e.preventDefault();
        // Define constants
        const className = turnValue == X ? 'x' : 'o';

        // Edge cases
        if(!gameInProgress) {
            console.log('Start a new match please');
            return;
        }

        if(e.target.classList.contains('checked')) {
            console.log('this square already has a value');
            return;
        }

        if(turnCount >= turnLimit) {
            console.log('no more turns left!');
            return;
        }

        const squarePosition = e.target.id;
        const { row, column } = gameBoardPositions[squarePosition];

        // Add checked class to the square/tile
        e.target.classList.add('checked');

        // Create and add the element to the square/tile
        const elem = document.createElement('div');
        elem.innerText = turnValue;
        elem.classList.add(className);
        e.target.innerHTML = `
            <div class="${className}">
                ${turnValue}
            </div>
        `;

        // Update the gameBoard
        gameBoard[row][column] = turnValue;

        // Check if the game has been won or not
        gameInProgress = isGameWon(turnValue) ? false : true;
        console.log(scoreboard);

        // Update the turnCount and turnValue if game is in progress
        turnCount += 1;
        turnValue = turnValue == X ? O : X;
    }

    // Give each square it's own unique id and set its position
    let firstIdx;
    let secondIdx = 0
    squares.forEach((square, i) => {
        square.setAttribute('id', `square-${i+1}`);

        // Determine the first index of the gameBoard
        if(i < 3) {
            firstIdx = 0;
        }
        else if(i > 2 && i < 6) {
            firstIdx = 1;
        }
        else {
            firstIdx = 2;
        }

        // Determine the second index of the gameBoard
        if(secondIdx > 2) {
            secondIdx = 0;
        }

        gameBoardPositions[`square-${i+1}`] = { row : firstIdx, column : secondIdx }

        secondIdx++;
    });

    squares.forEach(square => {
        square.addEventListener('click', turnHandle);
    });
    resetScoreButton.addEventListener('click', resetScoreHandle);
    newGameButton.addEventListener('click', newGameHandle);
});
