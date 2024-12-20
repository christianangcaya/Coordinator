import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatusCard from "./components/StatusCard";
import BatchFolders from "./components/BatchFolders";
import SearchBar from "./components/SearchBar";
import { useParams } from "react-router-dom";
import BackButton from "./components/BackButton";
import ScholarsTable from "./components/ScholarsTable";
import Login from "./components/Login";
import "./App.css";
import axios from "axios";
import ApplicantsPage from "./components/ApplicantsPage";
import PendingScholarsPage from "./components/PendingScholarsPage";
import ActiveScholarsPage from "./components/ActiveScholarsPage";
import AlumniPage from "./components/AlumniPage";
import InactiveScholarsPage from "./components/InactiveScholarsPage";

const FolderDetails = () => {
  const { folderName } = useParams();
  return (
    <div>
      <p>{folderName}</p>
    </div>
  );
};

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);
  const [applicantCount, setApplicantCount] = useState(null);
  const [pending_scholarCount, setPendingScholarCount] = useState(null);
  const [active_scholarCount, setActiveScholarCount] = useState(null);
  const [inactive_scholarCount, setInactiveScholarCount] = useState(null);
  const [alumniCount, setAlumniCount] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/folders");
        const fetchedFolders = response.data;
        setFolders(fetchedFolders);
        setBatches(fetchedFolders);
      } catch (err) {
        console.error("Error fetching folder data:", err);
        setError("Unable to fetch folder data. Please try again later.");
      }
    };

    const fetchApplicantCount = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/applicants/count");
        setApplicantCount(response.data.applicant_count);
      } catch (err) {
        console.error("Error fetching applicant count:", err);
        setError("Unable to fetch applicant count. Please try again later.");
      }
    };

    const fetchPendingScholarCount = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/pending_scholars/count");
        setPendingScholarCount(response.data.pending_scholar_count);
      } catch (err) {
        console.error("Error fetching applicant count:", err);
        setError("Unable to fetch applicant count. Please try again later.");
      }
    };

    const fetchActiveScholarCount = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/active_scholars/count");
        setActiveScholarCount(response.data.active_scholar_count);
      } catch (err) {
        console.error("Error fetching applicant count:", err);
        setError("Unable to fetch applicant count. Please try again later.");
      }
    };

    const fetchInactiveScholarCount = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/inactive_scholars/count");
        setInactiveScholarCount(response.data.inactive_scholar_count);
      } catch (err) {
        console.error("Error fetching applicant count:", err);
        setError("Unable to fetch applicant count. Please try again later.");
      }
    };

    const fetchAlumniCount = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/alumni/count");
        setAlumniCount(response.data.alumni_count);
      } catch (err) {
        console.error("Error fetching applicant count:", err);
        setError("Unable to fetch applicant count. Please try again later.");
      }
    };

    fetchFolders();
    fetchApplicantCount();
    fetchPendingScholarCount();
    fetchActiveScholarCount();
    fetchInactiveScholarCount();
    fetchAlumniCount();
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <div className="file-manager-header">
            <h2>Status</h2>
            <SearchBar />
          </div>
          <div className="status-section">
            <StatusCard 
              title="Applicants" 
              count={applicantCount !== null ? applicantCount : 'Loading...'}
              directory="scholar" 
            />
            <StatusCard
              title="Pending-Scholars"
              count={pending_scholarCount !== null ? pending_scholarCount : 'Loading...'}
              directory="scholar"
            />
            <StatusCard
              title="Active-Scholars"
              count={active_scholarCount !== null ? active_scholarCount : 'Loading...'}
              directory="scholar"
            />
            <StatusCard
              title="Inactive-Scholars"
              count={inactive_scholarCount !== null ? inactive_scholarCount : 'Loading...'}
              directory="scholar"
            />
            <StatusCard 
              title="Alumni" 
              count={alumniCount !== null ? alumniCount : 'Loading...'} 
              directory="scholar" />
          </div>
          <h3>Batch</h3>
          <BatchFolders batches={batches} directory="folder" />
        </div>
      </div>
    </div>
  );
};

const FolderPage = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const { folderName } = useParams();

  useEffect(() => {
    if (folderName) {
      const fetchFolderData = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/folder/${folderName}`
          );
          setBatches(response.data);
        } catch (err) {
          console.error("Error fetching folder data:", err);
          setError("Unable to fetch folder data. Please try again later.");
        }
      };

      fetchFolderData();
    }
  }, [folderName]);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <div className="file-manager-header">
            <h2>Folder</h2>
            <SearchBar />
            <BackButton />
          </div>
          <h3>
            <FolderDetails />
          </h3>
          <BatchFolders
            batches={batches}
            directory="scholar"
            parentFolder={folderName}
          />
        </div>
      </div>
    </div>
  );
};

const ScholarshipsPage = () => {
  const [scholarshipData, setScholarshipData] = useState([]);
  const { folderName, subfolderName } = useParams();
  const fetchScholarshipData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/folder/${folderName}/${subfolderName}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setScholarshipData(data);
      console.log("Scholarship Data:", data);
    } catch (error) {
      console.error("Error fetching scholarship data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchScholarshipData();
  }, [folderName, subfolderName]);

  const scholars = scholarshipData.map((scholar) => ({
    applicant_id: scholar.applicant_id,
    applicant_profile: scholar.photo_path,
    contact_number: scholar.contact_number,
    last_name: scholar.last_name,
    first_name: scholar.first_name,
    middle_name: scholar.middle_name || "",
    suffix: scholar.suffix || "",
    year: scholar.applicant_id.slice(0, 4),
    address: `${scholar.street ? `${scholar.street}, ` : ""}${scholar.purok}, ${
      scholar.barangay
    }, ${scholar.municipality}`,
    school: scholar.school_name,
    status: "Active",
    remarks: "Verified",
  }));

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="content">
          <div className="file-manager-header">
            <h2>Scholars</h2>
            <SearchBar />
            <BackButton />
          </div>
          <h2>
            <FolderDetails />
          </h2>
          <ScholarsTable scholars={scholars} />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/folder/:folderName" element={<FolderPage />} />
        <Route path="/scholar/Applicants" element={<ApplicantsPage />} />
        <Route path="/scholar/Pending-Scholars" element={<PendingScholarsPage />} />
        <Route path="/scholar/Active-Scholars" element={<ActiveScholarsPage />} />
        <Route path="/scholar/Inactive-Scholars" element={<InactiveScholarsPage />} />
        <Route path="/scholar/Alumni" element={<AlumniPage />} />
        <Route
          path="/scholar/:folderName/:subfolderName"
          element={<ScholarshipsPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
