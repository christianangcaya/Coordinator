import React from "react";
import "./StatusCard.css";

const StatusCard = ({ title, count }) => {
  return (
    <div className="status-card">
      <h3>{count}</h3>
      <p>{title}</p>
    </div>
  );
};

export default StatusCard;
