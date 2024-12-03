const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = []; // this will store the rows/columns

  // Each row will be an array and contain a cell obj
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMark = (row, col, playerMark) => {
    // check if the cell is empty, only then will it add the mark
    if (board[row][col].getValue() === "E") {
      board[row][col].addMarkToCell(playerMark);
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, placeMark, printBoard };
})();

/*
  This represents each cell in the board
  E: Empty mark in the cell
  X: Player 1's mark
  O: Player 2's mark 
*/
function Cell() {
  let value = "E";

  const addMarkToCell = (playerMark) => (value = playerMark);

  const getValue = () => value;

  return { addMarkToCell, getValue };
}

function GameController(playerOne = "Player 1", playerTwo = "Player 2") {
  const board = Gameboard.getBoard();

  const players = [
    { name: playerOne, mark: "X" },
    { name: playerTwo, mark: "O" },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`Player ${getActivePlayer().name}'s turn`);
  };
  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const playRound = (row, column) => {
    console.log(`Player ${getActivePlayer().name} is placing their mark`);
    Gameboard.placeMark(row, column, getActivePlayer().mark);

    determineWinner();

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound(); // Initial game message

  const determineWinner = () => {
    // Check 3 consecutive marks horizontally, vertically, and diagonally

    // check each row then iterate through each col if there are 3 consecutive marks
    const checkHorizontally = () => {
      for (let row = 0; row < board.length; row++) {
        let col = 0;
        if (
          board[row][col].getValue() === getActivePlayer().mark &&
          board[row][col + 1].getValue() === getActivePlayer().mark &&
          board[row][col + 2].getValue() === getActivePlayer().mark
        ) {
          return true;
        }
      }
      return false;
    };

    if (checkHorizontally()) {
      console.log(`Player ${getActivePlayer().name} wins!`);
    }
  };

  return { getActivePlayer, playRound };
}

const controller = GameController("Player 1", "Player 2");
controller.playRound(0, 0);
controller.playRound(1, 1);
controller.playRound(0, 2);
controller.playRound(1, 2);
controller.playRound(0, 1);
