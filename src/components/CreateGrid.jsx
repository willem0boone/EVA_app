import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as L from "leaflet";

function FitBoundsOnGeoJSON({ geoJsonData }) {
  const map = useMap();

  React.useEffect(() => {
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData);
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
    }
  }, [geoJsonData, map]);

  return null;
}

export default function Step4() {
  const featureGroupRef = useRef(null);
  const [polygonCount, setPolygonCount] = useState(0);
  const [mode, setMode] = useState("draw"); // 'upload' or 'draw'
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [error, setError] = useState("");

  const clearDrawnPolygons = () => {
    const layerGroup = featureGroupRef.current;
    if (layerGroup) {
      layerGroup.clearLayers();
    }
  };

  const _onCreated = (e) => {
    setPolygonCount((count) => count + 1);
    const layer = e.layer;
    console.log("Polygon drawn:", layer.toGeoJSON());
  };

  const _onDeleted = () => {
    const layers = featureGroupRef.current._layers;
    let remainingPolygons = 0;
    for (const key in layers) {
      if (layers[key].toGeoJSON().geometry.type === "Polygon") {
        remainingPolygons += 1;
      }
    }
    setPolygonCount(remainingPolygons);
    console.log("Polygons deleted, remaining:", remainingPolygons);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = [".json", ".geojson"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setError("Please upload a valid .geojson or .json file.");
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (
        json.type !== "FeatureCollection" ||
        !Array.isArray(json.features)
      ) {
        setError("Invalid GeoJSON: Must be a FeatureCollection with features.");
        return;
      }

      clearDrawnPolygons();
      setGeoJsonData(json);
      setPolygonCount(json.features.length);
      setError("");
    } catch (e) {
      console.error("Error parsing JSON:", e);
      setError("Error reading the file.");
    }
  };

  const handleModeChange = (newMode) => {
    if (newMode === "draw") {
      setGeoJsonData(null);
      clearDrawnPolygons();
    } else if (newMode === "upload") {
      clearDrawnPolygons();
    }

    setMode(newMode);
    setPolygonCount(0);
    setError("");
  };

  return (
    <div>
      {/* Mode Switch */}
      <div style={{ marginBottom: "1em" }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="draw"
            checked={mode === "draw"}
            onChange={() => handleModeChange("draw")}
          />
          Draw Polygon
        </label>
        {"  "}
        <label style={{ marginLeft: "1em" }}>
          <input
            type="radio"
            name="mode"
            value="upload"
            checked={mode === "upload"}
            onChange={() => handleModeChange("upload")}
          />
          Upload GeoJSON
        </label>
      </div>

      {/* Upload control */}
      {mode === "upload" && (
        <div style={{ marginBottom: "1em" }}>
          <input
            type="file"
            accept=".json,.geojson,application/geo+json"
            onChange={handleFileUpload}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      <MapContainer
        style={{ height: "500px", width: "100%" }}
        center={[20, 0]} // Global view
        zoom={2}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup ref={featureGroupRef}>
          {mode === "draw" && (
            <EditControl
              position="topright"
              onCreated={_onCreated}
              onDeleted={_onDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: polygonCount === 0,
              }}
              edit={{ edit: {}, remove: {} }}
            />
          )}
        </FeatureGroup>

        {/* Render uploaded geojson and zoom to it */}
        {mode === "upload" && geoJsonData && (
          <>
            <GeoJSON data={geoJsonData} />
            <FitBoundsOnGeoJSON geoJsonData={geoJsonData} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
