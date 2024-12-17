import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import BackButton from "./BackButton";
import SearchBar from "./SearchBar";
import axios from "axios";
import "./PendingScholarsPage.css";

const ActiveScholarsPage = () => {
  const [activeScholars, setActiveScholars] = useState([]);
  const [filteredScholars, setFilteredScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingScholars = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/active_scholars");
        const applicantsData = response.data;

        const formattedScholars = applicantsData.map((active_scholar) => ({
          applicant_id: active_scholar.application_id,
          contact_number: active_scholar.contact_number || "N/A",
          last_name: active_scholar.last_name,
          first_name: active_scholar.first_name,
          middle_name: active_scholar.middle_name || "",
          suffix: active_scholar.suffix || "",
          year: active_scholar.application_id.slice(0, 4),
          address: `${
            active_scholar.street ? `${active_scholar.street}, ` : ""
          }${active_scholar.purok}, ${active_scholar.barangay}, ${active_scholar.municipality}`,
          school: active_scholar.school_name || "N/A",
          status: active_scholar.status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          remarks: active_scholar.remarks || "N/A",
          action_title: "Action",
          actions: (
            <div className="applicants-actions">
              <button
                className="accept-btn"
                onClick={() => handleAccept(active_scholar.application_id)}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => handleReject(active_scholar.application_id)}
              >
                Reject
              </button>
            </div>
          ),
        }));

        setActiveScholars(formattedScholars);
        setFilteredScholars(formattedScholars);
      } catch (err) {
        console.error("Error fetching active scholars:", err);
        setError("Failed to load active scholars.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingScholars();
  }, []);

  const handleAccept = async (applicantId) => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/pending_scholars/${applicantId}`, {
        status: "scholar",
      });

      if (response.data.success) {
        setActiveScholars((prevScholars) =>
          prevScholars.map((scholar) =>
            scholar.application_id === applicantId
              ? { ...scholar, status: "Scholar" }
              : scholar
          )
        );
        console.log(`Applicant with ID: ${applicantId} has been accepted.`);
      } else {
        console.error("Failed to update scholar status.");
      }
    } catch (error) {
      console.error("Error updating scholar status:", error);
    }
  };

  const handleReject = (applicantId) => {
    console.log(`Rejecting applicant ID: ${applicantId}`);
  };

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = activeScholars.filter((scholar) =>
      scholar.first_name.toLowerCase().includes(lowercasedQuery) ||
      scholar.last_name.toLowerCase().includes(lowercasedQuery) ||
      scholar.school.toLowerCase().includes(lowercasedQuery) ||
      scholar.status.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredScholars(filtered);
  };

  return (
    <div className="pending-scholars-page">
      <Header />
      <div className="file-manager-header">
        <h2>Active Scholars</h2>
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

export default ActiveScholarsPage;
