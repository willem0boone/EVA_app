import React from "react";

const FORMATS = ["DD-MM-YY", "YYYY-MM-DD", "DD-MM-YYYY"];

export default function Settings({ config, setConfig }) {
  return (
    <>
      <h2>Settings</h2>
      <h3>Date format</h3>
      {FORMATS.map((fmt) => (
        <label key={fmt} style={{ display: "block", marginBottom: 6 }}>
          <input
            type="radio"
            name="dateFormat"
            value={fmt}
            checked={config.dateFormat === fmt}
            onChange={() => setConfig({ ...config, dateFormat: fmt })}
          />{" "}
          {fmt}
        </label>
      ))}
    </>
  );
}
