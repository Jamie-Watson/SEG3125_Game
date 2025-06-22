import { useState } from "react";
import { validateImageFile, generateImagePreview } from "../assets/code/nonogramUtils";

const GameForm = ({ onPlayClick }) => {
  const [difficulty, setDifficulty] = useState("Easy");
  const [generationType, setGenerationType] = useState("Random Puzzle");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSettings, setImageSettings] = useState({
    threshold: 128,
    optimize: true,
    contrast: 1.0
  });

  const handlePlayClick = async () => {
    if (generationType === "Upload Image" && !selectedFile) {
      setFileError("Please select an image file first");
      return;
    }

    setIsProcessing(true);
    
    try {
      await onPlayClick({
        difficulty,
        generationType,
        imageFile: selectedFile,
        imageSettings: imageSettings 
      });
    } catch (error) {
      console.error("Error in handlePlayClick:", error);
      setFileError(error.message || "An error occurred while processing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    if (selectedFile && generationType === "Upload Image") {
      generatePreview(selectedFile, level);
    }
  };

  const handleGenerationTypeChange = (type) => {
    setGenerationType(type);
    if (type !== "Upload Image") {
      setSelectedFile(null);
      setFileError("");
      setImagePreview(null);
    }
  };

  const generatePreview = async (file, currentDifficulty = difficulty) => {
    try {
      const preview = await generateImagePreview(file, currentDifficulty, imageSettings.threshold);
      setImagePreview(preview);
    } catch (error) {
      console.error("Error generating preview:", error);
      setImagePreview(null);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    const errors = validateImageFile(file, 5); 
    if (errors.length > 0) {
      setFileError(errors.join(", "));
      setImagePreview(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
    
    await generatePreview(file);
  };

  const handleThresholdChange = async (newThreshold) => {
    const newSettings = { ...imageSettings, threshold: newThreshold };
    setImageSettings(newSettings);
    
    if (selectedFile) {
      await generatePreview(selectedFile);
    }
  };

  const PreviewGrid = ({ grid, size }) => {
    const cellSize = Math.max(4, Math.min(12, 240 / size)); 
    
    return (
      <div className="d-flex flex-column align-items-center mt-3">
        <div 
          className="preview-grid border border-white rounded p-2"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            maxWidth: '300px',
            maxHeight: '300px',
            overflow: 'hidden'
          }}
        >
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="d-flex" style={{ lineHeight: 0 }}>
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: cell === 1 ? '#333' : 'white',
                    border: '0.5px solid #666',
                    display: 'inline-block'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
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
            <div className="mt-3">
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
                    handleFileSelect(file);
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
                      handleFileSelect(file);
                    }
                  }}
                />
              </div>
              
              {fileError && (
                <div className="text-center mt-2">
                  <small className="text-danger">{fileError}</small>
                </div>
              )}

              {imagePreview && (
                <div className="text-center">
                  
                  <PreviewGrid 
                    grid={imagePreview.grid} 
                    size={imagePreview.size} 
                  />
                  
                  <div className="mt-2">
                    <small className="text-muted">
                      This is exactly how your puzzle will look when you play
                    </small>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="row justify-content-center px-3 w-100">
        <div className="col-sm-4">
          <button
            className="btn btn-success w-100 PlayButton fw-bold"
            onClick={handlePlayClick}
            disabled={isProcessing || (generationType === "Upload Image" && !selectedFile)}
          >
            {isProcessing ? "Processing..." : "Play"}
            {!isProcessing && <i className="bi bi-play-fill ms-2"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameForm;