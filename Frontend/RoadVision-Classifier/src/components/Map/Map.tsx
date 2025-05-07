import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "./map.css";
import dataService from "../../services/data.service";
import onButton from "../../assets/img/onButton.png";
import offButton from "../../assets/img/offButton.png";
import { message } from "antd";
import {
  MapPin,
  Flag,
  Repeat2,
  Search,
  Route,
  AlertCircle,
  Clock,
  Ruler,
  Sparkles,
} from "lucide-react";
declare module "leaflet" {
  namespace Control {
    class CustomGeocoder {
      static nominatim(): any;
      geocode(query: string, callback: (results: any[]) => void): void;
    }
  }
}

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [isBadRoutesVisible, setIsBadRoutesVisible] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [routeInfo, setRouteInfo] = useState<any[]>([]);
  const [startMarker, setStartMarker] = useState<L.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<L.Marker | null>(null);
  const [defaultRouting, setDefaultRouting] =
    useState<L.Routing.Control | null>(null);
  const [, setRouteSteps] = useState<any[][]>([]);
  const [selectedRouteIndex, ] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([10.762622, 106.660172], 14);
    leafletMap.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    navigator.geolocation?.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const currentLocation = L.latLng(latitude, longitude);
      map.setView(currentLocation, 14);
      const icon = L.divIcon({
        className: "current-location-icon",
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="pink"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="blue" /><circle cx="12" cy="12" r="4" fill="white" /></svg>`,
        iconSize: [35, 35],
        iconAnchor: [15, 30],
      });
      L.marker(currentLocation, { icon })
        .addTo(map)
        .bindPopup("Vị trí hiện tại của bạn")
        .openPopup();
    });

    (async () => {
      try {
        const roads = await dataService.getInfoRoads({ all: false });
        if (Array.isArray(roads)) {
          roads.forEach((roadStr: string) => {
            const road = JSON.parse(roadStr);
            const { latitude, longitude, filepath, level } = road;
            const levelColorMap: Record<string, string> = {
              Good: "green",
              Poor: "yellow",
              "Very poor": "red",
              Satisfactory: "blue",
            };

            const markerColor =
              levelColorMap[level as keyof typeof levelColorMap] || "gray";

            const customIcon = L.divIcon({
              className: "",
              html: `
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${markerColor}">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>
                `,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            });
            const fullImageUrl = `https://b9a3-42-116-6-46.ngrok-free.app/${filepath}`;
            L.marker([latitude, longitude], { icon: customIcon }).addTo(map)
              .bindPopup(`
                    <div>
                      <p><b>Road status:</b> ${level}</p>
                      <p><b>Lat:</b> ${latitude}</p>
                      <p><b>Long:</b> ${longitude}</p>
                      <img src="${fullImageUrl}" alt="Ảnh đường" style="width: 100px; height: auto;" />
                    </div>
                  `);
          });
        }
      } catch (err) {
        console.error("Lỗi khi lấy info roads:", err);
      }
    })();
  }, []);

  const toggleBadRoutes = async () => {
    if (!leafletMap.current) return;
    leafletMap.current.eachLayer((layer) => {
      if (
        (layer instanceof L.Polyline || layer instanceof L.Circle) &&
        (layer as any)._badRouteLayer
      ) {
        leafletMap.current?.removeLayer(layer);
      }
    });

    if (!isBadRoutesVisible) {
      try {
        const response = await dataService.getRouteMap();
        const rawGroups = response;

        if (!Array.isArray(rawGroups)) {
          console.error("Bad route API return invalid datas:", rawGroups);
          message.error("Data bad route is invalid");
          return;
        }

        const parsed = rawGroups.flat().map((p: string) => {
          const [lat, lng] = p.replace(/[()]/g, "").split(",").map(Number);
          return [lat, lng];
        });

        const clusters: [number, number][][] = [];
        const used = new Array(parsed.length).fill(false);
        const maxDist = 0.0004;
        const minClusterSize = 5;
        for (let i = 0; i < parsed.length; i++) {
          if (used[i]) continue;
          const group = [parsed[i]];
          used[i] = true;
          for (let j = 0; j < parsed.length; j++) {
            if (!used[j]) {
              const d = Math.hypot(
                parsed[i][0] - parsed[j][0],
                parsed[i][1] - parsed[j][1]
              );
              if (d < maxDist) {
                group.push(parsed[j]);
                used[j] = true;
              }
            }
          }
          clusters.push(group as [number, number][]);
        }
        clusters.forEach((group) => {
          if (group.length >= minClusterSize) {
            const lat = group.reduce((a, p) => a + p[0], 0) / group.length;
            const lng = group.reduce((a, p) => a + p[1], 0) / group.length;
            const circle = L.circle([lat, lng], {
              radius: 30,
              color: "red",
              fillColor: "red",
              fillOpacity: 0.3,
            }).addTo(leafletMap.current!);
            (circle as any)._badRouteLayer = true;
          } else {
            const poly = L.polyline(group, { color: "red", weight: 4 }).addTo(
              leafletMap.current!
            );
            (poly as any)._badRouteLayer = true;
            poly.bindPopup("Damage route").openPopup();
          }
        });
      } catch (err) {
        console.error("Error when call API bad routes:", err);
        message.error("Can not get data bad routes");
      }
    }
    setIsBadRoutesVisible(!isBadRoutesVisible);
  };

  const colors = ["blue", "orange", "purple", "brown"];

  const findRoute = async () => {
    const geocoder = (L.Control as any).Geocoder.nominatim();
    geocoder.geocode(startLocation, (startRes: any[]) => {
      if (!startRes.length) return;
      geocoder.geocode(endLocation, async (endRes: any[]) => {
        if (!endRes.length) return;
        const s = startRes[0].center;
        const e = endRes[0].center;
        startMarker?.remove();
        endMarker?.remove();
        const sm = L.marker([s.lat, s.lng])
          .addTo(leafletMap.current!)
          .bindPopup("Start");
        const em = L.marker([e.lat, e.lng])
          .addTo(leafletMap.current!)
          .bindPopup("End");
        setStartMarker(sm);
        setEndMarker(em);
        const res = await fetch(
          `http://192.168.120.135:5000/route/v1/driving/${s.lng},${s.lat};${e.lng},${e.lat}?alternatives=true&overview=full&steps=true&geometries=geojson`
        );
        const data = await res.json();
        const badRes = await dataService.getRouteMap();
        const badRaw = badRes;

        if (!Array.isArray(badRaw)) {
          console.error(
            "Bad route API return invalid datas:",
            badRaw
          );
          message.error("Data bad route is invalid");
          return;
        }

        const badGroups: [number, number][][] = badRaw.map((group: string[]) =>
          group.map(
            (pt: string) =>
              pt.replace(/[()]/g, "").split(",").map(Number) as [number, number]
          )
        );

        leafletMap.current?.eachLayer((l) => {
          if (l instanceof L.Polyline) leafletMap.current?.removeLayer(l);
        });
        if (defaultRouting) {
          defaultRouting.remove();
          setDefaultRouting(null);
        }
        const info: any[] = [];
        const stepsInfo: any[][] = [];
        data.routes.forEach((r: any, idx: number) => {
          const coords = r.geometry.coordinates.map(([lon, lat]: any) => [
            lat,
            lon,
          ]);
          const hit = new Array(badGroups.length).fill(false);
          for (let i = 1; i < coords.length; i++) {
            const mid = [
              (coords[i][0] + coords[i - 1][0]) / 2,
              (coords[i][1] + coords[i - 1][1]) / 2,
            ];
            badGroups.forEach((group: [any, any][], gIdx: number) => {
              if (!hit[gIdx]) {
                const near = group.some(
                  ([x, y]) => Math.hypot(x - mid[0], y - mid[1]) < 0.0003
                );
                if (near) hit[gIdx] = true;
              }
            });
          }
          const count = hit.filter(Boolean).length;
          const poly = L.polyline(coords, {
            color: colors[idx % colors.length],
            weight: selectedRouteIndex === idx + 1 ? 7 : 5, 
            opacity: selectedRouteIndex === idx + 1 ? 1 : 0.8, 
            dashArray: selectedRouteIndex === idx + 1 ? undefined : "5, 10", 
          })

            .bindPopup(
              `Route ${idx + 1}: ${count > 0 ? "Dangerously ⚠️" : "Safety ✅"}`
            )
            .addTo(leafletMap.current!);
          leafletMap.current!.fitBounds(poly.getBounds());
          info.push({
            index: idx + 1,
            distance: (r.distance / 1000).toFixed(2),
            time: (r.duration / 60).toFixed(0),
            dangerCount: count,
          });
          const steps = r.legs[0].steps.map(
            (step: any, stepIdx: number) =>
              `B${stepIdx + 1}: ${step.maneuver.instruction}`
          );
          stepsInfo.push(steps);
        });
        const sorted = info.sort(
          (a, b) =>
            a.dangerCount - b.dangerCount ||
            parseFloat(a.time) - parseFloat(b.time)
        );
        setRouteInfo(sorted);
        setRouteSteps(stepsInfo);
        const routingCtrl = L.Routing.control({
          waypoints: [L.latLng(s.lat, s.lng), L.latLng(e.lat, e.lng)],
          router: L.Routing.osrmv1({
            serviceUrl: "http://192.168.120.135:5000/route/v1",
          }),
          showAlternatives: false,
          routeWhileDragging: false,
          addWaypoints: false,
          show: true,
        }).addTo(leafletMap.current!);
        setDefaultRouting(routingCtrl);
      });
    });
  };

  return (
    <div className="container bg-gray-50">
      <div className="sidebar bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
          <Search size={24} /> Location Search
        </h2>

        <div className="flex items-center justify-between mb-6 p-3 border border-blue-100 rounded-lg shadow-sm bg-blue-50">
          <span className="text-sm font-medium text-blue-700">
            Show damaged roads
          </span>
          <img
            src={isBadRoutesVisible ? onButton : offButton}
            alt="Toggle Bad Routes"
            className="w-10 h-10 cursor-pointer"
            onClick={toggleBadRoutes}
          />
        </div>

        {/* Start Location */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Start location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="w-full py-3 px-4 pl-12 pr-12 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <MapPin
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500"
          />
          <button
            title="Swap"
            onClick={() => {
              const temp = startLocation;
              setStartLocation(endLocation);
              setEndLocation(temp);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <Repeat2 size={20} />
          </button>
        </div>

        {/* End Location */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="End location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="w-full py-3 px-4 pl-12 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <Flag
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          />
        </div>

        {/* Button */}
        <button
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition mb-6 shadow"
          onClick={findRoute}
        >
          <Route size={20} /> Find Route
        </button>

        {/* Route Info */}
        {routeInfo.length > 0 && (
          <div className="route-info p-5 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Route size={18} /> Route Information
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-blue-800 text-sm font-medium mb-1 flex items-center gap-1">
                <Sparkles size={16} />
                Best option is route {routeInfo[0].index}
              </p>
              <ul className="text-sm text-gray-700 list-disc list-inside pl-2">
                <li>Safety (fewer damaged segments)</li>
                <li>Shortest estimated time</li>
                <li>
                  Distance: <strong>{routeInfo[0].distance}</strong> km
                </li>
                <li>
                  Time: <strong>{routeInfo[0].time}</strong> min
                </li>
              </ul>
            </div>

            <ul className="roadItems space-y-4">
              {routeInfo.map((route, index) => (
                <li
                  key={index}
                  className="roadItem p-4 rounded-lg bg-white border border-gray-200 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Route {route.index}:{" "}
                    {route.dangerCount > 0 ? (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} /> Dangerous
                      </span>
                    ) : (
                      <span className="text-green-600">✅ Safe</span>
                    )}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Ruler size={14} /> {route.distance} km
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock size={14} /> {route.time} min
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <AlertCircle size={14} /> {route.dangerCount} damaged
                    segments
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        className="map"
        style={{ height: "100vh", width: "100%" }}
      ></div>
    </div>
  );
};

export default Map;
