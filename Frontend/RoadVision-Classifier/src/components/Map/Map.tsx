import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "./map.css";
import dataService from "../../services/data.service";
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
import "leaflet.heat";
import onButton from "../../assets/img/onButton.png";
import offButton from "../../assets/img/offButton.png";

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
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [routeInfo, setRouteInfo] = useState<any[]>([]);
  const [startMarker, setStartMarker] = useState<L.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<L.Marker | null>(null);
  const [defaultRouting, setDefaultRouting] =
    useState<L.Routing.Control | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [showBadZone, setShowBadZone] = useState(false);
  const badZoneGroupRef = useRef<L.LayerGroup | null>(null);

  // Bad zone layer
  const toggleBadZones = async () => {
    const map = leafletMap.current;
    if (!map) return;

    if (showBadZone) {
      badZoneGroupRef.current?.clearLayers();
      map.removeLayer(badZoneGroupRef.current!);
      setShowBadZone(false);
      return;
    }

    try {
      const response = await dataService.getRouteMap();
      const rawGroups = response;

      if (!Array.isArray(rawGroups)) {
        console.error("Invalid data from getRouteMap");
        return;
      }

      const parsedPoints = rawGroups.flat().map((p: string) => {
        const [lat, lng] = p.replace(/[()]/g, "").split(",").map(Number);
        return [lat, lng] as [number, number];
      });

      const clusters: [number, number][][] = [];
      const used = new Array(parsedPoints.length).fill(false);
      const maxDist = 0.0004;
      const minClusterSize = 3;

      for (let i = 0; i < parsedPoints.length; i++) {
        if (used[i]) continue;
        const group = [parsedPoints[i]];
        used[i] = true;

        for (let j = 0; j < parsedPoints.length; j++) {
          if (!used[j]) {
            const d = Math.hypot(
              parsedPoints[i][0] - parsedPoints[j][0],
              parsedPoints[i][1] - parsedPoints[j][1]
            );
            if (d < maxDist) {
              group.push(parsedPoints[j]);
              used[j] = true;
            }
          }
        }
        clusters.push(group);
      }

      const groupLayer = L.layerGroup();

      clusters.forEach((group) => {
        group.forEach(([lat, lng]) => {
          const marker = L.circleMarker([lat, lng], {
            radius: 12,
            color: "#EB5A3C",
            fillColor: "#FF2929",
            fillOpacity: 0.5,
            weight: 1,
          }).bindPopup("⚠️ Bad zone");

          groupLayer.addLayer(marker);
        });

        const centerLat =
          group.reduce((sum, p) => sum + p[0], 0) / group.length;
        const centerLng =
          group.reduce((sum, p) => sum + p[1], 0) / group.length;
        const center = [centerLat, centerLng] as [number, number];

        groupLayer.addLayer(
          L.circle(center, {
            radius: 40,
            color: "#FF4545",
            fillColor: "#FF4545",
            fillOpacity: 0.4,
            weight: 0,
          })
        );
        groupLayer.addLayer(
          L.circle(center, {
            radius: 70,
            color: "#F8EDE3",
            fillColor: "#F8EDE3",
            fillOpacity: 0.25,
            weight: 0,
          })
        );
        if (group.length >= minClusterSize) {
          const avgLat = group.reduce((sum, p) => sum + p[0], 0) / group.length;
          const avgLng = group.reduce((sum, p) => sum + p[1], 0) / group.length;
          const zone = L.circle([avgLat, avgLng], {
            radius: 60,
            color: "#9333ea",
            fillColor: "#e9d5ff",
            fillOpacity: 0.25,
            weight: 1,
          }).bindPopup(`⚠️ Bad zone (${group.length} points)`);

          groupLayer.addLayer(zone);
        }
      });

      groupLayer.addTo(map);
      badZoneGroupRef.current = groupLayer;
      setShowBadZone(true);
    } catch (err) {
      console.error("Error fetching bad zone data", err);
    }
  };
  // Initialize map
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
        .bindPopup("Current Location")
        .openPopup();
    });

    const markerGroup = L.layerGroup();
    const zoneGroup = L.layerGroup();

    (async () => {
      const roads = await dataService.getInfoRoads({ all: false });
      if (Array.isArray(roads)) {
        roads.forEach((roadStr: string) => {
          const road = JSON.parse(roadStr);
          const { latitude, longitude, filepath, level } = road;

          const levelColorMap: Record<string, string> = {
            Good: "green",
            Poor: "orange",
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

          const fullImageUrl = `https://b151-42-116-6-46.ngrok-free.app/${filepath}`;

          const marker = L.marker([latitude, longitude], { icon: customIcon })
            .bindPopup(`
          <div>
            <p><b>Road status:</b> ${level}</p>
            <p><b>Lat:</b> ${latitude}</p>
            <p><b>Long:</b> ${longitude}</p>
            <img src="${fullImageUrl}" alt="Ảnh đường" style="width: 100px; height: auto;" />
          </div>
        `);
          markerGroup.addLayer(marker);

          const zone = L.circle([latitude, longitude], {
            radius: 80,
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.25,
            weight: 1,
          }).bindPopup(`<b>Road status:</b> ${level}`);
          zoneGroup.addLayer(zone);
        });
      }
      const zoom = map.getZoom();
      if (zoom >= 15) map.addLayer(markerGroup);
      else map.addLayer(zoneGroup);
      map.on("zoomend", () => {
        const z = map.getZoom();
        if (z >= 15) {
          map.removeLayer(zoneGroup);
          map.addLayer(markerGroup);
        } else {
          map.removeLayer(markerGroup);
          map.addLayer(zoneGroup);
        }
      });
    })();
  }, []);

  // Fetch suggestions for search query
  const fetchSuggestions = (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const geocoder = (L.Control as any).Geocoder.nominatim({
      geocodingQueryParams: {
        countrycodes: "VN",
        bounded: 1,
        viewbox: "102.14441,23.39339,109.4642,8.3816",
      },
    });

    geocoder.geocode(query, (results: any[]) => {
      setSuggestions(results);
    });
  };
  // Handle suggestion selection
  const handleSelectSuggestion = (result: any) => {
    setSearchQuery(result.name);
    setSuggestions([]);
    if (leafletMap.current) {
      leafletMap.current.setView(result.center, 16);
      const customIcon = L.divIcon({
        className: "",
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="blue">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="blue" />
              </svg>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker(result.center, { icon: customIcon })
        .addTo(leafletMap.current)
        .bindPopup(result.name)
        .openPopup();
    }
  };

  const getDamagePoints = async (): Promise<
    { lat: number; lng: number; weight: number }[]
  > => {
    const roads = await dataService.getInfoRoads({ all: false });
    return Array.isArray(roads)
      ? roads.map((roadStr: string) => {
          const road = JSON.parse(roadStr);
          return {
            lat: road.latitude,
            lng: road.longitude,
            weight: Number(road.weight) || 1,
          };
        })
      : [];
  };
  // Calculate weight for a route based on damage points
  const calculateWeightForRoute = (
    coords: [number, number][],
    damagePoints: { lat: number; lng: number; weight: number }[],
    map: L.Map
  ): number => {
    let totalWeight = 0;
    const counted = new Set<number>();

    damagePoints.forEach((d, i) => {
      for (let j = 0; j < coords.length - 1; j++) {
        const [aLat, aLng] = coords[j];
        const [bLat, bLng] = coords[j + 1];
        const ax = bLat - aLat,
          ay = bLng - aLng;
        const bx = d.lat - aLat,
          by = d.lng - aLng;
        const t = (ax * bx + ay * by) / (ax * ax + ay * ay);

        if (t >= 0 && t <= 1) {
          const projLat = aLat + t * ax;
          const projLng = aLng + t * ay;
          const dist = Math.hypot(projLat - d.lat, projLng - d.lng);
          if (dist < 0.00005 && !counted.has(i)) {
            totalWeight += d.weight;
            counted.add(i);

            L.circleMarker([d.lat, d.lng], {
              radius: 10,
              color: "red",
              fillColor: "#f03",
              fillOpacity: 0.7,
            })
              .addTo(map)
              .bindPopup(`✅ Counted (weight=${d.weight})`);
            break;
          }
        }
      }
    });

    return totalWeight;
  };

  const drawRoutePolyline = (
    coords: [number, number][],
    weight: number,
    idx: number,
    map: L.Map
  ) => {
    const polyColor =
      weight === 0 ? "green" : idx % 2 === 0 ? "#facc15" : "#facc15";

    return L.polyline(coords, {
      color: polyColor,
      weight: 5,
      opacity: 0.9,
    })
      .bindPopup(
        `Route ${idx + 1}: ${
          weight > 0 ? "Danger ⚠️" : "Safe ✅"
        }\nWeight = ${weight}`
      )
      .addTo(map);
  };

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
        const startIcon = L.divIcon({
          html: `
          <div style="position: relative; width: 30px; height: 42px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="30" height="42">
              <path d="M16 0C7 0 0 7.5 0 16.5S16 42 16 42s16-17.5 16-25.5S25 0 16 0z" fill="#AF3E3E" stroke="white" stroke-width="2"/>
              <text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-family="Arial" dy=".3em" font-weight="bold">A</text>
            </svg>
          </div>
        `,
          className: "",
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        });

        const endIcon = L.divIcon({
          html: `
            <div style="position: relative; width: 30px; height: 42px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="30" height="42">
                <path d="M16 0C7 0 0 7.5 0 16.5S16 42 16 42s16-17.5 16-25.5S25 0 16 0z" fill="#FE5D26" stroke="white" stroke-width="2"/>
                <text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-family="Arial" dy=".3em" font-weight="bold">B</text>
              </svg>
            </div>
          `,
          className: "",
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        });

        const newStartMarker = L.marker([s.lat, s.lng], { icon: startIcon })
          .addTo(leafletMap.current!)
          .bindPopup("Start");

        const newEndMarker = L.marker([e.lat, e.lng], { icon: endIcon })
          .addTo(leafletMap.current!)
          .bindPopup("End");

        setStartMarker(newStartMarker);
        setEndMarker(newEndMarker);
        const res = await fetch(
          `https://b151-42-116-6-46.ngrok-free.app/osrm/route/v1/driving/${s.lng},${s.lat};${e.lng},${e.lat}?alternatives=true&overview=full&steps=true&geometries=geojson`
        );
        const data = await res.json();

        const damagePoints = await getDamagePoints();

        leafletMap.current?.eachLayer((l) => {
          if (l instanceof L.Polyline) leafletMap.current?.removeLayer(l);
        });
        if (defaultRouting) {
          defaultRouting.remove();
          setDefaultRouting(null);
        }

        const info: any[] = [];

        data.routes.forEach((r: any, idx: number) => {
          const coords = r.geometry.coordinates.map(([lon, lat]: any) => [
            lat,
            lon,
          ]);
          const weight = calculateWeightForRoute(
            coords,
            damagePoints,
            leafletMap.current!
          );
          drawRoutePolyline(coords, weight, idx, leafletMap.current!);

          info.push({
            index: idx + 1,
            coords,
            distance: (r.distance / 1000).toFixed(2),
            time: (r.duration / 60).toFixed(0),
            dangerWeight: weight,
          });
        });

        const sorted = info.sort(
          (a, b) =>
            a.dangerWeight - b.dangerWeight ||
            parseFloat(a.time) - parseFloat(b.time)
        );
        setRouteInfo(sorted);

        const routingCtrl = L.Routing.control({
          waypoints: [L.latLng(s.lat, s.lng), L.latLng(e.lat, e.lng)],
          router: L.Routing.osrmv1({
            serviceUrl: "https://b151-42-116-6-46.ngrok-free.app/osrm/route/v1",
          }),
          showAlternatives: false,
          routeWhileDragging: false,
          addWaypoints: false,
          show: true,

          createMarker: () => null,
        } as any).addTo(leafletMap.current!);

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
            Show damaged zone
          </span>
          <img
            src={showBadZone ? onButton : offButton}
            alt="Toggle Bad Zones"
            className="w-10 h-10 cursor-pointer"
            onClick={toggleBadZones}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search a location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm"
          />
          <ul className="bg-white border border-gray-200 mt-1 rounded shadow-sm max-h-40 overflow-y-auto">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(sug)}
              >
                {sug.name}
              </li>
            ))}
          </ul>
        </div>
        {/* Start Location */}
        <div className="relative">
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
        <div className="relative mb-3">
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

        {routeInfo.length > 0 && (
          <div className="route-info p-5 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Route size={18} /> Route Information
            </h3>

            {routeInfo.length > 1 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-blue-800 text-sm font-medium mb-1 flex items-center gap-1">
                  <Sparkles size={16} />
                  Best option is route {routeInfo[0].index}
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside pl-2">
                  <li>Have fewer damaged segments</li>
                  <li>Shortest estimated time</li>
                  <li>
                    Distance: <strong>{routeInfo[0].distance}</strong> km
                  </li>
                  <li>
                    Time: <strong>{routeInfo[0].time}</strong> min
                  </li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 text-sm mb-4 italic">
                🛣 Only one route is available for this trip.
              </p>
            )}

            <ul className="space-y-3">
              {routeInfo.map((route) => (
                <li
                  key={route.index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-800 font-medium text-sm">
                      Route {route.index}
                    </span>
                    {route.dangerWeight > 0 ? (
                      <span className="text-red-600 flex items-center gap-1 text-sm">
                        <AlertCircle size={14} /> Dangerous
                      </span>
                    ) : (
                      <span className="text-green-600 text-sm">✅ Safe</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex items-center gap-2">
                      <Ruler size={14} /> {route.distance} km
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> {route.time} min
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} /> Danger Weight:{" "}
                      {route.dangerWeight}
                    </div>
                  </div>
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
