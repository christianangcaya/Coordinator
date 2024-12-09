import React from "react";
import "./Header.css";
import logo from "../assets/lgu-logo.png"

const Header = () => {
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
        <button className="logout-button">LOG OUT</button>
      </div>
    </header>
  );
};

export default Header;
