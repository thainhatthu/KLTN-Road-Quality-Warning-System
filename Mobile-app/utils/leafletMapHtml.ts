export const getLeafletHtml = () => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.min.js"></script>
    <script>
      window.API_BASE = "";
      var map = L.map('map').setView([10.7769, 106.7009], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

      var marker = null;
      var currentRouteControl = null;
      var lastUserLatLng = null;
      window.markersLayer = L.layerGroup().addTo(map);

      window.clearMarkers = function () {
        if (window.markersLayer) {
          window.markersLayer.clearLayers();
        }
      };

      window.setUserLocation = function(lat, lng) {
        lastUserLatLng = [lat, lng];
        map.flyTo(lastUserLatLng, 16);
        if (marker) map.removeLayer(marker);
        marker = L.marker(lastUserLatLng).addTo(map).bindPopup("You are here").openPopup();
      };

      window.drawRoute = function(fromLat, fromLng, toLat, toLng) {
        if (currentRouteControl) map.removeControl(currentRouteControl);
        currentRouteControl = L.Routing.control({
          waypoints: [L.latLng(fromLat, fromLng), L.latLng(toLat, toLng)],
          show: false,
          showAlternatives: true,
          altLineOptions: {
            styles: [
              { color: 'blue', opacity: 0.7, weight: 5 },
              { color: 'gray', opacity: 0.3, weight: 4 }
            ]
          },
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
        }).addTo(map);

        currentRouteControl.on('routesfound', function(e) {
          const summaries = e.routes.map((route, index) => ({
            index,
            distance: (route.summary.totalDistance / 1000).toFixed(2),
            duration: (route.summary.totalTime / 60).toFixed(0),
            coords: route.coordinates.map(p => [p.lat, p.lng]) // cần có
          }));

          if (window.ReactNativeWebView?.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'routes_found',
              routes: summaries
            }));
          }
        });
      };

      window.displayRoadMarkers = function (roads) {
        console.log("📌 Injected markers from React Native:", roads);
        if (!window.markersLayer) {
          window.markersLayer = L.layerGroup().addTo(map);
        }

        roads.forEach((road) => {
          const { latitude, longitude, level, filepath, created_at } = road;
          const color =
            level === "Good" ? "green" :
            level === "Satisfactory" ? "blue" :
            level === "Poor" ? "orange" :
            level === "Very poor" ? "red" : "gray";

          const icon = L.divIcon({
            html:
              '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="' + color + '">' +
              '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 7.5 12 7.5s2.5 1.12 2.5 2.5S13.38 12.5 12 12.5z"/>' +
              '</svg>',
            className: "",
            iconSize: [30, 40],
            iconAnchor: [15, 40],
          });

          const marker = L.marker([latitude, longitude], { icon }).addTo(window.markersLayer);
          marker.on("click", function () {
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: 'marker_click',
              data: {
                id: road.id,
                title: "Đoạn đường hư hỏng",
                lat: latitude,
                lng: longitude,
                address: road.location || "Đang cập nhật...",
                time: created_at || "Unknown",
                result: level,
                image: filepath ? window.API_BASE + filepath : ""
              }
            }));
          });
        });
      };

      window.displayBadRoutes = function (routes) {
        console.log("🛣️ Displaying bad routes:", routes);

        if (!window.badRouteLayer) {
          window.badRouteLayer = L.layerGroup().addTo(map);
        } else {
          window.badRouteLayer.clearLayers();
        }

        routes.forEach((segment) => {
          const latlngs = segment.map(([lat, lng]) => [lat, lng]);
           console.log("🟩 RENDERING POLYLINE:", latlngs);

          L.polyline(latlngs, { color: "red", weight: 5 }).addTo(window.badRouteLayer);
        });
    };



      window.clearBadRoutes = function () {
        if (window.badRouteLayer) {
          window.badRouteLayer.clearLayers();
        }
      };
      console.log("📦 routes from RN:", routes);
      alert("📦 Got routes: " + JSON.stringify(routes));

    </script>
  </body>
</html>
`;