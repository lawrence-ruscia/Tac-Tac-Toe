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
      return true;
    }

    return false;
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

  const getBoard = () => board;

  const playerState = ((playerOne, playerTwo) => {
    const players = [
      { name: playerOne, mark: "X", score: 0 },
      { name: playerTwo, mark: "O", score: 0 },
    ];

    let activePlayer = players[0];

    // This way, the returned objects are copies, and external modifications won’t affect the original state.
    const getActivePlayer = () => ({ ...activePlayer });
    const getPlayerOne = () => ({ ...players[0] });
    const getPlayerTwo = () => ({ ...players[1] });

    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const incrementActivePlayerScore = () => (activePlayer.score += 1);

    return {
      getActivePlayer,
      getPlayerOne,
      getPlayerTwo,
      switchPlayerTurn,
      incrementActivePlayerScore,
    };
  })(playerOne, playerTwo);

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${playerState.getActivePlayer().name}'s turn`);
  };

  const gameState = (() => {
    let result = null;
    const setResult = (roundResult) => (result = roundResult);
    const getResult = () => result;

    return { setResult, getResult };
  })();

  const playRound = (row, column) => {
    console.log(`${playerState.getActivePlayer().name} is placing their mark`);

    const isMarkPlaced = Gameboard.placeMark(
      row,
      column,
      playerState.getActivePlayer().mark
    );

    if (!isMarkPlaced) {
      console.log("Invalid move! Cell already occupied.");
      return;
    }

    const result = determineResult();
    if (result) {
      gameState.setResult(result);
    }

    playerState.switchPlayerTurn();
    printNewRound();
  };

  printNewRound(); // Initial game message

  const determineResult = () => {
    const playerMark = playerState.getActivePlayer().mark;
    // Check 3 consecutive marks horizontally, vertically, and diagonally

    // iterate each row then, check through each col for 3 consecutive marks
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

    // checks for diagonal marks (top-left to bottom-right and top-right to bottom-left)
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

    const checkTie = () => {
      // combine all row cells into a single array
      const allCells = board.flat();

      // if all cells are occupied the game is a tie
      return allCells.every((cell) => cell.getValue() !== "E");
    };

    if (checkHorizontally() || checkVertically() || checkDiagonally()) {
      console.log(`${playerState.getActivePlayer().name} wins!`);
      playerState.incrementActivePlayerScore();

      return `${playerState.getActivePlayer().name} wins!`;
    }

    if (checkTie()) {
      console.log("Draw!");
      return "Draw!";
    }
  };

  return {
    getActivePlayer: playerState.getActivePlayer,
    getPlayerOne: playerState.getPlayerOne,
    getPlayerTwo: playerState.getPlayerTwo,
    playRound,
    getBoard,
    getResult: gameState.getResult,
  };
}

function ScreenController() {
  const controller = GameController("Human", "Robot");
  const activePlayerDiv = document.querySelector(".game__active-player");
  const roundResultDiv = document.querySelector(".game__result");
  const boardDiv = document.querySelector(".board");
  const player1score = document.querySelector("#player1Score");
  const player2score = document.querySelector("#player2Score");

  const updateScreen = () => {
    // clear board
    boardDiv.innerHTML = "";

    // get the newest version of the board and player turn
    const board = controller.getBoard();
    const activePlayer = controller.getActivePlayer();
    const roundResult = controller.getResult();
    const player1 = controller.getPlayerOne();
    const player2 = controller.getPlayerTwo();

    player1score.textContent = player1.score;
    player2score.textContent = player2.score;

    /*
      Temporarily remove to avoid exceptions, remove when UI elements are complete
    */
    // if (roundResult) {
    //   roundResultDiv.textContent = roundResult;
    // } else {
    //   activePlayerDiv.textContent = `${activePlayer.name}'s turn...`;
    // }

    board.forEach((row, rowIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "board__row";

      row.forEach((cell, cellIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.className =
          cell.getValue() === "X"
            ? " board__cell cell--x"
            : "board__cell cell--o";

        const nbsp = "\u00A0"; // non-breaking space
        cellBtn.textContent = cell.getValue() === "E" ? nbsp : cell.getValue();

        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = cellIndex;

        rowDiv.appendChild(cellBtn);
      });
      boardDiv.appendChild(rowDiv);
    });
  };

  boardDiv.addEventListener("click", (e) => {
    const cell = e.target;
    const selectedCellCol = Number(cell.dataset.col);
    const selectedCellRow = Number(cell.dataset.row);
    const roundResult = controller.getResult();

    // if round winner has already been determined, then disable placing of marks
    if (roundResult) {
      return;
    }

    if (cell.classList.contains("board__cell")) {
      controller.playRound(selectedCellRow, selectedCellCol);
      updateScreen();
    }
  });

  updateScreen();
}
ScreenController();
