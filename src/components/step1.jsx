import React from "react";

export default function Step1({ selectedFile, onFileChange }) {
  return (
    <>
      <label>Select CSV File:</label>
      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        style={{ display: "block", marginTop: "10px" }}
      />
      {selectedFile && <p>Selected: <strong>{selectedFile.name}</strong></p>}
    </>
  );
}
