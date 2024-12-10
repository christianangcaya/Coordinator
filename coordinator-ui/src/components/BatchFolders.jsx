import React from "react";
import "./BatchFolders.css";
import folder from "../assets/folder.png";
import { useNavigate } from "react-router-dom";

const BatchFolders = ({ batches, directory }) => {
  const navigate = useNavigate(); 

  const handleFolderClick = (batch) => {
    navigate(`/${directory}/${batch}`); 
    // navigate("/folder")
  };

  return (
    <div className="batch-folders">
      {batches.map((batch, index) => (
        <div key={index} className="folder">
          <img onClick={() => handleFolderClick(batch)} src={folder} alt="Folder" />
          <p onClick={() => handleFolderClick(batch)}>{batch}</p>
        </div>
      ))}
    </div>
  );
};

export default BatchFolders;
