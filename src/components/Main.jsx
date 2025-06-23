import React, { useState } from "react";

export default function Main({ pyodide, config }) {
  const [formattedHour, setFormattedHour] = useState("");

  const showHour = () => {
    if (!pyodide) {
      setFormattedHour("Loading Python...");
      return;
    }
    try {
      const result = pyodide.globals.get("get_formatted_hour")(config.dateFormat);
      setFormattedHour(result);
    } catch (e) {
      setFormattedHour("Error getting time");
      console.error(e);
    }
  };

  return (
    <>
      <h2>Main</h2>
      <button onClick={showHour}>Show Current Hour</button>
      <p style={{ marginTop: 20 }}>
        {formattedHour ? (
          <>
            <b>Formatted time:</b> {formattedHour}
          </>
        ) : (
          "Press the button to show the time"
        )}
      </p>
    </>
  );
}
