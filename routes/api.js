'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        res.json({ error: "Required field(s) missing" });
        return;
      }

      if (solver.validate(puzzle) != "Valid") {
        res.json({ error: solver.validate(puzzle) });
        return;
      }

      const row = coordinate.split("")[0];
      const col = coordinate.split("")[1];

      if (coordinate.length != 2 || !/[a-i]/i.test(row) || !/[1-9]/i.test(col)) {
        res.json({ error: "Invalid coordinate" });
        return;
      }

      if (!/^[1-9]$/.test(value)) {
        res.json({ error: "Invalid value" });
      }

      var letterValue = row.toLowerCase().charCodeAt(0)-96;
      var numValue = parseInt(col);
      var index = (numValue + (letterValue) * 9 - 9) - 1;
      if (puzzle[index] == value) {
        res.json({ valid: true });
        return;
      }

      let validCol = solver.checkColPlacement(puzzle, letterValue-1, numValue-1, value);
      let validRow = solver.checkRowPlacement(puzzle, letterValue-1, numValue-1, value);
      let validReg = solver.checkRegionPlacement(puzzle, letterValue, numValue, value);
      let conflict = [];
      if (validCol && validRow && validReg) {
        res.json({ valid: true });
      } else {
        if (!validRow) conflict.push("row");
        if (!validCol) conflict.push("column");
        if (!validReg) conflict.push("region");
        res.json({ valid: false, conflict});
        return;
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle; 
      if (!puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }

      if (solver.validate(puzzle) != "Valid") {
        res.json({ error: solver.validate(puzzle) });
        return;
      }

      const sovledPuzzle = solver.solve(puzzle);
      if (!sovledPuzzle) {
        res.json({ error: "Puzzle cannot be solved" });
      } else {
        res.json({ solution: sovledPuzzle });
      }
    });
};
