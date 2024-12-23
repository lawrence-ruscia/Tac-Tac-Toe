const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  let board = []; // this will store the rows/columns

  // Each row will be an array and contain a cell obj
  const generateBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  generateBoard();

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

  const resetBoard = () => {
    generateBoard(); // Reinitialize the board
    console.log("Board has been reset!");
  };

  return { getBoard, placeMark, printBoard, resetBoard };
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

    const resetPlayerTurn = () => (activePlayer = players[0]);

    const incrementActivePlayerScore = () => (activePlayer.score += 1);

    return {
      getActivePlayer,
      getPlayerOne,
      getPlayerTwo,
      switchPlayerTurn,
      resetPlayerTurn,
      incrementActivePlayerScore,
    };
  })(playerOne, playerTwo);

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${playerState.getActivePlayer().name}'s turn`);
  };

  const roundWinner = (() => {
    let winner = null;

    const setWinner = (player) => (winner = player);
    const getWinner = () => winner;
    const resetWinner = () => (winner = null);

    return { setWinner, getWinner, resetWinner };
  })();

  function resetRound() {
    Gameboard.resetBoard();
    playerState.resetPlayerTurn();
  }

  const playRound = (row, column) => {
    console.log(`${playerState.getActivePlayer().name} is placing their mark`);

    const isMarkPlaced = Gameboard.placeMark(
      row,
      column,
      playerState.getActivePlayer().mark
    );

    if (!isMarkPlaced) {
      console.log("Invalid! cell is already occupied");
      return;
    }

    const result = determineResult();

    if (result) {
      console.log("Game reset!");
      Gameboard.printBoard();
      resetRound(); // reset board each round
      Gameboard.printBoard();
    } else {
      playerState.switchPlayerTurn();
      printNewRound();
    }
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
      roundWinner.setWinner(playerState.getActivePlayer());
      playerState.incrementActivePlayerScore();
      return `${playerState.getActivePlayer().name} wins!`;
    }

    if (checkTie()) {
      console.log("Draw!");
      roundWinner.setWinner("Draw");
      return "Draw!";
    }
  };

  return {
    getActivePlayer: playerState.getActivePlayer,
    getPlayerOne: playerState.getPlayerOne,
    getPlayerTwo: playerState.getPlayerTwo,
    playRound,
    getBoard,
    resetWinner: roundWinner.resetWinner,
    getWinner: roundWinner.getWinner,
  };
}

