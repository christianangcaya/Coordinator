import React from "react";
import "./BatchFolders.css";

const BatchFolders = ({ batches }) => {
  return (
    <div className="batch-folders">
      {batches.map((batch, index) => (
        <div key={index} className="folder">
          <img src="/folder-icon.png" alt="Folder" />
          <p>{batch}</p>
        </div>
      ))}
    </div>
  );
};

export default BatchFolders;
