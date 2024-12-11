import React from 'react';
import './logDisplay.css';

const LogDisplay = ({ logs }) => {
  return (
    <div className="log-display">
      <h3>Log Messages</h3>
      <div className="log-messages">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default LogDisplay;

