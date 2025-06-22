import { useNavigate } from 'react-router-dom';

const WinPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card shadow-lg text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="mb-4">
            <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center" 
                 style={{ width: '80px', height: '80px' }}>
              <i className="fas fa-check text-white" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
          
          <h2 className="card-title mb-3">Puzzle Finished!</h2>
          <p className="card-text text-muted mb-4">
            You completed the <span className="fw-bold text-success">easy</span> level puzzle.
          </p>
          
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/game')}
            >
              Play Another
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinPage;