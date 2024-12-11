import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/lgu-logo.png";

const Login = () => {
  const navigate = useNavigate();

  const defaultUsername = "1";
  const defaultPassword = "1";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === defaultUsername && password === defaultPassword) {
      navigate("/home"); // Redirect to the next page
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <h1>Scholarship Filing Management System</h1>
        <h2>LOCAL GOVERNMENT UNIT - DAET</h2>
      </div>
      <div className="login-right">
        <div className="square-container">
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a className="forgot-password">Forgot your password?</a>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-button">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
