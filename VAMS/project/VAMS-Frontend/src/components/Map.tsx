import { useState, useEffect } from "react";
import { MapContainer, Popup, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Earthquake, Volcano } from "@/utils/interfaces";
import marker1 from "@/assets/24hoursMarker.png";
import marker2 from "@/assets/7daysMarker.png";
import marker3 from "@/assets/30daysMarker.png";

interface CustomMarkerProps {
  position: L.LatLngExpression;
  iconUrl: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface MapProps {
  earthquakes: Earthquake[];
  currVolcano?: Volcano;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  iconUrl,
  children,
  onClick,
}) => {
  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
  return (
    <Marker
      position={position}
      icon={customIcon as any}
      eventHandlers={{ click: onClick }}
    >
      {children}
    </Marker>
  );
};

const getIconUrl = (timestamp: string) => {
  const now = new Date();
  const earthquakeDate = new Date(timestamp);
  const diffTime = Math.abs(now.getTime() - earthquakeDate.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    return marker1;
  } else if (diffDays < 7) {
    return marker2;
  } else {
    return marker3;
  }
};

const MapUpdater: React.FC<{ currVolcano?: Volcano }> = ({ currVolcano }) => {
  const map = useMap();

  useEffect(() => {
    if (currVolcano) {
      const { latitude, longitude } = currVolcano;
      map.setView([latitude, longitude], map.getZoom());
      console.log("Updated map center to:", latitude, longitude);
    }
  }, [currVolcano, map]);

  return null;
};

const MapWithLegend = () => {
  const map = useMap();
  const legend = new L.Control({ position: "topright" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "info legend w-[6rem] h-[6rem] border border-black overflow-hidden rounded-lg bg-white text-center flex flex-col justify-center items-start pl-2 gap-1",);
    const labels = [
        '<div class="flex items-center"><img src="' + marker1 + '" width="15" height="15" class="mr-2"> < 24 hours</div>',
        '<div class="flex items-center"><img src="' + marker2 + '" width="15" height="15" class="mr-2"> < 7 days</div>',
        '<div class="flex items-center"><img src="' + marker3 + '" width="15" height="15" class="mr-2"> > 7 days</div>'
    ];
    div.innerHTML = labels.join("<br>");
    return div;
  };

  useEffect(() => {
    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

const Map: React.FC<MapProps> = ({ earthquakes, currVolcano }) => {
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const volcanoCoordinates: [number, number] = [
    currVolcano?.latitude ?? 0,
    currVolcano?.longitude ?? 0,
  ];
  return (
    <div className="border-black border h-[35rem] w-[70rem] mx-auto my-10 rounded-lg overflow-hidden">
      <MapContainer
        center={volcanoCoordinates}
        zoom={11.5}
        scrollWheelZoom={false}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater currVolcano={currVolcano} />
        <MapWithLegend />

        {earthquakes.map((earthquake) => (
          <CustomMarker
            key={earthquake.timestamp}
            position={[earthquake.latitude, earthquake.longitude]}
            iconUrl={getIconUrl(earthquake.timestamp)}
            onClick={() => setSelectedEarthquake(earthquake)}
          >
            <Popup>
              <div>
                <p>
                  <strong>Location:</strong> {earthquake.location}
                </p>
                <p>
                  <strong>Magnitude:</strong> {earthquake.magnitude.toFixed(1)}
                </p>
                <p>
                  <strong>Depth:</strong> {earthquake.depth} kilometers
                </p>
                <p>
                  <strong>Source:</strong> {earthquake.source}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(earthquake.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </CustomMarker>
        ))}

        {selectedEarthquake && (
          <CustomMarker
            position={[
              selectedEarthquake.latitude,
              selectedEarthquake.longitude,
            ]}
            iconUrl={getIconUrl(selectedEarthquake.timestamp)}
          >
            <Popup>
              <div>
                <p>
                  <strong>Location:</strong> {selectedEarthquake.location}
                </p>
                <p>
                  <strong>Magnitude:</strong> {selectedEarthquake.magnitude}
                </p>
                <p>
                  <strong>Depth:</strong> {selectedEarthquake.depth} meters
                </p>
                <p>
                  <strong>Source:</strong> {selectedEarthquake.source}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(selectedEarthquake.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </CustomMarker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
