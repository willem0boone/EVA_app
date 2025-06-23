import React, { useState, useEffect } from "react";
import Step1 from "./Step1.jsx";
import Step2 from "./Step2.jsx";
import Step3 from "./Step3.jsx";
import Step4 from "./Step4.jsx";

export default function Main({ pyodide, config }) {
  const [step, setStep] = useState(1);
  const [formattedHour, setFormattedHour] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);

  const totalSteps = 5;
  const percent = Math.round((step / totalSteps) * 100);

  // Handle CSV file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid CSV file.");
    }
  };

  // Show formatted hour from Python function
  const showHour = () => {
    if (!pyodide) return;
    try {
      const getFormattedHour = pyodide.globals.get("get_formatted_hour");
      if (getFormattedHour) {
        const result = getFormattedHour(config.dateFormat);
        setFormattedHour(result);
      } else {
        console.error("get_formatted_hour function not found in Python globals");
      }
    } catch (e) {
      console.error("Error calling get_formatted_hour:", e);
    }
  };

  // Load the Python code and call get_map() to get GeoJSON data
const loadMapData = async () => {
  if (!pyodide) return;

  try {
    // Fetch and run the Python script
    const response = await fetch("/map_data.py");
    const pythonCode = await response.text();
    pyodide.runPython(pythonCode);

    // Get the Python function
    const getMapFunc = pyodide.globals.get("get_map");
    if (!getMapFunc) {
      throw new Error("Python function get_map not found");
    }

    // Call Python function to get GeoJSON as a JSON string
    const pyResult = getMapFunc();

    // Debug: see what we got from Python
    console.log("Raw Python output:", pyResult);

    // Parse the JSON string into JS object
    const jsGeoJSON = JSON.parse(pyResult);
    

    // Save to state for React Leaflet
    setGeojsonData(jsGeoJSON);
  } catch (e) {
    console.error("Error loading map data from Python:", e);
  }
};
  // Load map data when step 2 is active
  useEffect(() => {
    if (step === 2) {
      loadMapData();
    }
  }, [step]);

  // Navigation handlers
  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // Progress bar color by step
  const getProgressColor = () => {
    const colors = ["#d9534f", "#f0ad4e", "#5bc0de", "#5cb85c", "#428bca"];
    return colors[step - 1] || "#428bca";
  };

  return (
    <div>
      {/* Progress Bar */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            height: "20px",
            width: "100%",
            backgroundColor: "#eee",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              backgroundColor: getProgressColor(),
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ textAlign: "right", marginTop: 5 }}>{percent}% complete</div>
      </div>

      {/* Step Heading */}
      <h2>Step {step}</h2>

      {/* Step Content */}
      {step === 1 && (
        <Step1 selectedFile={selectedFile} onFileChange={handleFileChange} />
      )}
      {step === 2 && (
        <>
          {geojsonData ? (
            <Step2 geojsonData={geojsonData} />
          ) : (
            <p>Loading map data...</p>
          )}
        </>
      )}
      {step === 3 && (
        <Step3 formattedHour={formattedHour} onShowHour={showHour} />
      )}
      {step === 4 && <Step4 />}

      {/* Navigation Buttons */}
      <div style={{ marginTop: 40 }}>
        <button
          onClick={handlePrev}
          disabled={step === 1}
          style={{ marginRight: 10 }}
        >
          Previous
        </button>
        <button onClick={handleNext} disabled={step === totalSteps}>
          Next
        </button>
      </div>
    </div>
  );
}
