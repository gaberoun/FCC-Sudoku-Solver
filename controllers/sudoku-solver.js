const { puzzlesAndSolutions } = require("./puzzle-strings");

class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return "Requried field missing";
    }

    if (puzzleString.length != 81) {
      return "Expected puzzle to be 81 characters long";
    }

    const regex = /[^1-9.]/g;
    if (regex.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }

    return "Valid";
  }

  stringToArray(puzzleString) {
    var rows = [];
    var cur_row = [];
    for(var i in puzzleString){
        cur_row.push(puzzleString[i]);
        if(i % 9 == 8){
            rows.push(cur_row);
            cur_row = [];
        }
    }
    return rows;

  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.stringToArray(puzzleString);
   
    for (let i=0; i<9; i++) {
      if (board[row][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.stringToArray(puzzleString);

    for (let i=0; i<9; i++) {
      if (board[i][column] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.stringToArray(puzzleString);

    const startRow = (row) - (row % 3);
    const startCol = (column) - (column % 3);
    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        if (board[i+startRow][j+startCol] == value) {
          return false;
        }
      }
    }
    return true;
  }
  
  isValid(board, row, col, k) {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
          return false;
        }
    }
    return true;
  }

  solve(puzzleString) {
    let solver = new SudokuSolver();

    function solvePuzzle() {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] == '.') {
            for (let k = 1; k <= 9; k++) {
              if (solver.isValid(board, i, j, k)) {
                board[i][j] = `${k}`;
                if (solvePuzzle(board)) {
                return true;
                } else {
                  board[i][j] = '.';
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    let board = this.stringToArray(puzzleString);
    var solution = solvePuzzle();
    if (!solution) {
      return false;
    }
    return board.flat().join("");
  }
}

module.exports = SudokuSolver;

