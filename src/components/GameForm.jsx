import { useState } from "react";

const GameForm = ({ onPlayClick }) => {
  const [difficulty, setDifficulty] = useState("Easy");
  const [generationType, setGenerationType] = useState("Random Puzzle");
  const [timerSettings, setTimerSettings] = useState("Timer On");
  const [selectedFile, setSelectedFile] = useState(null);

  const handlePlayClick = () => {
    onPlayClick({
      difficulty,
      generationType,
      timerSettings,
    });
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleGenerationTypeChange = (type) => {
    setGenerationType(type);
    if (type !== "Upload Image") {
      setSelectedFile(null);
    }
  };

  const handleTimerSettingsChange = (timer) => {
    setTimerSettings(timer);
  };

  return (
    <div className="container-fluid GameForm p-3">
      <div className="row justify-content-center mb-4 px-3 w-100">
        <h2 className="text-white text-center mb-2 fs-1 fw-bold">Difficulty</h2>
        <p className="text-white text-center mb-4 fs-5">
          This will affect the size and complexity of your puzzle, whether
          generated or from an image
        </p>

        <div className="row GameToggleBox py-1">
          {["Easy", "Medium", "Hard"].map((level) => (
            <div
              key={level}
              className="col text-center py-3 fw-bold GameSettingsButton"
              style={{
                backgroundColor:
                  difficulty === level ? "#1e88a8" : "transparent",
                color: difficulty === level ? "white" : "#1e88a8",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleDifficultyChange(level)}
            >
              {level}
            </div>
          ))}
        </div>
      </div>

      <div className="row justify-content-center mb-4 px-3 w-100">
        <h2 className="text-white text-center mb-2 fs-1 fw-bold">
          Generation Type
        </h2>
        <p className="text-white text-center mb-4 fs-5">
          Upload an image and we'll convert it into a Nonogram puzzle based on
          the chosen difficulty
        </p>

        <div className="row GameToggleBox py-1">
          {["Random Puzzle", "Upload Image"].map((genType) => (
            <div
              key={genType}
              className="col text-center py-3 fw-bold GameSettingsButton"
              style={{
                backgroundColor:
                  generationType === genType ? "#1e88a8" : "transparent",
                color: generationType === genType ? "white" : "#1e88a8",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleGenerationTypeChange(genType)}
            >
              {genType}
            </div>
          ))}

          {generationType === "Upload Image" && (
            <div
              className="upload-drop-zone text-center text-white p-5 border border-white rounded"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  setSelectedFile(file);
                  console.log("Dropped image file:", file);
                }
              }}
              onClick={() => document.getElementById("hiddenFileInput").click()}
              style={{ cursor: "pointer" }}
            >
              <p className="BlueText fs-3">
                {selectedFile
                  ? `Current file: ${selectedFile.name}`
                  : "Drop an image here or click to upload"}
              </p>
              <input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file); 
                    console.log("Selected file:", file);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="row justify-content-center mb-4 px-3 w-100">
        <h2 className="text-white text-center mb-2 fs-1 fw-bold">Timer</h2>
        <p className="text-white text-center mb-4 fs-5">
          Choose whether to enable or disable the puzzle timer during gameplay
        </p>

        <div className="row GameToggleBox py-1">
          {["Timer On", "Timer Off"].map((timer) => (
            <div
              key={timer}
              className="col text-center py-3 fw-bold GameSettingsButton"
              style={{
                backgroundColor:
                  timerSettings === timer ? "#1e88a8" : "transparent",
                color: timerSettings === timer ? "white" : "#1e88a8",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleTimerSettingsChange(timer)}
            >
              {timer}
            </div>
          ))}
        </div>
      </div>

      <div className="row justify-content-center px-3 w-100">
        <div className="col-sm-4">
          <button
            className="btn btn-success w-100 PlayButton fw-bold"
            onClick={handlePlayClick}
          >
            Play
            <i className="bi bi-play-fill ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameForm;
