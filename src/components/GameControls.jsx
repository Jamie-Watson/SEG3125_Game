import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useLocation, useNavigate } from 'react-router-dom';

const GameControls = ({
  onReset,
  onRevealSolution,
  onHint,
  onToggleMode,
  isComplete,
  currentMode = "fill",
}) => {
  const [mode, setMode] = useState(currentMode);

  const handleToggleMode = () => {
    const newMode = mode === "fill" ? "cross" : "fill";
    setMode(newMode);
    onToggleMode(newMode);
  };

  const navigate = useNavigate();

  return (
    <div className="container d-flex gap-2 align-items-center justify-content-center p-3 ToolBar">
      <button
        className="btn rounded-circle d-flex align-items-center justify-content-center ToolBarButton"
        onClick={onReset}
        data-tooltip-id="reset-tooltip"
        disabled={isComplete}
      >
        <i className="bi bi-arrow-clockwise fs-2"></i>
      </button>

      <button
        className="btn rounded-circle d-flex align-items-center justify-content-center ToolBarButton"
        onClick={onRevealSolution}
        data-tooltip-id="reveal-tooltip"
        disabled={isComplete}
      >
        <i className="bi bi-eye-fill fs-2"></i>
      </button>

      <div className="btn-group" role="group" data-tooltip-id="mode-tooltip">
        <button
          className={`btn ${
            mode === "fill" ? "btn-primary ToolBarToggleSelected" : "ToolBarToggleUnselected"
          } d-flex align-items-center justify-content-center`}
          onClick={() => mode !== "fill" && handleToggleMode()}
          disabled={isComplete}
        >
          <i class="bi bi-square-fill fs-2"></i>
        </button>
        <button
          className={`btn ${
            mode === "cross" ? "btn ToolBarToggleSelected" : "ToolBarToggleUnselected"
          } d-flex align-items-center justify-content-center`}
          onClick={() => mode !== "cross" && handleToggleMode()}
          disabled={isComplete}
        >
          <i class="bi bi-x-lg fs-2"></i>
        </button>
      </div>


           
      <button
        className="btn rounded-circle d-flex align-items-center justify-content-center ToolBarButton"
        onClick={() => navigate('/')} 
        data-tooltip-id="hint-tooltip"
        disabled={isComplete}
      >
        <i className="bi bi-house fs-2"></i>
      </button>

      <Tooltip id="reset-tooltip" content="Reset puzzle" />
      <Tooltip id="reveal-tooltip" content="Reveal solution" />
      <Tooltip id="hint-tooltip" content="Return to the home page" />
      <Tooltip
        id="mode-tooltip"
        content={`Switch to ${mode === "fill" ? "cross" : "fill"} mode`}
      />
    </div>
  );
};

export default GameControls;
