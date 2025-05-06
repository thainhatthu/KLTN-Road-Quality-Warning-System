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
  const [searchLocation, setSearchLocation] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isBadRoutesVisible, setIsBadRoutesVisible] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [routeInfo, setRouteInfo] = useState<any[]>([]);
  const [startMarker, setStartMarker] = useState<L.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<L.Marker | null>(null);
  const api_url = "https://b9a3-42-116-6-46.ngrok-free.app";
  const [defaultRouting, setDefaultRouting] =
    useState<L.Routing.Control | null>(null);
  const [routeSteps, setRouteSteps] = useState<any[][]>([]);

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

  const searchForLocation = (location: string) => {
    const geocoder = (L.Control as any).Geocoder.nominatim();
    geocoder.geocode(location, (results: any[]) => {
      if (results.length > 0) {
        const { center } = results[0];
        leafletMap.current?.setView(center, 14);
        L.marker(center)
          .addTo(leafletMap.current!)
          .bindPopup(location)
          .openPopup();
      } else message.error("Can't find location");
    });
  };

  const fetchSuggestions = (query: string) => {
    if (!query) return setSuggestions([]);
    const geocoder = (L.Control as any).Geocoder.nominatim();
    geocoder.geocode(query, (results: any[]) => setSuggestions(results));
  };

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
          console.error(
            "Bad route API return invalid datas:",
            rawGroups
          );
          message.error("Dữ liệu đoạn đường hư hỏng không hợp lệ");
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
        console.error("Lỗi khi gọi API bad routes:", err);
        message.error("Không thể tải dữ liệu đoạn hư hỏng");
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
            "Bad route API trả về dữ liệu không phải mảng:",
            badRaw
          );
          message.error("Dữ liệu đoạn đường hư hỏng không hợp lệ");
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
            weight: 5,
            opacity: 0.8,
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
    <div className="container">
      <div className="sidebar">
        <h2>Tìm kiếm địa điểm</h2>
        <div className="flex flex-row items-center gap-2">
          <p>Bad Routes</p>
          <img
            src={isBadRoutesVisible ? onButton : offButton}
            alt="Toggle Bad Routes"
            className="w-10 h-10 cursor-pointer"
            onClick={toggleBadRoutes}
          />
        </div>
        <input
          type="text"
          value={searchLocation}
          onChange={(e) => {
            setSearchLocation(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          placeholder="Enter location..."
        />
        <ul>
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              onClick={() => {
                setSearchLocation(sug.name);
                setSuggestions([]);
                searchForLocation(sug.name);
              }}
            >
              {sug.name}
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Start"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="End"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <button onClick={findRoute}>Find route</button>
        {routeInfo.length > 0 && (
          <div className="route-info">
            <h3>Routes information</h3>
            <ul>
              {routeInfo.map((route, index) => (
                <li key={index}>
                  <p>
                    <strong>
                      Route {route.index}:{" "}
                      {route.dangerCount > 0 ? (
                        <span style={{ color: "red" }}>Dangerously ⚠️</span>
                      ) : (
                        <span style={{ color: "green" }}>Safety ✅</span>
                      )}
                    </strong>
                  </p>
                  <p>Distance: {route.distance} km</p>
                  <p>Expected time: {route.time} min</p>
                  <p>Number of damage routes: {route.dangerCount}</p>
                </li>
              ))}
            </ul>
            <p>
              ✅ Suggestion: Prioritize the route {routeInfo[0].index} (
              {routeInfo[0].dangerCount > 0 ? "dangerously" : "safety"},{" "}
              {routeInfo[0].distance} km, {routeInfo[0].time} phút)
            </p>
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
