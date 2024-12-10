import React from "react";
import "./StatusCard.css";
import { useNavigate } from "react-router-dom";

const StatusCard = ({ title, count, directory }) => {
  const navigate = useNavigate();

  const handleStatusClick = () => {
    navigate(`/${directory}/${title}`); 
    //navigate("/folder")
  };


  return (
    <div className="status-card" onClick={handleStatusClick}>
      <h3>{count}</h3>
      <p>{title}</p>
    </div>
  );
};

export default StatusCard;
