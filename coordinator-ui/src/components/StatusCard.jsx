import React from "react";
import "./StatusCard.css";
import { useNavigate } from "react-router-dom";

const StatusCard = ({ title, count, directory }) => {
  const navigate = useNavigate();

  const handleStatusClick = () => {
    navigate(`/${directory}/${title}`); 
    //navigate("/folder")
  };
  const displayTitle = title.replace("-", " ");


  return (
    <div className="status-card" onClick={handleStatusClick} id={title}>
      <h3>{count}</h3>
      <p>{displayTitle}</p>
    </div>
  );
};

export default StatusCard;
