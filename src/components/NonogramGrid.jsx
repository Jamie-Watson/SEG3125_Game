import { useState, useCallback } from 'react';

const NonogramGrid = ({ grid, rowClues, colClues, onCellClick, isComplete, gameMode = 'fill' }) => {
  const gridSize = grid.length;
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);

  const isLargeGrid = gridSize > 10;

  const handleMouseDown = useCallback((rowIndex, colIndex, event) => {
    if (isComplete) return;
    
    event.preventDefault();
    const currentValue = grid[rowIndex][colIndex];
    
    let newValue;
    if (gameMode === 'fill') {
      newValue = currentValue === 1 ? 0 : 1;
    } else {
      if (currentValue === 0) newValue = 2; 
      else if (currentValue === 2) newValue = 0; 
      else newValue = currentValue; 
    }
    
    setIsDragging(true);
    setDragValue(newValue);
    onCellClick(rowIndex, colIndex);
  }, [grid, onCellClick, isComplete, gameMode]);

  const handleMouseEnter = useCallback((rowIndex, colIndex) => {
    if (!isDragging || isComplete) return;
    
    const currentValue = grid[rowIndex][colIndex];
    if (currentValue !== dragValue) {
      onCellClick(rowIndex, colIndex);
    }
  }, [isDragging, dragValue, grid, onCellClick, isComplete]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragValue(null);
  }, []);

  const handleTouchStart = useCallback((rowIndex, colIndex, event) => {
    if (isComplete) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const currentValue = grid[rowIndex][colIndex];
    
    let newValue;
    if (gameMode === 'fill') {
      newValue = currentValue === 1 ? 0 : 1;
    } else {
      if (currentValue === 0) newValue = 2; 
      else if (currentValue === 2) newValue = 0; 
      else newValue = currentValue; 
    }
    
    setIsDragging(true);
    setDragValue(newValue);
    onCellClick(rowIndex, colIndex);
  }, [grid, onCellClick, isComplete, gameMode]);

  const handleTouchMove = useCallback((event) => {
    if (!isDragging || isComplete) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.dataset.row && element.dataset.col) {
      const rowIndex = parseInt(element.dataset.row);
      const colIndex = parseInt(element.dataset.col);
      const currentValue = grid[rowIndex][colIndex];
      
      if (currentValue !== dragValue) {
        onCellClick(rowIndex, colIndex);
      }
    }
  }, [isDragging, isComplete, grid, dragValue, onCellClick]);

  const handleTouchEnd = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    setDragValue(null);
  }, []);

  return (
    <div className={`nonogram-container ${isLargeGrid ? 'large-grid' : ''}`}>
      <div className="nonogram-grid-wrapper">
        <div className="col-clues-container">
          <div className="col-clues-wrapper">
            {colClues.map((clue, index) => (
              <div key={index} className="col-clue">
                <div className="col-clue-content">
                  {clue.map((num, i) => (
                    <div key={i}>{num}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-and-row-clues">
          <div className="row-clues-container">
            {rowClues.map((clue, index) => (
              <div key={index} className="row-clue">
                {clue.join(' ')}
              </div>
            ))}
          </div>

          <div 
            className="game-grid"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`grid-cell ${
                      cell === 1 ? 'filled' : cell === 2 ? 'crossed' : 'empty'
                    }`}
                    data-row={rowIndex}
                    data-col={colIndex}
                    onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onTouchStart={(e) => handleTouchStart(rowIndex, colIndex, e)}
                    onTouchEnd={handleTouchEnd}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isDragging && !isComplete) {
                        onCellClick(rowIndex, colIndex);
                      }
                    }}
                    disabled={isComplete}
                  >
                    {cell === 2 ? '×' : ''}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonogramGrid;