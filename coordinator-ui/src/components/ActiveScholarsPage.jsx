import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import BackButton from "./BackButton";
import SearchBar from "./SearchBar";
import axios from "axios";
import "./PendingScholarsPage.css";

const ActiveScholarsPage = () => {
  const [activeScholars, setActiveScholars] = useState([]);
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
      } catch (err) {
        console.error("Error fetching pending scholars:", err);
        setError("Failed to load pending scholars.");
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
        setScholars((prevApplicants) =>
          prevApplicants.map((applicant) =>
            applicant.application_id === applicantId
              ? { ...applicant, status: "Scholar" }
              : applicant
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

  return (
    <div className="pending-scholars-page">
      <Header />
      <div className="file-manager-header">
            <h2>Active Scholars</h2>
            <SearchBar />
            <BackButton />
        </div>
      <ScholarsTable scholars={activeScholars} />
    </div>
  );
};

export default ActiveScholarsPage;
