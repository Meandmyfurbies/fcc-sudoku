const buildPuzzle = puzzleString => {
  let puzzle = [];
  let pointer = 0;
  for(let i = 0; i < 9; i++) {
    let row = [];
    for(let j = 0; j < 9; j++) {
      if(puzzleString[pointer] === ".") {
        row.push(0);
      } else {
        row.push(parseInt(puzzleString[pointer]));
      }
      pointer++;
    }
    puzzle.push(row);
  }
  return puzzle;
}

const buildPuzzleString = puzzle => {
  let puzzleString = "";
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(puzzle[i][j] === 0) {
        puzzleString += ".";
      } else {
        puzzleString += puzzle[i][j].toString();
      }
    }
  }
  return puzzleString;
}

class SudokuSolver {
  validate(puzzleString) {
    if(!puzzleString) return {error: "Required field missing"};
    if(puzzleString.length != 81) return {error: "Expected puzzle to be 81 characters long"};
    const re = /^[0-9\\.]{81}$/;
    if(!re.test(puzzleString)) return {error: "Invalid characters in puzzle"};
    return null;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzle = buildPuzzle(puzzleString);
    for(let i = 0; i < 9; i++) {
      if(puzzle[row][i] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzle = buildPuzzle(puzzleString);
    for(let i = 0; i < 9; i++) {
      if(puzzle[i][column] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzle = buildPuzzle(puzzleString);
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;

    for(let i = regionRow; i < regionRow + 3; i++) {
      for(let j = regionCol; j < regionCol + 3; j++) {
        if(puzzle[i][j] === value) return false;
      }
    }
    return true;
  }

  check(puzzle, row, col, value) {
    const puzzleString = buildPuzzleString(puzzle);
    return puzzle[row][col] === value || this.checkRowPlacement(puzzleString, row, col, value) && this.checkColPlacement(puzzleString, row, col, value) && this.checkRegionPlacement(puzzleString, row, col, value);
  }

  checkStr(puzzleStr, coord, valStr) {
    if(!coord || !valStr || !puzzleStr) return {error: "Required field(s) missing"};
    const validateError = this.validate(puzzleStr);
    if(validateError) return validateError;
    if(isNaN(coord[1]) || coord.length !== 2) return {error: "Invalid coordinate"};
    const coordRow = "abcdefghi".indexOf(coord[0].toLowerCase());
    const coordCol = parseInt(coord[1]) - 1;
    if(coordRow < 0 || coordRow > 8 || coordCol < 0 || coordCol > 8) return {error: "Invalid coordinate"};
    if(valStr.length !== 1 || isNaN(valStr) || parseInt(valStr) < 1 || parseInt(valStr) > 9) return {error: "Invalid value"};
    const value = parseInt(valStr);
    if(buildPuzzle(puzzleStr)[coordRow][coordCol] === value) return {valid: true};
    let failList = [];
    if(!this.checkRowPlacement(puzzleStr, coordRow, coordCol, value)) failList.push("row");
    if(!this.checkColPlacement(puzzleStr, coordRow, coordCol, value)) failList.push("column");
    if(!this.checkRegionPlacement(puzzleStr, coordRow, coordCol, value)) failList.push("region");
    if(failList.length !== 0) {
      return {valid: false, conflict: failList};
    } else {
      return {valid: true};
    }
  }
  solve(puzzleString) {
    const validateError = this.validate(puzzleString);
    if(validateError) return validateError;
    let puzzle = buildPuzzle(puzzleString);
    if(!this.solveLoc(puzzle, 0, 0)) return {error: "Puzzle cannot be solved"};
    return {solution: buildPuzzleString(puzzle)};
  }

  solveLoc(puzzle, row, col) {
    if(row === 8 && col === 9) return true;
    if(col === 9) {
      row++;
      col = 0;
    }
    if(puzzle[row][col] > 0) return this.solveLoc(puzzle, row, col + 1);
    for(let num = 1; num <= 9; num++) {
      if(this.check(puzzle, row, col, num)) {
        puzzle[row][col] = num;
        if(this.solveLoc(puzzle, row, col + 1)) return true;
      }
      puzzle[row][col] = 0;
    }
    return false;
  }
}

module.exports = SudokuSolver;
