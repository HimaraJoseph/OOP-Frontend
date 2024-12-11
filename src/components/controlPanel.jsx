import React from 'react';
import './controlPanel.css';

const ControlPanel = ({ onStart, onStop }) => {
  return (
    <div className="control-panel">
      <button className="start-button" onClick={onStart}>
        Start
      </button>
      <button className="stop-button" onClick={onStop}>
        Stop
      </button>
    </div>
  );
};

export default ControlPanel;

