const GameControls = () => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <button className="btn btn-outline-secondary">
        <i className="fas fa-redo"></i>
      </button>
      <button className="btn btn-outline-secondary">
        <i className="fas fa-pause"></i>
      </button>
      <button className="btn btn-outline-secondary">
        <i className="fas fa-times"></i>
      </button>
      <button className="btn btn-primary">
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default GameControls;