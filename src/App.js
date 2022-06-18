import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./App.css";

import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Register } from "./pages";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="App">
      <div className="topbar shadow-2">
        <Button
          icon="pi pi-bars"
          className="p-button-rounded p-button-text"
          onClick={() => setShowSidebar(true)}
        />
      </div>
      <Sidebar visible={showSidebar} onHide={() => setShowSidebar(false)}>
        <h3>Left Sidebar</h3>
      </Sidebar>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={<Dashboard/>}
          />
          <Route
            path="/Register"
            element={<Register/>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
