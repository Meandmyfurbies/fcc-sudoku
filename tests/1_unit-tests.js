const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  suite("validate", () => {
    test("valid str", () => {
      assert.isNull(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."));
    });

    test("too short", () => {
      assert.deepEqual(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92"), {error: "Expected puzzle to be 81 characters long"});
    });
  
    test("invalid chars", () => {
      assert.deepEqual(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914abcd"), {error: "Invalid characters in puzzle"});
    });
  });

  suite("check", () => {
    test("valid row", () => {
      assert.isTrue(solver.checkRowPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, 3));
    });
    
    test("invalid row", () => {
      assert.isFalse(solver.checkRowPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, 1));
    });

    test("valid col", () => {
      assert.isTrue(solver.checkColPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, 8));
    });

    test("invalid col", () => {
      assert.isFalse(solver.checkColPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, 2));
    });

    test("valid region", () => {
      assert.isTrue(solver.checkRegionPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, 3));
    });

    test("invalid region", () => {
      assert.isFalse(solver.checkRegionPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, 5));
    });
  });

  suite("solve", () => {
    test("valid str", () => {
      assert.notProperty(solver.solve("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."), "error");
    });

    test("invalid str", () => {
      assert.property(solver.solve("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914"), "error");
    });

    test("expected solution", () => {
      assert.deepEqual(solver.solve("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."), {solution: "135762984946381257728459613694517832812936745357824196473298561581673429269145378"});
    });
  });
});
