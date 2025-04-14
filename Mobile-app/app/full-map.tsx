import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Pressable,
  Modal,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { getLeafletHtml } from "@/utils/leafletMapHtml";
import type { WebView as WebViewType } from "react-native-webview";
import type { LocationObjectCoords } from "expo-location";
import { Ionicons } from "@expo/vector-icons";

type Suggestion = { display_name: string; lat: string; lon: string };

export default function FullMapScreen() {
  const webviewRef = useRef<WebViewType>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [from, setFrom] = useState({ input: "", coord: null, suggestions: [] as Suggestion[] });
  const [to, setTo] = useState({ input: "", coord: null, suggestions: [] as Suggestion[] });
  const [routesInfo, setRoutesInfo] = useState<{ distance: string; duration: string }[]>([]);
  const [showRoutesModal, setShowRoutesModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleLoadEnd = () => {
    if (location && webviewRef.current) {
      const js = `
        if (window.setUserLocation) {
          window.setUserLocation(${location.latitude}, ${location.longitude});
        }
      `;
      webviewRef.current.injectJavaScript(js);
    }
  };

  const fetchSuggestions = async (text: string, type: "from" | "to") => {
    if (text.length < 3) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=vn&q=${encodeURIComponent(text)}`);
    const data: Suggestion[] = await res.json();
    if (type === "from") setFrom((prev) => ({ ...prev, suggestions: data }));
    else setTo((prev) => ({ ...prev, suggestions: data }));
  };

  const handleSelectSuggestion = (item: Suggestion, type: "from" | "to") => {
    const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    if (type === "from") setFrom({ input: item.display_name, coord, suggestions: [] });
    else setTo({ input: item.display_name, coord, suggestions: [] });
  };

  const handleRoute = () => {
    if (!from.coord || !to.coord) return;
    const js = `
      if (window.drawRoute) {
        window.drawRoute(${from.coord.lat}, ${from.coord.lng}, ${to.coord.lat}, ${to.coord.lng});
      }
    `;
    webviewRef.current?.injectJavaScript(js);
    setShowRoutesModal(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Vị trí của bạn"
              value={from.input}
              onChangeText={(text) => {
                setFrom((prev) => ({ ...prev, input: text }));
                fetchSuggestions(text, "from");
              }}
              style={styles.input}
            />
          </View>
          <FlatList data={from.suggestions} keyExtractor={(item, index) => item.display_name + index} renderItem={({ item }) => (
            <Pressable onPress={() => handleSelectSuggestion(item, "from")}> <Text style={styles.suggestion}>{item.display_name}</Text> </Pressable>
          )} />
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Tới đâu..."
              value={to.input}
              onChangeText={(text) => {
                setTo((prev) => ({ ...prev, input: text }));
                fetchSuggestions(text, "to");
              }}
              style={styles.input}
            />
            <TouchableOpacity style={styles.goButton} onPress={handleRoute}>
              <Ionicons name="navigate" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <FlatList data={to.suggestions} keyExtractor={(item, index) => item.display_name + index} renderItem={({ item }) => (
            <Pressable onPress={() => handleSelectSuggestion(item, "to")}> <Text style={styles.suggestion}>{item.display_name}</Text> </Pressable>
          )} />
        </View>

        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          javaScriptEnabled
          source={{ html: getLeafletHtml() }}
          onLoadEnd={handleLoadEnd}
          style={styles.map}
          onMessage={(event) => {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg.type === "routes_found") {
              setRoutesInfo(msg.routes);
              setShowRoutesModal(true);
            }
          }}
        />

        <Modal visible={showRoutesModal} transparent animationType="slide">
          <View style={styles.routesModalWrapper}>
            <View style={styles.routesCard}>
              <Text style={styles.routesTitle}>Các tuyến đường khả dụng:</Text>
              {routesInfo.map((route, index) => (
                <View key={index} style={styles.routeItem}>
                  <Text style={styles.routeText}>Tuyến {index + 1}</Text>
                  <Text style={styles.routeSubText}>Khoảng cách: {route.distance} km</Text>
                  <Text style={styles.routeSubText}>Thời gian: {route.duration} phút</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.closeRoutesModalBtn} onPress={() => setShowRoutesModal(false)}>
                <Text style={{ color: "#fff" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    color: "#000",
  },
  goButton: {
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#2D82C6",
    borderRadius: 12,
  },
  suggestion: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  map: {
    flex: 1,
    zIndex: 1,
  },
  routesModalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  routesCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routesTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
    color: "#2D82C6",
  },
  routeItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  routeSubText: {
    fontSize: 13,
    color: "#555",
  },
  closeRoutesModalBtn: {
    marginTop: 14,
    backgroundColor: "#2D82C6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});