
export const generateRandomPuzzle = (size, fillProbability = 0.6, maxAttempts = 100) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const solution = Array(size).fill().map(() => 
      Array(size).fill().map(() => Math.random() < fillProbability ? 1 : 0)
    );
    
    if (hasUniqueSolution(solution)) {
      return solution;
    }
    
    attempts++;
  }
  
  return generateGuaranteedUniquePuzzle(size);
};

export const generateClues = (line) => {
  const clues = [];
  let currentCount = 0;
  
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 1) {
      currentCount++;
    } else {
      if (currentCount > 0) {
        clues.push(currentCount);
        currentCount = 0;
      }
    }
  }
  
  if (currentCount > 0) {
    clues.push(currentCount);
  }
  
  return clues.length > 0 ? clues : [0];
};

export const generateAllClues = (solution) => {
  const size = solution.length;
  const rowClues = solution.map(row => generateClues(row));
  
  const colClues = Array(size).fill().map((_, colIndex) => {
    const column = solution.map(row => row[colIndex]);
    return generateClues(column);
  });
  
  return { rowClues, colClues };
};

export const lineMatchesClues = (line, clues) => {
  const currentClues = generateClues(line);
  
  if (clues.length === 1 && clues[0] === 0) {
    return currentClues.length === 1 && currentClues[0] === 0;
  }
  
  if (currentClues.length !== clues.length) {
    return false;
  }
  
  return currentClues.every((clue, index) => clue === clues[index]);
};

