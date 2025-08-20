import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ visible, onClose, message }) => {
  if (!visible) return null;

  return (
    <div className="custom-alert-backdrop">
      <div className="custom-alert-box">
        <p>{message}</p>
        <button className="custom-alert-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;