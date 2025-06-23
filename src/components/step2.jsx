import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

export default function Step2({ geojsonData }) {
  return (
    <div style={{ height: "500px" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojsonData && <GeoJSON data={geojsonData} />}
      </MapContainer>
    </div>
  );
}
