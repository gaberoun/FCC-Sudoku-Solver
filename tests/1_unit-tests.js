const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solvedString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
    suite('validate tests', function() {
        test('valid puzzle string of 81 characters', function() {
            assert.equal(solver.validate(validString), "Valid");
        })
        test('puzzle string with invalid characters', function() {      
            const invalidString1 = 'abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            assert.equal(solver.validate(invalidString1), "Invalid characters in puzzle");
        })
        test('puzzle string that is not 81 characters', function() {
            const invalidString2 = '2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            assert.equal(solver.validate(invalidString2), "Expected puzzle to be 81 characters long");
        })
    })

    suite('checkRowPlacement tests', function() {
        test('valid row placement', function() {
            assert.isTrue(solver.checkRowPlacement(validString, 0, 1, 3));
        })
        test('invalid row placement', function() {
            assert.isFalse(solver.checkRowPlacement(validString, 0, 1, 5));
        })
    })
    
    suite('checkColPlacement tests', function() {
        test('valid col placement', function() {
            assert.isTrue(solver.checkColPlacement(validString, 0, 1, 3));
        })
        test('invalid col placement', function() {
            assert.isFalse(solver.checkColPlacement(validString, 0, 1, 9));
        })
    })

    suite('checkRegionPlacement tests', function() {
        test('valid region placement', function() {
            assert.isTrue(solver.checkRegionPlacement(validString, 0, 1, 3));
        })
        test('invalid region placement', function() {
            assert.isFalse(solver.checkRegionPlacement(validString, 0, 1, 6));
        })
    })

    suite('solve tests', function() {
        test('valid puzzle strings pass the solver', function() {
            assert.equal(solver.solve(validString), solvedString);
        })
        test('invalid puzzle strings fail the solver', function() {
            const invalidString3 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.1';
            assert.isFalse(solver.solve(invalidString3));
        })
        test('returns the expected solution for an incomplete puzzle', function() {
            const IncompleteString = '1357.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            assert.equal(solver.solve(IncompleteString), solvedString);
        })
    })
});
