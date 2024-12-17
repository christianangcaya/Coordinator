import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import BackButton from "./BackButton";
import SearchBar from "./SearchBar";
import axios from "axios";

const InactiveScholarsPage = () => {
  const [inactiveScholars, setInactiveScholars] = useState([]);
  const [filteredScholars, setFilteredScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

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
        setFilteredScholars(formattedScholars);
      } catch (err) {
        console.error("Error fetching inactive scholars:", err);
        setError("Failed to load inactive scholars.");
      } finally {
        setLoading(false);
      }
    };

    fetchInactiveScholars();
  }, []);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    const lowerKeyword = keyword.toLowerCase();

    const filtered = inactiveScholars.filter((scholar) =>
      `${scholar.first_name} ${scholar.last_name} ${scholar.school} ${scholar.status}`
        .toLowerCase()
        .includes(lowerKeyword)
    );

    setFilteredScholars(filtered);
  };

  return (
    <div className="inactive-scholars-page">
      <Header />
      <div className="file-manager-header">
        <h2>Inactive Scholars</h2>
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

export default InactiveScholarsPage;
