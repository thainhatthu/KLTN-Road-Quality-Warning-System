declare module 'leaflet-routing-machine' {
    import 'leaflet';
    import { Control } from 'leaflet';
  
    namespace L.Routing {
      function control(options: any): Control;
  
      namespace Control {
        // Đảm bảo khai báo Geocoder đúng
        namespace Geocoder {
          function nominatim(): any;
        }
      }
    }
  
    export = L.Routing;
  }
  