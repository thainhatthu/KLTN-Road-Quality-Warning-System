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
} from "react-native";
import { WebView } from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { getLeafletHtml } from "@/utils/leafletMapHtml";
import type { WebView as WebViewType } from "react-native-webview";
import type { LocationObjectCoords } from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { Image } from "react-native";

type Suggestion = { display_name: string; lat: string; lon: string };

export default function FullMapScreen() {
  const webviewRef = useRef<WebViewType>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);

  const [from, setFrom] = useState({
    input: "",
    coord: null,
    suggestions: [] as Suggestion[],
  });
  const [to, setTo] = useState({
    input: "",
    coord: null,
    suggestions: [] as Suggestion[],
  });
  const [showInput, setShowInput] = useState(true);
  const [modalData, setModalData] = useState<null | {
    lat: number;
    lng: number;
    address: string;
    result: string;
    time: string;
  }>(null);

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
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=vn&q=${encodeURIComponent(
        text
      )}`
    );
    const data: Suggestion[] = await res.json();
    if (type === "from") {
      setFrom((prev) => ({ ...prev, suggestions: data }));
    } else {
      setTo((prev) => ({ ...prev, suggestions: data }));
    }
  };

  const handleSelectSuggestion = (item: Suggestion, type: "from" | "to") => {
    const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    if (type === "from") {
      setFrom({ input: item.display_name, coord, suggestions: [] });
    } else {
      setTo({ input: item.display_name, coord, suggestions: [] });
    }
  };

  const handleRoute = () => {
    if (!from.coord || !to.coord) return;
    const js = `
      if (window.drawRoute) {
        window.drawRoute(${from.coord.lat}, ${from.coord.lng}, ${to.coord.lat}, ${to.coord.lng});
      }
    `;
    webviewRef.current?.injectJavaScript(js);
    setShowInput(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {showInput && (
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInput(false)}
            >
              <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>

            <TextInput
              placeholder="Từ đâu..."
              value={from.input}
              onChangeText={(text) => {
                setFrom((prev) => ({ ...prev, input: text }));
                fetchSuggestions(text, "from");
              }}
              style={styles.input}
            />
            <FlatList
              data={from.suggestions}
              keyExtractor={(item, index) => item.display_name + index}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelectSuggestion(item, "from")}>
                  <Text style={styles.suggestion}>{item.display_name}</Text>
                </Pressable>
              )}
            />

            <View style={styles.toInputWrapper}>
              <TextInput
                placeholder="Tới đâu..."
                value={to.input}
                onChangeText={(text) => {
                  setTo((prev) => ({ ...prev, input: text }));
                  fetchSuggestions(text, "to");
                }}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => {
                  const temp = from;
                  setFrom(to);
                  setTo(temp);
                }}
                style={styles.swapInsideInput}
              >
                <Ionicons name="swap-vertical" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={to.suggestions}
              keyExtractor={(item, index) => item.display_name + index}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelectSuggestion(item, "to")}>
                  <Text style={styles.suggestion}>{item.display_name}</Text>
                </Pressable>
              )}
            />

            <TouchableOpacity style={styles.button} onPress={handleRoute}>
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={[styles.buttonText, { marginLeft: 6 }]}>
                Tìm đường
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!showInput && (
          <TouchableOpacity
            onPress={() => setShowInput(true)}
            style={styles.floatingSearchButton}
          >
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          javaScriptEnabled
          source={{ html: getLeafletHtml() }}
          onLoadEnd={handleLoadEnd}
          onMessage={(event) => {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg.type === "currentLocation") {
              setModalData(msg.data);
            }
          }}
        />
        <Modal visible={!!modalData} transparent animationType="slide">
          <View style={styles.modalWrapper}>
            <View style={styles.modalCard}>
              <Image
                source={require("@/assets/images/road-crack.png")}
                style={styles.modalImage}
              />

              <View style={{ padding: 16 }}>
                <View style={styles.rowone}>
                  <View style={styles.resultContainer}>
                    <Ionicons name="alert-circle" color="#ff4d4d" size={16} />
                    <Text style={styles.resultText}>BAD ROAD</Text>
                  </View>
                  <View style={styles.resultContainerTime}>
                    <Ionicons name="time-outline" size={16} color="#555" />
                    <Text style={styles.timeText}>{modalData?.time}</Text>
                  </View>
                </View>
                <Text style={styles.modalSectionTitle}>Location</Text>
                <View style={styles.row}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTextBlue}>
                      Lat: {modalData?.lat}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTextBlue}>
                      Long: {modalData?.lng}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalSectionTitle}>Address:</Text>
                <View style={styles.addressContainer}>
                  <Ionicons name="location-sharp" color="#333" size={16} />
                  <Text style={styles.addressText}>{modalData?.address}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setModalData(null)}
                  style={styles.closeModalBtn}
                >
                  <Text style={{ color: "#fff" }}>Close</Text>
                </TouchableOpacity>
              </View>
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
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  suggestion: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2D82C6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingSearchButton: {
    position: "absolute",
    top: 20,
    right: 60,
    backgroundColor: "#2D82C6",
    padding: 12,
    borderRadius: 24,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 11,
    padding: 4,
  },
  toInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    position: "relative",
  },
  swapInsideInput: {
    padding: 8,
    position: "absolute",
    right: 4,
    top: 1,
    zIndex: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 36,
    paddingLeft: 12,
    color: "#000",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeModalBtn: {
    marginTop: 16,
    backgroundColor: "#2D82C6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: 230,
    padding: 30,
  },
  modalSectionTitle: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  rowone: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: "#F2F7FF",
    borderRadius: 10,
  },
  badgeTextBlue: {
    color: "#2D82C6",
    fontWeight: "600",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
  },
  addressText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  resultContainerTime: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  resultText: {
    color: "#FF4D4D",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 13,
    color: "#333",
  },
});
