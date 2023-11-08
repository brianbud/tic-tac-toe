function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const drawMarker = (column) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    //if all cells are filled, invalid move
    if (!availableCells.length) {
      return;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { printBoard };
}

function Cell() {
  let value = 0;

  //get the player's mark to change cells value
  const addMark = (player) => {
    value = player;
  };

  //using closure to get value
  const getValue = () => value;

  return { addMark, getValue };
}

const game = Gameboard();

console.table(game.printBoard());
