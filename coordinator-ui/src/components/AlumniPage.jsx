import React, { useState, useEffect } from "react";
import Header from "./Header";
import ScholarsTable from "./ScholarsTable";
import BackButton from "./BackButton";
import SearchBar from "./SearchBar";
import axios from "axios";

const AlumniPage = () => {
  const [AlumniData, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/alumni");
        const data = response.data;

        const formattedAlumni = data.map((alumni) => ({
          applicant_id: alumni.application_id,
          contact_number: alumni.contact_number || "N/A",
          last_name: alumni.last_name,
          first_name: alumni.first_name,
          middle_name: alumni.middle_name || "",
          suffix: alumni.suffix || "",
          year: alumni.application_id.slice(0, 4),
          address: `${
            alumni.street ? `${alumni.street}, ` : ""
          }${alumni.purok}, ${alumni.barangay}, ${alumni.municipality}`,
          school: alumni.school_name || "N/A",
          status: alumni.status.charAt(0).toUpperCase() + alumni.status.slice(1),
          remarks: alumni.remarks || "N/A",
        }));

        setAlumni(formattedAlumni);
        setFilteredAlumni(formattedAlumni);
      } catch (error) {
        console.error("Error fetching applicants data:", error);
      }
    };

    fetchApplicants();
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();

    const filtered = AlumniData.filter((alumni) => {
      return (
        alumni.first_name.toLowerCase().includes(lowerCaseQuery) ||
        alumni.last_name.toLowerCase().includes(lowerCaseQuery) ||
        alumni.school.toLowerCase().includes(lowerCaseQuery) ||
        alumni.year.includes(query)
      );
    });

    setFilteredAlumni(filtered);
  };

  return (
    <div className="applicants-page">
      <Header />
      <div className="file-manager-header">
        <h2>Alumni</h2>
        <SearchBar onSearch={handleSearch} />
        <BackButton />
      </div>
      <ScholarsTable scholars={filteredAlumni} />
    </div>
  );
};

export default AlumniPage;
