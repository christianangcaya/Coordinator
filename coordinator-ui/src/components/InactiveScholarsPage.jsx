import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import axios from "axios";

const InactiveScholarsPage = () => {
  const [inactiveScholars, setInactiveScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInactiveScholars = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/inactive_scholars");
        const applicantsData = response.data;

        const formattedScholars = applicantsData.map((inactive_scholar) => ({
          applicant_id: inactive_scholar.application_id,
          contact_number: inactive_scholar.contact_number || "N/A",
          last_name: inactive_scholar.last_name,
          first_name: inactive_scholar.first_name,
          middle_name: inactive_scholar.middle_name || "",
          suffix: inactive_scholar.suffix || "",
          year: inactive_scholar.application_id.slice(0, 4),
          address: `${
            inactive_scholar.street ? `${inactive_scholar.street}, ` : ""
          }${inactive_scholar.purok}, ${inactive_scholar.barangay}, ${inactive_scholar.municipality}`,
          school: inactive_scholar.school_name || "N/A",
          status: inactive_scholar.status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          remarks: inactive_scholar.remarks || "N/A",
          
        }));

        setInactiveScholars(formattedScholars);
      } catch (err) {
        console.error("Error fetching pending scholars:", err);
        setError("Failed to load pending scholars.");
      } finally {
        setLoading(false);
      }
    };

    fetchInactiveScholars();
  }, []);


  return (
    <div className="pending-scholars-page">
      <Header />
      <h2>Inactive Scholars Page</h2>
      <ScholarsTable scholars={inactiveScholars} />
    </div>
  );
};

export default InactiveScholarsPage;
