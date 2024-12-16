import React, { useState, useEffect } from "react";
import "./ScholarsTable.css";
import axios from "axios";

const DocumentPopup = ({ scholar, onClose }) => {
  if (!scholar) return null;

  const name = `${scholar.last_name}, ${scholar.first_name} ${scholar.middle_name} ${scholar.suffix}`;
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const batch = scholar.year;
  const lastName = scholar.last_name;
  const getFolderRange = (lastName) => {
    const firstLetter = lastName[0].toUpperCase();
    if ("A" <= firstLetter && firstLetter <= "C") return "A-C";
    if ("D" <= firstLetter && firstLetter <= "F") return "D-F";
    if ("G" <= firstLetter && firstLetter <= "I") return "G-I";
    if ("J" <= firstLetter && firstLetter <= "L") return "J-L";
    if ("M" <= firstLetter && firstLetter <= "O") return "M-O";
    if ("P" <= firstLetter && firstLetter <= "R") return "P-R";
    if ("S" <= firstLetter && firstLetter <= "U") return "S-U";
    if ("V" <= firstLetter && firstLetter <= "Z") return "V-Z";
    return "Other";
  };
  const index = getFolderRange(lastName);
  const applicationId = scholar.applicant_id;

  useEffect(() => {
    if (scholar) {
      const fetchFiles = async () => {
        try {
          console.log("Fetching files for:", {
            batch,
            index,
            lastName,
            applicationId,
          });

          const response = await axios.get(
            `http://127.0.0.1:5000/api/${batch}/${index}/${lastName}/${applicationId}/scholar_files`
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
            files.map((file, index) => (
              <div key={index} className="document-item">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Document Icon"
                  className="document-icon"
                />
                <p>{file}</p>
              </div>
            ))
          ) : (
            <p>No files available.</p>
          )}
        </div>
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
