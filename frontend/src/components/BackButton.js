import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to, label = 'Back' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleBack} className="btn btn-secondary back-btn">
      ← {label}
    </button>
  );
};

export default BackButton;