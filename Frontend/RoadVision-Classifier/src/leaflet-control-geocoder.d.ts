declare module "leaflet-control-geocoder" {
  import * as L from "leaflet";

  export interface GeocoderOptions {
    defaultMarkGeocode?: boolean;
  }

  export interface Geocoder {
    new (options?: GeocoderOptions): Geocoder;
    options: GeocoderOptions;
    markGeocode(result: any): void;
  }

  export namespace Geocoder {
    function nominatim(options?: GeocoderOptions): Geocoder;
  }

  namespace Control {
    namespace Geocoder {
      function nominatim(options?: any): any;
    }
  }
}
