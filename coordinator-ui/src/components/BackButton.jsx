import React from "react";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";



const BackButton = ({link}) => {
  const navigate = useNavigate(); // Move the hook inside the functional component

  const handleClick = () => {
    navigate(-1)
  };
  return (
    <button className="back-button" onClick={handleClick}>
      ← Back
    </button>
  );
};

export default BackButton;
