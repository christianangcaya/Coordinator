import React from "react";
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




const FolderDetails = () => {
  const { folderName } = useParams(); 
  return (
    <div>
      <p>{folderName}</p>
    </div>
  );
};

const Home = () => {
  const batches = ["Batch '17", "Batch '18", "Batch '19", "Batch '20", "Batch '21", "Batch '22", "Batch '23", "Batch '14"]; 
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
  const batches = ["A-C", "D-F", "G-I", "J-L", "M-O", "P-R", "S-U", "V-X", "Y-Z"];
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

const ScholarshipsPage = () =>{
  const scholars = [
    {
      name: "Angcaya, Christian C.",
      year: 2022,
      address: "Brgy, Cobangbang Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Active",
      remarks: "Verified",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
    {
      name: "Abdula, Abner Javar.",
      year: 2022,
      address: "Brgy, Camambugan Daet, Camarines Norte",
      school: "CNSC - Main Campus",
      status: "Inactive",
      remarks: "Pending Documents",
    },
  ];


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
