import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import "./ApplicantsPage.css";
import axios from "axios";

const ApplicantsPage = () => {
  const [applicantsData, setScholars] = useState([]);

  useEffect(() => {
    // Fetch applicants data from the backend
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/applicants");
        setScholars(response.data);  // Save the applicants data
      } catch (error) {
        console.error("Error fetching applicants data:", error);
      }
    };

    fetchApplicants();
  }, []);

  const applicants = applicantsData.map((applicant) => ({
    applicant_id: applicant.application_id,
    contact_number: applicant.contact_number || "N/A",
    last_name: applicant.last_name,
    first_name: applicant.first_name,
    middle_name: applicant.middle_name || "",
    suffix: applicant.suffix || "",
    year: applicant.application_id.slice(0, 4),
    address: `${
      applicant.street ? `${applicant.street}, ` : ""
    }${applicant.purok}, ${applicant.barangay}, ${applicant.municipality}`,
    school: applicant.school_name || "N/A",
    status: applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1),
    remarks: applicant.remarks || "N/A",
    action_title: "Action",
    actions: (
      <div className="applicants-actions">
        <button
          className="accept-btn"
          onClick={() => handleAccept(applicant.application_id)}
        >
          Accept
        </button>
        <button
          className="reject-btn"
          onClick={() => handleReject(applicant.application_id)}
        >
          Reject
        </button>
      </div>
    ),
  }));

  const handleAccept = async (applicantId) => {
    try {
      // Call the backend API to update the status to "scholar"
      const response = await axios.put(`http://127.0.0.1:5000/api/applicants/${applicantId}`, {
        status: "scholar",
      });

      if (response.data.success) {
        // Update the local state with the updated status
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
    console.log(`Rejected applicant with ID: ${applicantId}`);
    // Add your reject logic or API call here
  };

  return (
    <div className="applicants-page">
      <Header />
      <h2>Applicants Page</h2>
      <ScholarsTable scholars={applicants} />
    </div>
  );
};

export default ApplicantsPage;
