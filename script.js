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

Gameboard.printBoard();
Gameboard.placeMark(0, 1, "X");
Gameboard.placeMark(0, 0, "O");
Gameboard.printBoard();
