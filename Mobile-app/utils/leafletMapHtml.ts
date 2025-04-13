export const getLeafletHtml = () => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      var map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);

      var marker;
      window.setUserLocation = function(lat, lng) {
        map.flyTo([lat, lng], 15);
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map).bindPopup("You are here");
        marker.on('click', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'currentLocation',
            data: { lat, lng, address: 'Vị trí hiện tại', result: 'BAD ROAD', time: '07:30:22, 20/11/2024' }
          }));
        });
      };
    </script>
  </body>
</html>
`;
