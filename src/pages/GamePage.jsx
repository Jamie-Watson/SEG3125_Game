import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NonogramGrid from '../components/NonogramGrid';
import GameControls from '../components/GameControls';
import { 
  generatePuzzle, 
  checkWinCondition, 
} from '../assets/code/nonogramUtils';

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    grid: [],
    solution: [],
    rowClues: [],
    colClues: [],
    isComplete: false,
    size: 5
  });
  
  const [gameMode, setGameMode] = useState('fill'); 

  const gameConfig = location.state || { 
    difficulty: 'Easy', 
    generationType: 'Random Puzzle' 
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      const puzzle = await generatePuzzle(
        gameConfig.difficulty, 
        gameConfig.generationType,
        gameConfig.imageFile, 
        gameConfig.imageOptions 
      );
      
      const playerGrid = Array(puzzle.size).fill().map(() => Array(puzzle.size).fill(0));
      
      setGameState({
        grid: playerGrid,
        solution: puzzle.solution,
        rowClues: puzzle.rowClues,
        colClues: puzzle.colClues,
        isComplete: false,
        size: puzzle.size
      });
    } catch (err) {
      console.error('Error initializing game:', err);
    }
  };

  const handleCellClick = (row, col, forcedValue = null) => {
    if (gameState.isComplete) return;

    const newGrid = gameState.grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (forcedValue !== null) {
            return forcedValue;
          }
          
          if (gameMode === 'fill') {
            return cell === 1 ? 0 : 1; 
          } else {
            if (cell === 0) return 2; 
            if (cell === 2) return 0; 
            return cell; 
          }
        }
        return cell;
      })
    );
    
    const updatedGameState = {
      ...gameState,
      grid: newGrid
    };
    
    setGameState(updatedGameState);
    checkForWin(newGrid);
  };

  const checkForWin = (grid) => {
    const normalizedGrid = grid.map(row => 
      row.map(cell => cell === 1 ? 1 : 0)
    );
    
    const hasWon = checkWinCondition(normalizedGrid, gameState.solution);
    
    if (hasWon) {
      setGameState(prev => ({
        ...prev,
        grid,
        isComplete: true
      }));
      
      setTimeout(() => {
        navigate('/win', { 
          state: { 
            difficulty: gameConfig.difficulty,
            generationType: gameConfig.generationType 
          }
        });
      }, 1500);
    }
  };

  const resetGame = () => {
    const playerGrid = Array(gameState.size).fill().map(() => Array(gameState.size).fill(0));
    setGameState(prev => ({
      ...prev,
      grid: playerGrid,
      isComplete: false
    }));
    setGameMode('fill');
  };

  const generateNewPuzzle = async () => {
    await initializeGame();
    setGameMode('fill'); 
  };

  const handleRevealSolution = () => {
    setGameState(prev => ({
      ...prev,
      grid: prev.solution.map(row => [...row]),
      isComplete: true
    }));
  };

  const handleHint = () => {
    if (gameState.isComplete) return;
    
    const incorrectCells = [];
    for (let row = 0; row < gameState.size; row++) {
      for (let col = 0; col < gameState.size; col++) {
        const currentCell = gameState.grid[row][col];
        const solutionCell = gameState.solution[row][col];
        
        if ((solutionCell === 1 && currentCell !== 1) || 
            (solutionCell === 0 && currentCell === 1)) {
          incorrectCells.push({ row, col });
        }
      }
    }
    
    if (incorrectCells.length > 0) {
      const randomCell = incorrectCells[Math.floor(Math.random() * incorrectCells.length)];
      const correctValue = gameState.solution[randomCell.row][randomCell.col];
      handleCellClick(randomCell.row, randomCell.col, correctValue);
    }
  };

  const handleToggleMode = (newMode) => {
    setGameMode(newMode);
  };

  return (
    <div className="container-fluid py-3">
      
      {gameState.isComplete && (
        <div className="row justify-content-center mb-3">
          <div className="col-auto">
            <div className="alert alert-success text-center">
              <h4>Congratulations!</h4>
              <p>You solved the {gameConfig.difficulty} nonogram!</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="row justify-content-center mb-3">
        <div className="col-auto text-center">
          <small className="text-muted">
            {gameConfig.generationType} • {gameState.size}×{gameState.size} Grid
          </small>
          <br />
          <small className="text-muted">
            Mode: {gameMode === 'fill' ? 'Fill squares' : 'Mark with X'}
          </small>
        </div>
      </div>
      
      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          <NonogramGrid
            grid={gameState.grid}
            rowClues={gameState.rowClues}
            colClues={gameState.colClues}
            onCellClick={handleCellClick}
            isComplete={gameState.isComplete}
            gameMode={gameMode}
          />
        </div>
      </div>
      
      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          <GameControls 
            onReset={resetGame}
            onRevealSolution={handleRevealSolution}
            onHint={handleHint}
            onToggleMode={handleToggleMode}
            onNewPuzzle={generateNewPuzzle}
            isComplete={gameState.isComplete}
            currentMode={gameMode}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;