import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatusCard from "./components/StatusCard";
import BatchFolders from "./components/BatchFolders";
import SearchBar from "./components/SearchBar";
import "./App.css";

const App = () => {
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
            <StatusCard title="Active Scholars" count="1,025" />
            <StatusCard title="Inactive Scholars" count="348" />
            <StatusCard title="Alumni" count="9,547" />
          </div>
          <h3>Batch</h3>
          <BatchFolders batches={batches} />
        </div>
      </div>
    </div>
  );
};

export default App;
