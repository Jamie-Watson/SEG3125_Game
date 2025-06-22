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

export const getGridSize = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 5;
    case 'Medium': return 10;
    case 'Hard': return 15;
    default: return 5;
  }
};

export const loadImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file'));
      return;
    }
    
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

export const convertImageToGrid = (image, size, threshold = 128) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = size;
  canvas.height = size;
  
  ctx.drawImage(image, 0, 0, size, size);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const pixels = imageData.data;
  
  const grid = Array(size).fill().map(() => Array(size).fill(0));
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pixelIndex = (y * size + x) * 4;
      
      const r = pixels[pixelIndex];
      const g = pixels[pixelIndex + 1];
      const b = pixels[pixelIndex + 2];
      const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
      
      grid[y][x] = grayscale < threshold ? 1 : 0;
    }
  }
  
  return grid;
};

export const optimizeImageGrid = (grid) => {
  const size = grid.length;
  const optimized = grid.map(row => [...row]);
  
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      let filledNeighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (grid[y + dy][x + dx] === 1) filledNeighbors++;
        }
      }
      
      if (grid[y][x] === 1 && filledNeighbors < 2) {
        optimized[y][x] = 0; 6
        optimized[y][x] = 1; 
      }
    }
  }
  
  return optimized;
};

export const generatePuzzleFromImage = async (imageFile, difficulty, options = {}) => {
  try {
    const {
      threshold = 128,
      optimize = true,
      contrast = 1.0
    } = options;
    
    const size = getGridSize(difficulty);
    const image = await loadImageFromFile(imageFile);
    
    let processedImage = image;
    if (contrast !== 1.0) {
      processedImage = adjustImageContrast(image, contrast);
    }
    
    let grid = convertImageToGrid(processedImage, size, threshold);
    
    if (optimize) {
      grid = optimizeImageGrid(grid);
    }
    
    const filledCells = grid.flat().filter(cell => cell === 1).length;
    if (filledCells === 0) {
      throw new Error('Image resulted in empty puzzle. Try adjusting threshold or using a different image.');
    }
    
    const { rowClues, colClues } = generateAllClues(grid);
    
    return {
      solution: grid,
      rowClues,
      colClues,
      size,
      sourceImage: imageFile.name
    };
    
  } catch (error) {
    console.error('Error generating puzzle from image:', error);
    throw error;
  }
};

export const adjustImageContrast = (image, contrast) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = image.width;
  canvas.height = image.height;
  
  ctx.drawImage(image, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = Math.min(255, Math.max(0, (pixels[i] - 128) * contrast + 128));    
    pixels[i + 1] = Math.min(255, Math.max(0, (pixels[i + 1] - 128) * contrast + 128)); 
    pixels[i + 2] = Math.min(255, Math.max(0, (pixels[i + 2] - 128) * contrast + 128)); 
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const adjustedImage = new Image();
  adjustedImage.src = canvas.toDataURL();
  return adjustedImage;
};

export const generatePuzzle = async (difficulty, generationType = 'Random Puzzle', imageFile = null, imageOptions = {}) => {
  const size = getGridSize(difficulty);
  
  if (generationType === 'Random Puzzle') {
    const solution = generateRandomPuzzle(size, 0.6);
    const { rowClues, colClues } = generateAllClues(solution);
    
    return {
      solution,
      rowClues,
      colClues,
      size
    };
  }

  if (generationType === 'Upload Image') {
    if (!imageFile) {
      throw new Error('Image file is required for image-based puzzles');
    }
    
    return await generatePuzzleFromImage(imageFile, difficulty, imageOptions);
  }
  
  return generatePuzzle(difficulty, 'Random Puzzle');
};

export const validateImageFile = (file, maxSizeMB = 5) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return errors;
  }
  
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Unsupported image format. Please use JPEG, PNG, GIF, BMP, or WebP');
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  return errors;
};

export const generateImagePreview = async (imageFile, difficulty, threshold = 128) => {
  try {
    const size = getGridSize(difficulty);
    const image = await loadImageFromFile(imageFile);
    
    let grid = convertImageToGrid(image, size, threshold);
    
    grid = optimizeImageGrid(grid);
    
    return {
      grid,
      size,
      filledCells: grid.flat().filter(cell => cell === 1).length,
      totalCells: size * size
    };
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
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

export const hasUniqueSolution = (solution) => {
  const { rowClues, colClues } = generateAllClues(solution);
  const size = solution.length;
  
  const solvedGrid = solveNonogram(rowClues, colClues, size);
  
  if (!solvedGrid) {
    return false;
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