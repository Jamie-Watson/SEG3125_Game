import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NonogramGrid from "../components/NonogramGrid";
import GameControls from "../components/GameControls";
import GameHeader from "../components/GameHeader";
import {
  generatePuzzle,
  checkWinCondition,
  checkWinConditionByClues,
} from "../assets/code/nonogramUtils";

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    grid: [],
    solution: [],
    rowClues: [],
    colClues: [],
    isComplete: false,
    size: 5,
  });

  const gameConfig = location.state || {
    difficulty: "Easy",
    generationType: "Random Puzzle",
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const puzzle = generatePuzzle(
      gameConfig.difficulty,
      gameConfig.generationType
    );

    const playerGrid = Array(puzzle.size)
      .fill()
      .map(() => Array(puzzle.size).fill(0));

    setGameState({
      grid: playerGrid,
      solution: puzzle.solution,
      rowClues: puzzle.rowClues,
      colClues: puzzle.colClues,
      isComplete: false,
      size: puzzle.size,
    });
  };

  const handleCellClick = (row, col, forcedValue = null) => {
    if (gameState.isComplete) return;

    const newGrid = gameState.grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (forcedValue !== null) {
            return forcedValue;
          }
          return cell === 1 ? 0 : 1;
        }
        return cell;
      })
    );

    const updatedGameState = {
      ...gameState,
      grid: newGrid,
    };

    setGameState(updatedGameState);

    checkForWin(newGrid);
  };

  const checkForWin = (grid) => {
    const hasWon = checkWinCondition(grid, gameState.solution);

    if (hasWon) {
      setGameState((prev) => ({
        ...prev,
        grid,
        isComplete: true,
      }));

      setTimeout(() => {
        navigate("/win", {
          state: {
            difficulty: gameConfig.difficulty,
            generationType: gameConfig.generationType,
          },
        });
      }, 1500);
    }
  };

  const resetGame = () => {
    const playerGrid = Array(gameState.size)
      .fill()
      .map(() => Array(gameState.size).fill(0));
    setGameState((prev) => ({
      ...prev,
      grid: playerGrid,
      isComplete: false,
    }));
  };

  const generateNewPuzzle = () => {
    initializeGame();
  };

  const revealSolution = () => {
    if (process.env.NODE_ENV === "development") {
      setGameState((prev) => ({
        ...prev,
        grid: prev.solution.map((row) => [...row]),
        isComplete: true,
      }));
    }
  };

  return (
    <div className="container-fluid py-3">
      <GameHeader
        difficulty={gameConfig.difficulty}
        onHomeClick={() => navigate("/")}
      />

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
          />
        </div>
      </div>

      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          <GameControls
            onReset={resetGame}
            onNewPuzzle={generateNewPuzzle}
            isComplete={gameState.isComplete}
          />
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="row justify-content-center mt-3">
          <div className="col-auto">
            <div className="text-center">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={revealSolution}
                title="Reveal solution (dev only)"
              >
                Reveal Solution
              </button>
              <small className="text-muted d-block mt-1">
                Development tools
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
