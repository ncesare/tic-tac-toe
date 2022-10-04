const squares = document.querySelectorAll('.container div');

let squareArray = [];

// Each square is an object instance
// Square object has methods: add X/O, report on position and status ({x: 0, y: 0, status: 'X'})
// Board is an object
// onclick Board checks for win conditions, has method to report board status in array of coordinates
// If status at square$ === status at square$(x + 1 || y + 1 || x & y + 1) and for + 2, then {status} is winner


const squareFactory = function(square, x, y) {
    let status = square.textContent;

    const updateStatus =  function() {
        console.log(x, y)
        if (square.textContent === '') return 'X';
        else return '';
    }

    return {x, y, status, updateStatus};
}

// Can I make this part of a gameboard object, initialized as a module?

let x = 0;
let y = 0;

squares.forEach(square => {
    const squareObject = squareFactory(square, x, y);
    squareArray.push(squareObject);
    if (x < 2) x++
    else {
        x = 0;
        y++;
    }

    square.addEventListener('click', () => {
        square.textContent = squareObject.updateStatus();
        console.log(squareObject.status);
    })
});