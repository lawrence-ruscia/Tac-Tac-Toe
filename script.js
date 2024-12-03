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
    console.log(`${getActivePlayer().name}'s turn`);
  };
  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const playRound = (row, column) => {
    console.log(`${getActivePlayer().name} is placing their mark`);
    Gameboard.placeMark(row, column, getActivePlayer().mark);

    determineWinner();

    // switchPlayerTurn();
    printNewRound();
  };

  printNewRound(); // Initial game message

  const determineWinner = () => {
    const playerMark = getActivePlayer().mark;
    // Check 3 consecutive marks horizontally, vertically, and diagonally

    // iterate each row then, checkthrough each col for 3 consecutive marks
    const checkHorizontally = () => {
      for (let row = 0; row < board.length; row++) {
        const col = 0;
        if (
          board[row][col].getValue() === playerMark &&
          board[row][col + 1].getValue() === playerMark &&
          board[row][col + 2].getValue() === playerMark
        ) {
          return true;
        }
      }
      return false;
    };

    // iterate each column, then check each row for 3 consecutive marks
    const checkVertically = () => {
      const rowLength = board[0].length;
      for (let col = 0; col < rowLength; col++) {
        const row = 0;
        if (
          board[row][col].getValue() === playerMark &&
          board[row + 1][col].getValue() === playerMark &&
          board[row + 2][col].getValue() === playerMark
        ) {
          return true;
        }
      }
      return false;
    };

    const checkDiagonally = () => {
      function checkTopLeftToBottomRight() {
        const row = 0;
        const col = 0;
        return (
          board[row][col].getValue() === playerMark &&
          board[row + 1][col + 1].getValue() === playerMark &&
          board[row + 2][col + 2].getValue() === playerMark
        );
      }

      function checkTopRightToBottomLeft() {
        const row = 0;
        const col = 2; // start at the last column
        return (
          board[row][col].getValue() === playerMark &&
          board[row + 1][col - 1].getValue() === playerMark &&
          board[row + 2][col - 2].getValue() === playerMark
        );
      }

      return checkTopLeftToBottomRight() || checkTopRightToBottomLeft();
    };

    if (checkHorizontally() || checkVertically() || checkDiagonally()) {
      console.log(`${getActivePlayer().name} wins!`);
    }
  };

  return { getActivePlayer, playRound };
}

const controller = GameController("Human", "Robot");
controller.playRound(0, 2);
controller.playRound(1, 1);
controller.playRound(2, 0);
