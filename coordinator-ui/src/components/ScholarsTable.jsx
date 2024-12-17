import React, { useState, useEffect } from "react";
import "./ScholarsTable.css";
import axios from "axios";

const DocumentPopup = ({ scholar, onClose }) => {
  if (!scholar) return null;

  const name = `${scholar.last_name}, ${scholar.first_name} ${scholar.middle_name} ${scholar.suffix}`;
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const applicationId = scholar.applicant_id;

  useEffect(() => {
    if (scholar) {
      const fetchFiles = async () => {
        try {
          const BASE_URL = "http://127.0.0.1:5000";
          const response = await axios.get(
            `${BASE_URL}/api/${applicationId}/scholar_files`
          );
          console.log("Server Response:", response.data);
          setFiles(response.data.files || []);
        } catch (err) {
          const errorMessage =
            err.response?.data?.error ||
            "An error occurred while fetching files.";
          console.error("Error fetching files:", errorMessage);
          setError(errorMessage);
        }
      };
      fetchFiles();
    }
  }, [scholar]);

  // Function to close the preview
  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <div className="header-sch">
          <h2>Personal Information</h2>
          <img
            src="https://via.placeholder.com/100"
            alt={`${name}'s Photo`}
            className="scholar-photo"
          />
        </div>
        <div className="personal-info">
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Scholar ID:</strong> {scholar.applicant_id}
          </p>
          <p>
            <strong>Batch:</strong> {scholar.year}
          </p>
          <p>
            <strong>Address:</strong> {scholar.address}
          </p>
          <p>
            <strong>Contact:</strong> {scholar.contact_number}
          </p>
          <p>
            <strong>School:</strong> {scholar.school}
          </p>
        </div>
        <h2>Documents</h2>
        {error && <p className="error">{error}</p>}
        <div className="documents-grid">
          {files.length > 0 ? (
            files.map((fileUrl, index) => (
              <div
                key={index}
                className="document-item"
                onClick={() => setPreviewImage(fileUrl)} // Set preview image on click
                style={{ cursor: "pointer" }}
              >
                <img
                  src={fileUrl} // Use the file URL provided by the server
                  alt={`Document ${index + 1}`}
                  className="document-icon"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
                <p>{fileUrl.split("/").pop()}</p>
              </div>
            ))
          ) : (
            <p>No files available.</p>
          )}
        </div>
        {/* Image Preview Modal */}
        {previewImage && (
          <div className="image-preview-modal" onClick={closePreview}>
            <div
              className="image-preview-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-preview" onClick={closePreview}>
                ✕
              </button>
              <img src={previewImage} alt="Preview" className="preview-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Scholars Table Component
const ScholarsTable = ({ scholars }) => {
  const [selectedScholar, setSelectedScholar] = useState(null);

  const handleViewClick = (scholar) => {
    setSelectedScholar(scholar);
  };

  const handleClosePopup = () => {
    setSelectedScholar(null);
  };

  return (
    <div className="scholars-table-container">
      <div className="scholars-table-wrapper">
        <table className="scholars-table">
          <thead>
            <tr>
              <th>Scholar's Name</th>
              <th>Year</th>
              <th>Address</th>
              <th>School</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Documents</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {scholars.map((scholar, index) => (
              <tr key={index}>
                <td>{`${scholar.last_name}, ${scholar.first_name} ${scholar.middle_name} ${scholar.suffix}`}</td>
                <td>{scholar.year}</td>
                <td>{scholar.address}</td>
                <td>{scholar.school}</td>
                <td>{scholar.status}</td>
                <td>{scholar.remarks}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => handleViewClick(scholar)}
                  >
                    VIEW
                  </button>
                </td>
                <td>{scholar.actions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedScholar && (
        <DocumentPopup scholar={selectedScholar} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ScholarsTable;
