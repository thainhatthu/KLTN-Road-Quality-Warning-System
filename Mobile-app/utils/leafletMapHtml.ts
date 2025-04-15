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
      var map = L.map('map').setView([10.7769, 106.7009], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

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
            duration: (route.summary.totalTime / 60).toFixed(0)
          }));

          if (window.ReactNativeWebView?.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'routes_found',
              routes: summaries
            }));
          }
        });
      };

      // Marker demo (click để gửi dữ liệu)
      const badRoadMarker = L.marker([9.88, 105.37]).addTo(map).bindPopup("BAD ROAD");

      badRoadMarker.on('click', function() {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'marker_click',
          data: {
            title: "Đoạn đường hư hỏng",
            lat: 9.88,
            lng: 105.37,
            address: "An Bình, Dĩ An, Bình Dương",
            time: "07:30:22, 20/11/2024",
            result: "BAD ROAD",
            image: "https://i.imgur.com/W6m7sZC.jpeg"
          }
        }));
      });
    </script>
  </body>
</html>
`;
