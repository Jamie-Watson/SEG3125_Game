import { useState, useCallback } from 'react';

const NonogramGrid = ({ grid, rowClues, colClues, onCellClick, isComplete, gameMode = 'fill' }) => {
  const gridSize = grid.length;
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);

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

  return (
    <div className="nonogram-container">
      <div className="d-flex justify-content-center mb-2">
        <div style={{ marginLeft: '60px' }}>
          <div className="d-flex">
            {colClues.map((clue, index) => (
              <div 
                key={index}
                className="text-center fw-bold"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
              >
                {clue.join(' ')}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center">
        <div className="me-3">
          {rowClues.map((clue, index) => (
            <div 
              key={index}
              className="text-end fw-bold"
              style={{ 
                width: '50px', 
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: '14px'
              }}
            >
              {clue.join(' ')}
            </div>
          ))}
        </div>

        <div 
          className="game-grid"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="d-flex">
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`grid-cell ${
                    cell === 1 ? 'filled' : cell === 2 ? 'crossed' : 'empty'
                  }`}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #333',
                    backgroundColor: cell === 1 ? '#333' : 'white',
                    color: cell === 2 ? '#666' : 'transparent',
                    cursor: isComplete ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                  onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
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
  );
};

export default NonogramGrid;