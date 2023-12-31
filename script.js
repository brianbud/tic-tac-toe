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

  const getBoard = () => board;

  const drawMarker = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addMark(player);
    } else {
      console.log("invalid move");
      return;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { printBoard, drawMarker, getBoard };
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

function GameController(
  playerOneName = "player 1",
  playerTwoName = "player 2"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `${getActivePlayer().name} adding marker into row ${row} column ${column}`
    );
    board.drawMarker(row, column, getActivePlayer().marker);

    findWinner();

    switchPlayerTurn();
    printNewRound();
  };

  const winPositions = [
    [0, 1, 2], //first row
    [3, 4, 5], //second row
    [6, 7, 8], //third row
    [0, 3, 6], // first col
    [1, 4, 7], // second col
    [2, 5, 8], // third col
    [0, 4, 8], // first diagonal
    [2, 4, 6], // second diagonal
  ];

  const findWinner = () => {
    const boardValues = board
      .getBoard()
      .flat()
      .map((cell) => cell.getValue());

    for (let i = 0; i < winPositions.length; i++) {
      const [a, b, c] = winPositions[i];

      if (
        boardValues[a] !== 0 &&
        boardValues[a] === boardValues[b] &&
        boardValues[b] === boardValues[c]
      ) {
        return boardValues[a];
      }
    }
  };

  printNewRound(); //initial round

  return {
    findWinner,
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  // clear board
  const updateScreen = () => {
    boardDiv.textContent = "";

    //get new version of board
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
    let winner = game.findWinner();
    if (winner) {
      playerTurnDiv.textContent = `${winner} is the winner!`;
    }
    //renderboard

    for (let i = 0; i < board.length; i++) {
      // loop through the rows
      for (let j = 0; j < board[i].length; j++) {
        // loop through the columns
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell");
        cellBtn.textContent = board[i][j].getValue();
        boardDiv.appendChild(cellBtn);
        let columnIndex = j;
        let rowIndex = i;
        cellBtn.dataset.column = columnIndex;
        cellBtn.dataset.row = rowIndex;
        if (board[i][j].getValue() !== 0) {
          cellBtn.disabled = true;
        } else {
          cellBtn.disabled = false;
        }
      }
    }
  };

  function handleClick(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn) return;
    game.playRound(selectedRow, selectedColumn);
    game.findWinner();
    updateScreen();
  }
  boardDiv.addEventListener("click", handleClick);

  //first render
  updateScreen();
}

console.log(GameController.board);
ScreenController();
