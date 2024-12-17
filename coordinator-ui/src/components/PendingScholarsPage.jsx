import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import BackButton from "./BackButton";
import SearchBar from "./SearchBar";
import axios from "axios";
import "./PendingScholarsPage.css";

const PendingScholarsPage = () => {
  const [pendingScholars, setPendingScholars] = useState([]);
  const [filteredScholars, setFilteredScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingScholars = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/pending_scholars"
        );
        const applicantsData = response.data;

        const formattedScholars = applicantsData.map((pending_scholar) => ({
          applicant_id: pending_scholar.application_id,
          contact_number: pending_scholar.contact_number || "N/A",
          last_name: pending_scholar.last_name,
          first_name: pending_scholar.first_name,
          middle_name: pending_scholar.middle_name || "",
          suffix: pending_scholar.suffix || "",
          year: pending_scholar.application_id.slice(0, 4),
          address: `${
            pending_scholar.street ? `${pending_scholar.street}, ` : ""
          }${pending_scholar.purok}, ${pending_scholar.barangay}, ${pending_scholar.municipality}`,
          school: pending_scholar.school_name || "N/A",
          status: pending_scholar.status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          remarks: pending_scholar.remarks || "N/A",
          action_title: "Action",
          actions: (
            <div className="applicants-actions">
              <button
                className="accept-btn"
                onClick={() => handleAccept(pending_scholar.application_id)}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => handleReject(pending_scholar.application_id)}
              >
                Reject
              </button>
            </div>
          ),
        }));

        setPendingScholars(formattedScholars);
        setFilteredScholars(formattedScholars);
      } catch (err) {
        console.error("Error fetching pending scholars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingScholars();
  }, []);

  const handleAccept = async (applicantId) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/pending_scholars/${applicantId}`,
        { status: "scholar" }
      );

      if (response.data.success) {
        setFilteredScholars((prevScholars) =>
          prevScholars.map((scholar) =>
            scholar.applicant_id === applicantId
              ? { ...scholar, status: "Scholar" }
              : scholar
          )
        );
        console.log(`Applicant with ID: ${applicantId} has been accepted.`);
      } else {
        console.error("Failed to update applicant status.");
      }
    } catch (error) {
      console.error("Error updating applicant status:", error);
    }
  };

  const handleReject = (applicantId) => {
    console.log(`Rejecting applicant ID: ${applicantId}`);
  };

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();

    const filtered = pendingScholars.filter((scholar) => {
      return (
        scholar.first_name.toLowerCase().includes(lowerCaseQuery) ||
        scholar.last_name.toLowerCase().includes(lowerCaseQuery) ||
        scholar.school.toLowerCase().includes(lowerCaseQuery) ||
        scholar.year.includes(query)
      );
    });

    setFilteredScholars(filtered);
  };

  return (
    <div className="pending-scholars-page">
      <Header />
      <div className="file-manager-header">
        <h2>Pending Scholars</h2>
        <SearchBar onSearch={handleSearch} />
        <BackButton />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ScholarsTable scholars={filteredScholars} />
      )}
    </div>
  );
};

export default PendingScholarsPage;
