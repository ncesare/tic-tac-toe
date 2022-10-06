let squares = document.querySelectorAll('.container div');
const winnerDisplay = document.querySelector('.winner');
const resetButton = document.querySelector('button');

const protoPlayer = function(isHuman, marker) {
    let isTurn = false;
    if (marker === 'X') isTurn = true;

    return {marker, isTurn, isHuman};
}

const player1 = protoPlayer(true, 'X');
const player2 = protoPlayer(false, 'O');

const players = [player1, player2];
let currentPlayer = players.find(player => player.isTurn === true);

const createSquare = function(div, x, y) {
    this.status = '';
    // Can we include the DOM element in the square object? So they change together automatically.
    const updateStatus = function() {
        console.log(x, y)
        if (this.div.textContent === '') {
            this.status = currentPlayer.marker;
            return currentPlayer.marker;
        }
    }

    return {x, y, status: this.status, updateStatus, div};
}

const gameBoard = (() => {
    let gameOn = true;

    let squareArray = [];

    const checkDraw = function() {
        for (let square of squareArray) {
            if (square.status === '') return;
        }
        gameOn = false;
        return winnerDisplay.textContent = 'Draw'
    }

    const checkWin = function() {
        // Iterate over squares on the board and check win conditions according to starting square and direction.

        for (let square of squareArray) {
            if (square.status === '') continue;
            else if (square.x === 0 && checkRow(square) || 
                    square.y === 0 && checkColumn(square) || 
                    checkDiagonal(square)) {
                        gameOn = false;
                        return winnerDisplay.textContent = `${square.status} wins`;
                    }
        }
        // If no win is returned, check for draw.
        checkDraw();

        function checkRow(square) {
            const square2 = squareArray.find(element => element.x === square.x + 1 && element.y === square.y);
            const square3 = squareArray.find(element => element.x === square.x + 2 && element.y === square.y);

            if (square.status === square2.status && square.status === square3.status) return true;
        }

        function checkColumn(square) {
            const square2 = squareArray.find(element => element.y === square.y + 1 && element.x === square.x);
            const square3 = squareArray.find(element => element.y === square.y + 2 && element.x === square.x);

            if (square.status === square2.status && square.status === square3.status) return true;
        }

        function checkDiagonal(square) {
            const square2 = squareArray.find(element => element.x === 1 && element.y === 1);
            let square3 = squareArray.find(element => element.x === 2 && element.y === 2);

            if (square.x === 0 && square.y === 0 && 
                square.status === square2.status && 
                square.status === square3.status) return true;

            square3 = squareArray.find(element => element.x === 0 && element.y === 2);
            if (square.x === 2 && square.y === 0 && 
                square.status === square2.status && 
                square.status === square3.status) return true;
        }
    }

    const changePlayers = function() {
        if (currentPlayer.marker === 'X') currentPlayer = players.find(player => player.marker === 'O');
        else currentPlayer = players.find(player => player.marker === 'X');
    }


    // Can the AI be its own object with methods for minmax selection, random selection, and placing markers?
    const gameAI = function() {
        if (!gameOn) return;
        const randInt = Math.floor(Math.random() * 9);
        const selection = squareArray[randInt];
        if (selection.div.textContent === '') return paintSquare(selection.updateStatus(), selection);
        else return gameAI();
    }    

    const paintSquare = function(marker, square) {
        return square.div.textContent = marker;
    }

    const onClickSquare = function(square) {
        square.div.addEventListener('click', () => {
            if (gameOn) {
                if (square.div.textContent !== 'O') paintSquare(square.updateStatus(), square); // Quick patch fix. Needs better logic.
                checkWin();
                changePlayers();
                if (currentPlayer.isHuman === false) {
                    gameAI();
                    changePlayers();
                }
                checkWin();
            }
        }, {once: true});
    }
    const populateSquareArray = function() {
        // Assign squares coordinates on a grid, starting at 0
        // 0, 0 | 1, 0 | 2, 0
        // 1, 0 | 1, 1 | 2, 1
        // 2, 0 | 1, 2 | 2, 2

        let x = 0;
        let y = 0;

        squares.forEach(element => {
            const square = createSquare(element, x, y);
            squareArray.push(square);
            if (x < 2) x++
            else {
                x = 0;
                y++;
            }
            onClickSquare(square);
        })
    };
    populateSquareArray();

    resetButton.addEventListener('click', () => resetBoard());

    const resetBoard = function() {
        squares = [];
        squareArray = [];
        document.querySelector('.container').innerHTML = '';
        for (let i = 0; i < 9; i++) document.querySelector('.container').append(document.createElement('div'));
        squares = document.querySelectorAll('.container div');
        populateSquareArray();
        gameOn = true;

        if (currentPlayer.marker === 'O') changePlayers();

        winnerDisplay.textContent = '';
        return;
    }
})();