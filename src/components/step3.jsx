import React from "react";

export default function Step3Plus({ formattedHour, onShowHour }) {
  return (
    <>
      <button onClick={onShowHour}>Show Current Hour</button>
      {formattedHour && (
        <p style={{ marginTop: 12 }}>
          <b>Formatted time:</b> {formattedHour}
        </p>
      )}
    </>
  );
}
