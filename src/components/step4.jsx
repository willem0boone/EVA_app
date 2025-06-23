import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function Step4() {
  const featureGroupRef = useRef(null);
  const [polygonCount, setPolygonCount] = useState(0);

  const _onCreated = (e) => {
    setPolygonCount((count) => count + 1);
    const layer = e.layer;
    console.log("Polygon drawn:", layer.toGeoJSON());
  };

  const _onDeleted = (e) => {
    // Count how many polygons remain in featureGroup after deletion
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

  return (
    <div>
      <MapContainer
        style={{ height: "500px", width: "100%" }}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup ref={featureGroupRef}>
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
              polygon: polygonCount === 0, // allow draw only if no polygon
            }}
            edit={{
               edit: {},
               remove: {} 
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
