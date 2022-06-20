import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./App.css";

import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import { Dashboard, Leave, Register } from "./pages";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [pathname, setPathName] = useState(window.location.pathname);
  return (
    <div className="App">
      <div className="topbar shadow-2">
        <Button
          icon="pi pi-bars"
          className="p-button-rounded p-button-text"
          onClick={() => setShowSidebar(true)}
        />
      </div>
      <BrowserRouter>
        <Sidebar visible={showSidebar} onHide={() => setShowSidebar(false)}>
          <div style={{ marginTop: 30 }}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button
                className={`${
                  pathname.includes("dashboard") ? " p-button-secondary" : ""
                }`}
                onClick={() => {
                  setPathName("/dashboard");
                  setShowSidebar(false);
                }}
                icon="pi pi-chart-bar"
                iconPos="left"
                label="Dashboard"
                style={{ width: "90%", margin: 10 }}
              ></Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button
                className={`${
                  pathname.includes("register") ? "p-button-secondary" : ""
                }`}
                onClick={() => {
                  setPathName("/register");
                  setShowSidebar(false);
                }}
                icon="pi pi-chart-bar"
                iconPos="left"
                label="Register"
                style={{ width: "90%", margin: 10 }}
              ></Button>
            </Link>
            <Link to="/leave" style={{ textDecoration: "none" }}>
              <Button
                className={`${
                  pathname.includes("leave") ? "p-button-secondary" : ""
                }`}
                onClick={() => {
                  setPathName("/leave");
                  setShowSidebar(false);
                }}
                icon="pi pi-chart-bar"
                iconPos="left"
                label="Leave"
                style={{ width: "90%", margin: 10 }}
              ></Button>
            </Link>
          </div>
        </Sidebar>

        <Routes>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leave" element={<Leave />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