export const checkWinCondition = (currentGrid, solution) => {
  if (!solution || currentGrid.length !== solution.length) {
    return false;
  }
  
  for (let row = 0; row < currentGrid.length; row++) {
    for (let col = 0; col < currentGrid[row].length; col++) {
      if (currentGrid[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  
  return true;
};

export const checkWinConditionByClues = (currentGrid, rowClues, colClues) => {
  const size = currentGrid.length;
  
  for (let row = 0; row < size; row++) {
    if (!lineMatchesClues(currentGrid[row], rowClues[row])) {
      return false;
    }
  }
  
  for (let col = 0; col < size; col++) {
    const column = currentGrid.map(row => row[col]);
    if (!lineMatchesClues(column, colClues[col])) {
      return false;
    }
  }
  
  return true;
};

export const getGridSize = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 5;
    case 'Medium': return 10;
    case 'Hard': return 15;
    default: return 5;
  }
};

export const generatePuzzle = (difficulty, generationType = 'Random Puzzle') => {
  const size = getGridSize(difficulty);
  
  if (generationType === 'Random Puzzle') {
    const solution = generateRandomPuzzle(size, 0.6); //3/5 = 0.6 probability
    const { rowClues, colClues } = generateAllClues(solution);
    
    return {
      solution,
      rowClues,
      colClues,
      size
    };
  }
  
  if (generationType === 'Image Selected') {
    // TODO: Implement image-to-nonogram conversion
    return generatePuzzle(difficulty, 'Random Puzzle');
  }
  
  return generatePuzzle(difficulty, 'Random Puzzle');
};

export const hasUniqueSolution = (solution) => {
  const { rowClues, colClues } = generateAllClues(solution);
  const size = solution.length;
  
  const solvedGrid = solveNonogram(rowClues, colClues, size);
  
  if (!solvedGrid) {
    return false; //No solution found
  }
  
  return arraysEqual(solvedGrid, solution);
};


export const solveNonogram = (rowClues, colClues, size) => {
  let grid = Array(size).fill().map(() => Array(size).fill(-1));
  
  let changed = true;
  let iterations = 0;
  const maxIterations = size * 10; 
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    
    for (let row = 0; row < size; row++) {
      const newRowState = solveLine(grid[row], rowClues[row]);
      if (!arraysEqual(newRowState, grid[row])) {
        grid[row] = newRowState;
        changed = true;
      }
    }
    
    for (let col = 0; col < size; col++) {
      const column = grid.map(row => row[col]);
      const newColState = solveLine(column, colClues[col]);
      if (!arraysEqual(newColState, column)) {
        for (let row = 0; row < size; row++) {
          grid[row][col] = newColState[row];
        }
        changed = true;
      }
    }
  }
  
  if (isGridComplete(grid)) {
    return grid;
  }
  
  return solveWithBacktracking(grid, rowClues, colClues);
};

export const solveLine = (line, clues) => {
  const size = line.length;
  const possibilities = generateLinePossibilities(size, clues);
  
  const validPossibilities = possibilities.filter(possibility => 
    line.every((cell, index) => cell === -1 || cell === possibility[index])
  );
  
  if (validPossibilities.length === 0) {
    return [...line]; 
  }
  
  const newLine = [...line];
  for (let i = 0; i < size; i++) {
    if (line[i] === -1) {
      const values = validPossibilities.map(poss => poss[i]);
      if (values.every(val => val === values[0])) {
        newLine[i] = values[0];
      }
    }
  }
  
  return newLine;
};

export const generateLinePossibilities = (size, clues) => {
  if (clues.length === 1 && clues[0] === 0) {
    return [Array(size).fill(0)];
  }
  
  const possibilities = [];
  
  function placeClues(position, clueIndex, currentLine) {
    if (clueIndex >= clues.length) {
      const completeLine = [...currentLine];
      for (let i = position; i < size; i++) {
        completeLine[i] = 0;
      }
      possibilities.push(completeLine);
      return;
    }
    
    const clueLength = clues[clueIndex];
    const remainingClues = clues.length - clueIndex - 1;
    const minSpaceNeeded = remainingClues > 0 ? 
      clues.slice(clueIndex + 1).reduce((sum, c) => sum + c, 0) + remainingClues : 0;
    
    const maxStartPos = size - clueLength - minSpaceNeeded;
    
    for (let start = position; start <= maxStartPos; start++) {
      const newLine = [...currentLine];
      
      for (let i = position; i < start; i++) {
        newLine[i] = 0;
      }
      
      for (let i = start; i < start + clueLength; i++) {
        newLine[i] = 1;
      }
      
      let nextPosition = start + clueLength;
      if (clueIndex < clues.length - 1) {
        newLine[nextPosition] = 0;
        nextPosition++;
      }
      
      placeClues(nextPosition, clueIndex + 1, newLine);
    }
  }
  
  placeClues(0, 0, Array(size).fill(-1));
  return possibilities;
};

export const solveWithBacktracking = (grid, rowClues, colClues) => {
  const size = grid.length;
  
  function backtrack(row, col) {
    while (row < size) {
      while (col < size && grid[row][col] !== -1) {
        col++;
      }
      if (col < size) break;
      row++;
      col = 0;
    }
    
    if (row >= size) {
      return isValidSolution(grid, rowClues, colClues);
    }
    
    for (const value of [0, 1]) {
      grid[row][col] = value;
      
      if (isPartiallyValid(grid, rowClues, colClues, row, col)) {
        if (backtrack(row, col + 1)) {
          return true;
        }
      }
      
      grid[row][col] = -1;
    }
    
    return false;
  }
  
  const gridCopy = grid.map(row => [...row]);
  if (backtrack(0, 0)) {
    return gridCopy;
  }
  
  return null;
};

export const isPartiallyValid = (grid, rowClues, colClues, lastRow, lastCol) => {
  const size = grid.length;
  
  const row = grid[lastRow];
  if (!row.includes(-1)) {
    if (!lineMatchesClues(row, rowClues[lastRow])) {
      return false;
    }
  }
  
  const col = grid.map(r => r[lastCol]);
  if (!col.includes(-1)) {
    if (!lineMatchesClues(col, colClues[lastCol])) {
      return false;
    }
  }
  
  return true;
};

export const isGridComplete = (grid) => {
  return grid.every(row => row.every(cell => cell !== -1));
};

export const isValidSolution = (grid, rowClues, colClues) => {
  return checkWinConditionByClues(grid, rowClues, colClues);
};

export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i])) {
      if (!Array.isArray(arr2[i]) || !arraysEqual(arr1[i], arr2[i])) {
        return false;
      }
    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  
  return true;
};

export const generateGuaranteedUniquePuzzle = (size) => {
  const solution = Array(size).fill().map(() => Array(size).fill(0));
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if ((i + j) % 3 === 0 || (i === j) || Math.random() < 0.3) {
        solution[i][j] = 1;
      }
    }
  }
  
  return solution;
};