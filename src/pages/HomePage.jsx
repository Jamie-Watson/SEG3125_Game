import { useNavigate } from "react-router-dom";
import GameForm from "../components/GameForm"; 
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = (gameConfig) => {
    navigate("/game", {
      state: gameConfig,
    });
  };

  return (
    <>
      <div className="container-fluid d-flex flex-column align-items-center py-2 justify-content-center">
  <div className="row">
    <div className="col-sm-12">
      <h1 className="display-1 text-center">Gram Jams</h1>
    </div>
  </div>

  <div className="row justify-content-center flex-grow-1 align-items-center">
    <div className="col-lg-8 d-flex justify-content-center">
      <GameForm onPlayClick={handlePlayClick} />
    </div>
  </div>
<div className="row justify-content-center w-100 mt-2">
  <div className="col-12 d-flex justify-content-center">
    <div style={{ maxWidth: '400px', width: '100%' }}>
      <button
        className="btn btn-primary w-100 HomeInfoButton"
        onClick={() =>
          window.open(
            "https://www.youtube.com/watch?v=EaxT0RGWrjw",
            "_blank"
          )
        }
      >
        Learn How To Play
        <i className="bi bi-box-arrow-up-right ms-2"></i>
      </button>
    </div>
  </div>
</div>

</div>

    </>
  );
};

export default HomePage;