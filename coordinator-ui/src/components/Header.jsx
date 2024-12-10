import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/lgu-logo.png";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Logged Out",
          "You have been successfully logged out.",
          "success"
        ).then(() => {
          navigate("/"); 
        });
      }
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <div>
            <h1>E-Scholarship Application System</h1>
            <p>LOCAL GOVERNMENT UNIT - DAET</p>
          </div>
        </div>
        <div className="container-btn">
          <button className="logout-button" onClick={handleLogout}>
            LOG OUT
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
