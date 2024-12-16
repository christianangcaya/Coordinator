import React, { useState } from "react";
import "./ScholarsTable.css";

const DocumentPopup = ({ scholar, onClose }) => {
  if (!scholar) return null;

  const documents = [
    "Birth Certificate",
    "Certificate of MSWDO",
    "Voter's Certificate",
    "COG",
    "Good Moral",
    "Certificate of Indigency",
    "Entrance Test Results",
    "Registration Form",
    "Income Tax Return",
    "Signature",
    "Application Form",
  ];

  console.log(scholar.applicant_profile)

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
            alt={`${scholar.name}'s Photo`}
            className="scholar-photo"
          />
        </div>
        <div className="personal-info">
          <p><strong>Name:</strong> {scholar.name}</p>
          <p><strong>Scholar ID:</strong> {scholar.applicant_id}</p> 
          <p><strong>Batch:</strong> {scholar.year}</p>
          <p><strong>Address:</strong> {scholar.address}</p>
          <p><strong>Contact:</strong> {scholar.contact_number}</p> 
          <p><strong>School:</strong> {scholar.school}</p>
        </div>
        <h2>Documents</h2>
        <div className="documents-grid">
          {documents.map((doc, index) => (
            <div key={index} className="document-item">
              <img
                src="https://via.placeholder.com/100" 
                alt="Document Icon"
                className="document-icon"
              />
              <p>{doc}</p>
            </div>
          ))}
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
            </tr>
          </thead>
          <tbody>
            {scholars.map((scholar, index) => (
              <tr key={index}>
                <td>{scholar.name}</td>
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
