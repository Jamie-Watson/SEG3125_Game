import { useNavigate, useLocation } from 'react-router-dom';

const WinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const difficulty = searchParams.get('difficulty');
  const generationType = searchParams.get('generationType');

  const shareScore = () => {
    const shareText = 'Just completed a Nonogram ' +
      difficulty + ' level puzzle! Play at: https://gramjamsnonograms.netlify.app/';

    navigator.clipboard.writeText(shareText)
      .then(() => {
        alert('Copied to clipboard: ' + shareText);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  const playAnother = () => {
    navigate('/game', {
      state: {
        difficulty: difficulty,
        generationType: 'Random Puzzle' 
      }
    });
  };

  return (
    <div className="container-fluid vh-100 align-items-center justify-content-center WinPage">
      <div className="row align-items-center justify-content-center h-100">
        <div className="col-lg-8">
          <div className="card shadow-lg text-center WinPageCard">
            <div className="card-body p-5">
              <i className="bi bi-award fs-1"></i>
              <h2 className="card-title mb-3">Puzzle Finished!</h2>
              <p className="card-text mb-4 WinPageText">
                You completed the{' '}
                <span className="fw-bold WinPageImportantText">{difficulty}</span>{' '}
                level puzzle.
              </p>

              <div className="row justify-content-center">
                <div className="col-lg-4 mb-3">
                  <button 
                    className="btn btn-primary w-100 WinPagePlayButton"
                    onClick={playAnother}
                  >
                    Play Another
                  </button>
                </div>
                <div className="col-lg-4 mb-3">
                  <button 
                    className="btn btn-outline-secondary w-100 WinPageDefaultButton"
                    onClick={() => navigate('/')}
                  >
                    Home
                  </button>
                </div>
                <div className="col-lg-4">
                  <button 
                    className="btn btn-outline-secondary w-100 WinPageDefaultButton"
                    onClick={() => shareScore()}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinPage;