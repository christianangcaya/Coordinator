import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatusCard from "./components/StatusCard";
import BatchFolders from "./components/BatchFolders";
import SearchBar from "./components/SearchBar";
import { useParams } from "react-router-dom";
import BackButton from "./components/BackButton"
import ScholarsTable from "./components/ScholarsTable";
import Login from "./components/Login";
import "./App.css";
import axios from "axios";


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

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/folders");
        const fetchedFolders = response.data;
        setFolders(fetchedFolders)

        setBatches(fetchedFolders);
      } catch (err) {
        console.error("Error fetching folder data:", err);
        setError("Unable to fetch folder data. Please try again later.");
      }
    };

    fetchFolders();
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
          <StatusCard title="Appplicants" count="1,000" directory="scholar"/>
          <StatusCard title="Pending Scholars" count="125" directory="scholar"/>
            <StatusCard title="Active Scholars" count="1,025" directory="scholar"/>
            <StatusCard title="Inactive Scholars" count="348" directory="scholar"/>
            <StatusCard title="Alumni" count="9,547" directory="scholar"/>
          </div>
          <h3>Batch</h3>
          <BatchFolders batches={batches} directory="folder"/>
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
          const response = await axios.get(`http://127.0.0.1:5000/api/folder/${folderName}`);
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
            <BackButton/>
          </div>
          <h3><FolderDetails /></h3>
          <BatchFolders batches={batches} directory="scholar" />
        </div>
      </div>
    </div>
  );
};

const ScholarshipsPage = () => {
  const [scholarshipData, setScholarshipData] = useState([]);

  const fetchScholarshipData = async () => {
    try {
      const folderName = "2024"; 
      const subfolderName = "A-C";

      const response = await fetch(`http://127.0.0.1:5000/api/folder/${folderName}/${subfolderName}`);
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
  }, []);

  const scholars = scholarshipData.map((scholar) => ({
    name: `${scholar.last_name}, ${scholar.first_name} ${scholar.middle_name} ${scholar.suffix || ""}`.trim(),
    year: scholar.applicant_id.slice(0, 4),
    address: `${scholar.street}, ${scholar.purok}, ${scholar.barangay}, ${scholar.municipality}`,
    school: scholar.school_name,
    status: "Active",
    remarks: "Verified",
  }));



  return(
    <div className="app">
    <Header />
    <div className="main-content">
      <div className="content">
        <div className="file-manager-header">
          <h2>Scholars</h2>
          <SearchBar />
          <BackButton />
        </div>
        <h2><FolderDetails/></h2>
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
          <Route path="/" element={<Login />}/>
          <Route path="/home" element={<Home />} />
          <Route path="/folder/:folderName" element={<FolderPage />} />
          <Route path="/scholar/:folderName" element={<ScholarshipsPage />} />
        </Routes>
      </Router>
  );
};

export default App;
