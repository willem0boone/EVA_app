import React, { useState, useEffect } from "react";
import Settings from "./components/Settings.jsx";
import Main from "./components/Main.jsx";
import Summary from "./components/Summary.jsx";
import CreateGrid from "./components/CreateGrid.jsx"; // Make sure this exists

export default function App() {
  const [page, setPage] = useState("main");
  const [config, setConfig] = useState(null);
  const [pyodide, setPyodide] = useState(null);
  const [pyCode, setPyCode] = useState(null);

  // Load config from JSON on app start
  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then(setConfig)
      .catch(() => setConfig({ dateFormat: "YYYY-MM-DD" }));
  }, []);

  // Load pyodide
  useEffect(() => {
    if (!window.loadPyodide) {
      console.error("Pyodide is not loaded on window");
      return;
    }
    window.loadPyodide()
      .then(setPyodide)
      .catch((e) => console.error("Failed to load Pyodide:", e));
  }, []);

  // Load python code file once pyodide is ready
  useEffect(() => {
    if (!pyodide) return;
    fetch("/format_date.py")
      .then((res) => res.text())
      .then(setPyCode)
      .catch((e) => console.error("Failed to load Python file:", e));
  }, [pyodide]);

  // Run python code when loaded
  useEffect(() => {
    if (pyodide && pyCode) {
      try {
        pyodide.runPython(pyCode);
      } catch (e) {
        console.error("Python code execution error:", e);
      }
    }
  }, [pyodide, pyCode]);

  // Save config changes to localStorage for persistence
  useEffect(() => {
    if (config) {
      localStorage.setItem("ecotool-config", JSON.stringify(config));
    }
  }, [config]);

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  const pages = [
    { key: "settings", label: "Settings" },
    { key: "create-grid", label: "Create Grid" },
    { key: "main", label: "Main" },
    { key: "summary", label: "Summary" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: 180,
          borderRight: "1px solid #ccc",
          padding: 20,
          boxSizing: "border-box",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>Menu</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pages.map(({ key, label }) => (
            <li key={key} style={{ marginBottom: 6 }}>
              <button
                onClick={() => setPage(key)}
                style={{
                  background: page === key ? "#ddd" : "transparent",
                  border: "none",
                  padding: "8px 12px",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
                aria-current={page === key ? "page" : undefined}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area */}
      <main style={{ flexGrow: 1, padding: 20, overflowY: "auto" }}>
        {page === "settings" && <Settings config={config} setConfig={setConfig} />}
        {page === "create-grid" && <CreateGrid config={config} />}
        {page === "main" && <Main pyodide={pyodide} config={config} />}
        {page === "summary" && <Summary />}
      </main>
    </div>
  );
}
