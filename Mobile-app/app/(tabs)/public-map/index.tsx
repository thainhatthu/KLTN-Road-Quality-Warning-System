import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import type { LocationObjectCoords } from "expo-location";
import type { WebView as WebViewType } from "react-native-webview";
import { getLeafletHtml } from "@/utils/leafletMapHtml";

export default function PublicMapScreen() {
  const router = useRouter();
  const webviewRef = useRef<WebViewType>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  // Lấy vị trí thật
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      if (webviewRef.current) {
        const js = `
          if (window.setUserLocation) {
            window.setUserLocation(${loc.coords.latitude}, ${loc.coords.longitude});
          }
        `;
        webviewRef.current.injectJavaScript(js);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/react-logo.png")}
            style={styles.icon}
          />
          <Text style={styles.mainTitle}>Public Map</Text>
          <Image
            source={require("@/assets/images/img_avatar.png")}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require("@/assets/images/road-classifier-banner.png")}
            style={styles.banner}
          />
          <Text style={styles.headerTitle}>
            Welcome to Road Classifier System
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Map</Text>

        {/* Bản đồ + icon expand */}
        <View style={styles.mapWrapper}>
          <WebView
            ref={webviewRef}
            originWhitelist={["*"]}
            javaScriptEnabled
            source={{ html: getLeafletHtml() }}
            onLoadEnd={() => {
              if (location) {
                const js = `
        if (window.setUserLocation) {
          window.setUserLocation(${location.latitude}, ${location.longitude});
        }
      `;
                webviewRef.current?.injectJavaScript(js);
              }
            }}
          />

          {/* Nút expand */}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => router.push("/full-map")}
          >
            <Ionicons name="expand-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9FF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerWrapper: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
  },
  headerContainer: {
    backgroundColor: "#2D82C6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    height: 100,
  },
  banner: {
    width: "100%",
    height: 90,
    borderRadius: 12,
    resizeMode: "cover",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    top: "15%",
    color: "white",
    paddingLeft: 10,
    width: "50%",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 12,
  },
  mapWrapper: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 32,
    position: "relative",
  },
  mapWebview: {
    height: "100%",
    width: "100%",
  },
  expandButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});
