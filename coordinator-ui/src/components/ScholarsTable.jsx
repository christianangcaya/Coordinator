import React from "react";
import "./ScholarsTable.css";

const ScholarsTable = ({ scholars }) => {
  return (
    <div className="scholars-table-container">
      <div className="scholars-table-wrapper">
        <table className="scholars-table">
          <thead>
            <tr>
              <th>Scholar's Name</th>
              <th>Year</th>
              <th>Address</th>
              <th>School</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {scholars.map((scholar, index) => (
              <tr key={index}>
                <td>{scholar.name}</td>
                <td>{scholar.year}</td>
                <td>{scholar.address}</td>
                <td>{scholar.school}</td>
                <td>{scholar.status}</td>
                <td>{scholar.remarks}</td>
                <td>
                  <button className="view-button">VIEW</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScholarsTable;
