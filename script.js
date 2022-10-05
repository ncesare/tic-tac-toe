const squares = document.querySelectorAll('.container div');
const winnerDisplay = document.querySelector('.winner');

const protoPlayer = function(isHuman, marker) {
    if (isHuman === false) console.log('ai stuff');
    let isTurn = false;
    if (marker === 'X') isTurn = true;

    return {marker, isTurn};
}

const player1 = protoPlayer(true, 'X');
const player2 = protoPlayer(true, 'O');

const players = [player1, player2];
let currentPlayer = players.find(player => player.isTurn === true);

const createSquare = function(square, x, y) {
    let status = '';

    const updateStatus =  function() {
        console.log(x, y)
        if (square.textContent === '') return currentPlayer.marker;
        else return '';
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
                    square.x === 0 && square.y === 0 && checkDiagonal()) {
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
            const square3 = squareArray.find(element => element.x === 2 && element.y === 2);

            if (square.status === square2.status && square.status === square3.status) return true;
        }
    }

    const changePlayers = function() {
        if (currentPlayer.marker === 'X') currentPlayer = players.find(player => player.marker === 'O');
        else currentPlayer = players.find(player => player.marker === 'X');
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
            }
        });
});
})();