// OPTIMIZE: Provide a better implementation for this function,
//            make sure to use factory functions and module pattern to encapsulate data
const ScreenController = (() => {
  const player1Name = localStorage.getItem("player1Name");
  const player2Name = localStorage.getItem("player2Name");

  const controller = GameController(player1Name, player2Name);
  const boardDiv = document.querySelector(".board");
  const player1scorePara = document.querySelector("#player1Score");
  const player2scorePara = document.querySelector("#player2Score");
  const player1NamePara = document.querySelector(".player__name--1");
  const player2NamePara = document.querySelector(".player__name--2");
  player1NamePara.textContent = controller.getPlayerOne().name;
  player2NamePara.textContent = controller.getPlayerTwo().name;

  const GamePopupHandler = (() => {
    const showGamePopup = (message) => {
      const popup = document.getElementById("gamePopup");
      popup.textContent = message; // Set the popup text
      popup.classList.add("show");

      // Hide the popup after 2 seconds
      setTimeout(() => {
        popup.classList.remove("show");
      }, 2000);
    };

    const startGame = () => {
      // Initialize game state, board, players, etc.
      showGamePopup("Game Started!");

      // Additional game start logic
      console.log("Game initialized!");
    };

    return { showGamePopup, startGame };
  })();

  const updateScreen = () => {
    // get the newest version of the board and player turn
    const board = controller.getBoard();

    const player1 = controller.getPlayerOne();
    const player2 = controller.getPlayerTwo();
    const roundWinner = controller.getWinner();

    const BoardHandler = (() => {
      const clearBoard = () => {
        boardDiv.innerHTML = "";
      };

      const updatePlayerScores = () => {
        player1scorePara.textContent = player1.score;
        player2scorePara.textContent = player2.score;
      };

      const buildBoard = () => {
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
            cellBtn.textContent =
              cell.getValue() === "E" ? nbsp : cell.getValue();

            cellBtn.dataset.row = rowIndex;
            cellBtn.dataset.col = cellIndex;

            rowDiv.appendChild(cellBtn);
          });
          boardDiv.appendChild(rowDiv);
        });

        // Include abort game btn to board
        ButtonEventHandler.abortGameHandler();
      };

      return { clearBoard, updatePlayerScores, buildBoard };
    })();

    const ButtonEventHandler = (() => {
      const boardDiv = document.querySelector(".board");

      function displayChildElements(element) {
        const children = element.children;

        for (const child of children) {
          child.removeAttribute("style"); // Resets to its original position
        }
      }

      function navigateToMenu() {
        const menuPage = "../index.html";
        window.location.href = menuPage;
      }

      const abortGameHandler = () => {
        const abortGame = document.querySelector(".abort-game-btn");
        abortGame.addEventListener("click", navigateToMenu);
      };

      const playAgainHandler = () => {
        const playAgain = document.querySelector(".board__play-again");
        const abortGame = document.querySelector(".abort-game-btn");
        playAgain.addEventListener("click", () => {
          boardDiv.removeAttribute("style");

          displayChildElements(boardDiv);
          abortGame.remove();
          playAgain.remove();
          controller.resetWinner();
          PlayerBorderStyleHandler.toggleActivePlayerBorder();
          GamePopupHandler.startGame();
        });
      };

      return { abortGameHandler, playAgainHandler };
    })();

    const PlayerBorderStyleHandler = (() => {
      const toggleActivePlayerBorder = () => {
        const activePlayer = controller.getActivePlayer();
        const player1Div = document.querySelector(".game__player--1");
        const player2Div = document.querySelector(".game__player--2");

        player1Div.classList.remove("game__player--active");
        player2Div.classList.remove("game__player--active");

        if (activePlayer.name === player1.name) {
          player1Div.classList.add("game__player--active");
        }
        if (activePlayer.name === player2.name) {
          player2Div.classList.add("game__player--active");
        }
      };

      const removeActivePlayerBorder = () => {
        const player1Div = document.querySelector(".game__player--1");
        const player2Div = document.querySelector(".game__player--2");

        player1Div.classList.remove("game__player--active");
        player2Div.classList.remove("game__player--active");
      };

      return { toggleActivePlayerBorder, removeActivePlayerBorder };
    })();

    const PlayAgainHandler = (() => {
      function setElementStyles(element, styleObj) {
        Object.assign(element.style, styleObj);
      }

      function hideChildElements(element) {
        const children = element.children;

        for (const child of children) {
          child.style.position = "absolute";
          child.style.top = "-9999px";
        }
      }

      function createButtonElement(classArr, textContent = "Button") {
        const button = document.createElement("button");
        for (const classItem of classArr) {
          button.classList.add(classItem);
        }
        button.textContent = textContent;

        return button;
      }

      function appendToBoard() {
        PlayerBorderStyleHandler.removeActivePlayerBorder();

        const board = document.querySelector(".board");
        hideChildElements(board);

        const boardStyle = {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--spacing-sm)",
        };

        setElementStyles(board, boardStyle);

        const playAgain = createButtonElement(
          ["board__play-again"],
          "Play again!"
        );

        const abortGame = createButtonElement(
          ["board__abort-game", "ghost-btn", "abort-game-btn"],
          "Abort game"
        );

        board.appendChild(playAgain);
        board.appendChild(abortGame);
      }

      const displayToScreen = () => {
        if (roundWinner !== null) {
          const message =
            roundWinner === "Draw" ? "Draw!" : `${roundWinner.name} wins!`;

          GamePopupHandler.showGamePopup(message);

          setTimeout(() => {
            appendToBoard();
            ButtonEventHandler.playAgainHandler();
            ButtonEventHandler.abortGameHandler();
          }, 2000);
        }
      };

      return { displayToScreen };
    })();

    function initBoard() {
      BoardHandler.clearBoard();
      BoardHandler.updatePlayerScores();
      BoardHandler.buildBoard();
      PlayAgainHandler.displayToScreen();
    }

    // Initialize board
    initBoard();
  };

  const initializeGame = () => {
    const handleCellClick = () => {
      boardDiv.addEventListener("click", (e) => {
        const cell = e.target;
        const selectedCellCol = Number(cell.dataset.col);
        const selectedCellRow = Number(cell.dataset.row);
        const roundWinner = controller.getWinner();

        // Enable cell btn click events only if there is currently no determined winner
        if (cell.classList.contains("board__cell") && !roundWinner) {
          controller.playRound(selectedCellRow, selectedCellCol);
          updateScreen();
        }
      });
    };

    function handleContentLoad() {
      // Initialize events
      document.addEventListener("DOMContentLoaded", () => {
        handleCellClick();
        GamePopupHandler.startGame();
      });
    }

    handleContentLoad();
    updateScreen();
  };

  return { initializeGame };
})();

ScreenController.initializeGame();
