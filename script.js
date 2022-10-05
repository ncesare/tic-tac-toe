const squares = document.querySelectorAll('.container div');
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

const createSquare = function(square, x, y) {
    this.status = '';

    // Can we include the DOM element in the square object? So they change together automatically.
    const updateStatus = function() {
        console.log(x, y)
        if (square.textContent === '') {
            this.status = currentPlayer.marker;
            return currentPlayer.marker;
        }
    }

    return {x, y, status: this.status, updateStatus};
}

const gameBoard = (() => {
    let gameOn = true;

    let squareArray = [];

    // Assign squares coordinates on a grid, starting at 0
    // 0, 0 | 1, 0 | 2, 0
    // 1, 0 | 1, 1 | 2, 1
    // 2, 0 | 1, 2 | 2, 2

    let x = 0;
    let y = 0;

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
        const selection = squares[randInt];
        const selectionObject = squareArray[randInt];
        if (selection.textContent === '') return paintSquare(selectionObject.updateStatus(), selection);
        else return gameAI();
    }    

    const paintSquare = function(marker, square) {
        return square.textContent = marker;
    }

    squares.forEach(square => {
        const squareObject = createSquare(square, x, y);
        squareArray.push(squareObject);
        if (x < 2) x++
        else {
            x = 0;
            y++;
        }


        // Optimize the function in the event listener
        // Plan — set {once: true} and create a function to fill-in squares.
        // Reset button will reapply that function to each button.
        // Fill-in function will only let you fill in empty squares. Clicking on filled square has no effect.
        square.addEventListener('click', () => {
            if (gameOn) {
                if (square.textContent !== 'O') paintSquare(squareObject.updateStatus(), square); // Quick patch fix. Needs better logic.
                checkWin();
                changePlayers();
                if (currentPlayer.isHuman === false) {
                    gameAI();
                    changePlayers();
                }
                checkWin();
            }
        }, {once: false});
    });

    resetButton.addEventListener('click', () => resetBoard());
    const resetBoard = function() {
        gameOn = true;
        for (let square of squares) {
            square.textContent = '';
        }
        for (let squareObject of squareArray) {
            squareObject.status = '';
        }
        winnerDisplay.textContent = '';
        return;
    }
})();