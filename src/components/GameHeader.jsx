const GameHeader = ({ difficulty, onHomeClick }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <button 
        className="btn btn-outline-primary"
        onClick={onHomeClick}
      >
        ← Back to Menu
      </button>
      
      <div className="text-center">
        <h3 className="mb-0">Nonogram Game</h3>
        <small className="text-muted">Difficulty: {difficulty}</small>
      </div>
      
      <div style={{ width: '120px' }}></div> 
    </div>
  );
};

export default GameHeader;