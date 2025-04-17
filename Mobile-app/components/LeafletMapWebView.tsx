import { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import { getLeafletHtml } from "@/utils/leafletMapHtml";
import { API_URL } from "@/configs";
import dataService from "@/services/data.service";

type Props = {
  location: { latitude: number; longitude: number } | null;
  style?: any;
  onMarkerClick?: (data: any) => void;
};

export default function LeafletMapWebView({
  location,
  style,
  onMarkerClick,
}: Props) {
  const webviewRef = useRef<WebViewType>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<typeof location>(null);

  useEffect(() => {
    if (isLoaded && location && webviewRef.current) {
      const js = `window.setUserLocation(${location.latitude}, ${location.longitude});`;
      webviewRef.current.injectJavaScript(js);
    } else {
      setPendingLocation(location);
    }
  }, [location, isLoaded]);

  const handleLoadEnd = async () => {
    setIsLoaded(true);

    if (pendingLocation && webviewRef.current) {
      const js = `window.setUserLocation(${pendingLocation.latitude}, ${pendingLocation.longitude});`;
      webviewRef.current.injectJavaScript(js);
    }

    try {
      const res = await dataService.getInfoRoads({ all: true });
      const parsedRoads = Array.isArray((res as any)?.data?.data)
        ? (res as any).data.data.map((item: string) => JSON.parse(item))
        : [];

      webviewRef.current?.injectJavaScript(`window.API_BASE = "${API_URL}";`);
      webviewRef.current?.injectJavaScript(
        `window.displayRoadMarkers(${JSON.stringify(parsedRoads)});`
      );
    } catch (err) {
      console.error("❌ Error fetching and injecting markers:", err);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={["*"]}
      javaScriptEnabled
      source={{ html: getLeafletHtml() }}
      style={style}
      onLoadEnd={handleLoadEnd}
      onMessage={(event) => {
        try {
          const msg = JSON.parse(event.nativeEvent.data);
          if (msg.type === "marker_click" && onMarkerClick) {
            onMarkerClick(msg.data);
          }
        } catch (e) {
          console.warn(
            "📛 Invalid message from WebView:",
            event.nativeEvent.data
          );
        }
      }}
    />
  );
}
