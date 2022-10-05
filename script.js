const squares = document.querySelectorAll('.container div');
const winnerDisplay = document.querySelector('.winner');

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
    let status = '';

    const updateStatus = function() {
        console.log(x, y)
        if (square.textContent === '') return currentPlayer.marker;
    }

    return {x, y, status, updateStatus};
}

const gameBoard = (() => {
    let gameOn = true;

    let squareArray = [];

    let x = 0;
    let y = 0;

    const checkWin = function() {
        // Iterate over squares on the board and check win conditions according to starting square and direction.

        for (square of squareArray) {
            if (square.status === '') continue;
            else if (square.x === 0 && checkRow() || 
                    square.y === 0 && checkColumn() || 
                    checkDiagonal()) {
                        gameOn = false;
                        return winnerDisplay.textContent = `${square.status} wins`;
                    }
        }

        function checkRow() {
            const square2 = squareArray.find(element => element.x === square.x + 1 && element.y === square.y);
            const square3 = squareArray.find(element => element.x === square.x + 2 && element.y === square.y);

            if (square.status === square2.status && square.status === square3.status) return true;
        }

        function checkColumn() {
            const square2 = squareArray.find(element => element.y === square.y + 1 && element.x === square.x);
            const square3 = squareArray.find(element => element.y === square.y + 2 && element.x === square.x);

            if (square.status === square2.status && square.status === square3.status) return true;
        }

        function checkDiagonal() {
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

    const gameAI = function() {
        let computerPlayer = players.find(player => !player.isHuman)
        const randInt = Math.floor(Math.random() * 9);
        const selection = squares[randInt];
        const selectionObject = squareArray[randInt];
        if (selection.textContent === '') return selection.textContent = selectionObject.status = selectionObject.updateStatus();
        else return gameAI();
    }    

    squares.forEach(square => {
        const squareObject = createSquare(square, x, y);
        squareArray.push(squareObject);
        if (x < 2) x++
        else {
            x = 0;
            y++;
        }

        square.addEventListener('click', () => {
            if (gameOn) {
                square.textContent = squareObject.status = squareObject.updateStatus();
                changePlayers();
                if (currentPlayer.isHuman === false) {
                    gameAI();
                    changePlayers();
                }
                checkWin();
            }
        }, {once: true});
    });
})();