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
    <script>
      window.API_BASE = "";
      var map = L.map('map').setView([10.7769, 106.7009], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

      var marker = null;
      var lastUserLatLng = null;
      window.markersLayer = L.layerGroup().addTo(map);
      window.currentPolylines = [];
      window.routeMarkers = [];

      window.clearMarkers = function () {
        if (window.markersLayer) {
          window.markersLayer.clearLayers();
        }
        if (window.routeMarkers.length > 0) {
          window.routeMarkers.forEach(m => map.removeLayer(m));
        }
        window.routeMarkers = [];
      };

      window.setUserLocation = function(lat, lng) {
        lastUserLatLng = [lat, lng];
        map.flyTo(lastUserLatLng, 16);
        if (marker) map.removeLayer(marker);
        marker = L.marker(lastUserLatLng).addTo(map).bindPopup("You are here").openPopup();
      };

      window.drawPolylineRoute = function(routes) {
        if (!routes || !Array.isArray(routes)) return;

        if (window.currentPolylines.length > 0) {
          window.currentPolylines.forEach(p => map.removeLayer(p));
        }
        window.currentPolylines = [];

        if (window.routeMarkers.length > 0) {
          window.routeMarkers.forEach(m => map.removeLayer(m));
        }
        window.routeMarkers = [];

        const distinctColors = ["red", "orange", "blue", "purple", "brown", "green"];

        routes.forEach(function(route, idx) {
          var color = distinctColors[idx % distinctColors.length];
          var polyline = L.polyline(route.coords, {
            color: color,
            weight: 5,
            opacity: 0.9
          }).addTo(map).bindPopup("Route " + (idx + 1) + " 📏 Distance: " + route.distance + " km");

          window.currentPolylines.push(polyline);

          // Add A and B markers for the first route only (they are shared)
          if (idx === 0 && route.coords.length > 1) {
            var start = route.coords[0];
            var end = route.coords[route.coords.length - 1];

            var markerA = L.marker(start, { title: "Start (A)" }).addTo(map).bindPopup("Start (A)");
            var markerB = L.marker(end, { title: "End (B)" }).addTo(map).bindPopup("End (B)");

            window.routeMarkers.push(markerA);
            window.routeMarkers.push(markerB);
          }
        });

        if (routes.length > 0) {
          map.fitBounds(L.polyline(routes[0].coords).getBounds());
        }
      };

      window.displayRoadMarkers = function (roads) {
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
        if (!window.badRouteLayer) {
          window.badRouteLayer = L.layerGroup().addTo(map);
        } else {
          window.badRouteLayer.clearLayers();
        }

        routes.forEach((segment) => {
          const latlngs = segment.map(([lat, lng]) => [lat, lng]);
          L.polyline(latlngs, { color: "red", weight: 5 }).addTo(window.badRouteLayer);
        });
      };

      window.clearBadRoutes = function () {
        if (window.badRouteLayer) {
          window.badRouteLayer.clearLayers();
        }
      };
    </script>
  </body>
</html>
`;