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
      var map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);

      var marker = null;
      var currentRouteControl = null;
      var lastUserLatLng = null;

      window.setUserLocation = function(lat, lng) {
        lastUserLatLng = [lat, lng];
        map.flyTo(lastUserLatLng, 16);
        if (marker) map.removeLayer(marker);
        marker = L.marker(lastUserLatLng).addTo(map).bindPopup("You are here").openPopup();
      };

      window.drawRoute = function(fromLat, fromLng, toLat, toLng) {
        if (currentRouteControl) {
          map.removeControl(currentRouteControl);
        }

        currentRouteControl = L.Routing.control({
          waypoints: [
            L.latLng(fromLat, fromLng),
            L.latLng(toLat, toLng)
          ],
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
            duration: (route.summary.totalTime / 60).toFixed(0)
          }));

          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'routes_found',
              routes: summaries
            }));
          }
        });
      };

      window.resetMap = function() {
        if (currentRouteControl) {
          map.removeControl(currentRouteControl);
          currentRouteControl = null;
        }
        if (lastUserLatLng) {
          map.flyTo(lastUserLatLng, 16);
        }
      };
    </script>
  </body>
</html>
`;
