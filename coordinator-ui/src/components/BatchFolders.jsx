import React from "react";
import "./BatchFolders.css";
import folder from "../assets/folder.png";
import { useNavigate } from "react-router-dom";

const BatchFolders = ({ batches, directory, parentFolder = "" }) => {
  const navigate = useNavigate();

  const handleFolderClick = (batch) => {
    if (parentFolder) {
      // Navigate to subfolder (e.g., /scholar/2024/a-c)
      navigate(`/${directory}/${parentFolder}/${batch}`);
    } else {
      // Navigate to main folder (e.g., /folder/2024)
      navigate(`/${directory}/${batch}`);
    }
  };

  return (
    <div className="batch-folders">
      {batches.map((batch, index) => (
        <div key={index} className="folder">
          <img
            onClick={() => handleFolderClick(batch)}
            src={folder}
            alt="Folder"
          />
          <p onClick={() => handleFolderClick(batch)}>{batch}</p>
        </div>
      ))}
    </div>
  );
};

export default BatchFolders;
