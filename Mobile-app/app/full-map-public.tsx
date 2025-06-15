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
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import type { WebView as WebViewType } from "react-native-webview";
import type { LocationObjectCoords } from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import dataService from "@/services/data.service";
import LeafletMapWebView from "@/components/LeafletMapWebView";
import { useBadRoutesStore } from "@/stores/badRoutesStore";

export default function FullMapScreen() {
  const webviewRef = useRef<WebViewType>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [showRouteHint, setShowRouteHint] = useState(true);
  const [from, setFrom] = useState<{
    input: string;
    coord: { lat: number; lng: number } | null;
    suggestions: any[];
  }>({ input: "", coord: null, suggestions: [] });
  const [to, setTo] = useState<{
    input: string;
    coord: { lat: number; lng: number } | null;
    suggestions: any[];
  }>({ input: "", coord: null, suggestions: [] });
  const [routesInfo, setRoutesInfo] = useState<any[]>([]);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  type MarkerInfo = {
    lat: number;
    lng: number;
    address?: string;
    image?: string;
    result?: string;
    time?: string;
  };
  const [selectedMarkerInfo, setSelectedMarkerInfo] =
    useState<MarkerInfo | null>(null);

  const showBadRoutes = useBadRoutesStore((s) => s.badRoutes);
  const badRoutes = useBadRoutesStore((s) => s.badRoutes);

  useEffect(() => {
    const timer = setTimeout(() => setShowRouteHint(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const fetchSuggestions = async (text: string, type: "from" | "to") => {
    if (text.length < 3) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=vn&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();
    if (type === "from") setFrom((prev) => ({ ...prev, suggestions: data }));
    else setTo((prev) => ({ ...prev, suggestions: data }));
  };

  const handleSelectSuggestion = (item: any, type: "from" | "to") => {
    const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    if (type === "from")
      setFrom({ input: item.display_name, coord, suggestions: [] });
    else setTo({ input: item.display_name, coord, suggestions: [] });
  };

  const calculateWeight = (route: any, damagePoints: any[]) => {
    let weight = 0;
    const counted = new Set<number>();
    damagePoints.forEach((d, i) => {
      for (let j = 0; j < route.coords.length - 1; j++) {
        const [aLat, aLng] = route.coords[j];
        const [bLat, bLng] = route.coords[j + 1];
        const ax = bLat - aLat,
          ay = bLng - aLng;
        const bx = d.lat - aLat,
          by = d.lng - aLng;
        const t = (ax * bx + ay * by) / (ax * ax + ay * ay);
        if (t >= 0 && t <= 1) {
          const projLat = aLat + t * ax;
          const projLng = aLng + t * ay;
          const dist = Math.hypot(projLat - d.lat, projLng - d.lng);
          if (dist < 0.00005 && !counted.has(i)) {
            weight += d.weight;
            counted.add(i);
          }
        }
      }
    });
    return weight;
  };

  const handleRoute = async () => {
    if (!to.coord) return;
    const fromCoord =
      from.coord ??
      (location ? { lat: location.latitude, lng: location.longitude } : null);
    if (!fromCoord) return;

    const url = `https://b151-42-116-6-46.ngrok-free.app/osrm/route/v1/driving/${fromCoord.lng},${fromCoord.lat};${to.coord.lng},${to.coord.lat}?alternatives=true&overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const routes = data.routes.map((r: any, idx: number) => ({
        index: idx,
        distance: (r.distance / 1000).toFixed(2),
        duration: (r.duration / 60).toFixed(0),
        coords: r.geometry.coordinates.map(([lon, lat]: number[]) => [
          lat,
          lon,
        ]),
      }));

      const roadRes = (await dataService.getInfoRoads({ all: false })) as {
        data?: { data?: string[] };
      };
      const parsed = Array.isArray(roadRes?.data?.data)
        ? roadRes.data.data.map((item: string) => JSON.parse(item))
        : [];

      const damagePoints = parsed.map((r: any) => ({
        lat: r.latitude,
        lng: r.longitude,
        weight: Number(r.weight) || 1,
      }));

      const colorPool = ["orange", "blue", "purple", "brown"];
      const enriched = routes.map((r: any, i: number) => {
        const weight = calculateWeight(r, damagePoints);
        return {
          ...r,
          dangerWeight: weight,
          color: colorPool[i % colorPool.length],
        };
      });

      const sorted = enriched.sort(
        (
          a: { dangerWeight: number; duration: string },
          b: { dangerWeight: number; duration: string }
        ) =>
          a.dangerWeight - b.dangerWeight ||
          parseFloat(a.duration) - parseFloat(b.duration)
      );

      webviewRef.current?.injectJavaScript(
        `window.drawPolylineRoute(${JSON.stringify(sorted)});`
      );
      setRoutesInfo(sorted);
      setShowRoutesModal(true);
    } catch (err) {
      console.error("❌ Error calculating route:", err);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.searchCard}>
          <Text style={styles.label}>Start location</Text>
          <View style={styles.inputRowStyled}>
            <Ionicons
              name="locate-outline"
              size={16}
              style={styles.iconStart}
            />
            <TextInput
              placeholder="Current location..."
              value={from.input || ""}
              onChangeText={(text) => {
                setFrom((prev) => ({ ...prev, input: text }));
                fetchSuggestions(text, "from");
              }}
              style={styles.inputStyled}
              placeholderTextColor="#aaa"
            />
            {from.suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                <FlatList
                  data={from.suggestions}
                  keyExtractor={(item, index) => item.display_name + index}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleSelectSuggestion(item, "from")}
                    >
                      <Text style={styles.suggestionItem}>
                        {item.display_name}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>

          <Text style={styles.label}>Destination</Text>
          <View style={styles.inputRowStyled}>
            <Ionicons name="flag-outline" size={16} style={styles.iconStart} />
            <TextInput
              placeholder="To..."
              value={to.input}
              onChangeText={(text) => {
                setTo((prev) => ({ ...prev, input: text }));
                fetchSuggestions(text, "to");
              }}
              style={styles.inputStyled}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.goBtn} onPress={handleRoute}>
              <Ionicons name="navigate" size={18} color="#fff" />
            </TouchableOpacity>
            {to.suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                <FlatList
                  data={to.suggestions}
                  keyExtractor={(item, index) => item.display_name + index}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleSelectSuggestion(item, "to")}
                    >
                      <Text style={styles.suggestionItem}>
                        {item.display_name}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>
        </View>

        <LeafletMapWebView
          location={location}
          style={styles.map}
          onMarkerClick={(data) => setSelectedMarkerInfo(data)}
          webviewRef={webviewRef}
          badRoutes={showBadRoutes ? badRoutes : []}
          onRoutesFound={async (routes) => {
            try {
              const res = (await dataService.getInfoRoads({ all: false })) as {
                data: { data: string[] };
              };
              const parsed = Array.isArray(res?.data?.data)
                ? res.data.data.map((item: string) => JSON.parse(item))
                : [];

              const damagePoints = parsed.map((r: any) => ({
                lat: r.latitude,
                lng: r.longitude,
                weight: Number(r.weight) || 1,
              }));

              const calculateWeight = (route: any) => {
                let weight = 0;
                const counted = new Set<number>();
                damagePoints.forEach((d, i) => {
                  for (let j = 0; j < route.coords.length - 1; j++) {
                    const [aLat, aLng] = route.coords[j];
                    const [bLat, bLng] = route.coords[j + 1];
                    const ax = bLat - aLat,
                      ay = bLng - aLng;
                    const bx = d.lat - aLat,
                      by = d.lng - aLng;
                    const t = (ax * bx + ay * by) / (ax * ax + ay * ay);
                    if (t >= 0 && t <= 1) {
                      const projLat = aLat + t * ax;
                      const projLng = aLng + t * ay;
                      const dist = Math.hypot(projLat - d.lat, projLng - d.lng);
                      if (dist < 0.0001 && !counted.has(i)) {
                        weight += d.weight;
                        counted.add(i);
                      }
                    }
                  }
                });
                return weight;
              };

              const enrichedRoutes = routes.map((r, idx) => {
                const coords = r.coords;
                return {
                  ...r,
                  dangerWeight: calculateWeight(r),
                };
              });

              const sorted = enrichedRoutes.sort(
                (a, b) =>
                  a.dangerWeight - b.dangerWeight ||
                  parseFloat(a.duration) - parseFloat(b.duration)
              );

              setRoutesInfo(sorted);
              setShowRoutesModal(true);
            } catch (err) {
              console.error("❌ Route weight calc error:", err);
            }
          }}
        />
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setShowRoutesModal((prev) => !prev)}
        >
          <Text style={styles.floatingButtonText}>
            {showRoutesModal ? "×" : "🛣"}
          </Text>
        </TouchableOpacity>

        {showRouteHint && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.hintBubble}
            onPress={() => {
              setShowRoutesModal(true);
              setShowRouteHint(false);
            }}
          >
            <Text style={styles.hintText}>✨ Tap here to view route info</Text>
          </TouchableOpacity>
        )}

        <Modal visible={showRoutesModal} transparent animationType="slide">
          <View style={styles.routesModalWrapper}>
            <View style={styles.routesCard}>
              <Text style={styles.routesTitle}>🛣 Routes Information</Text>

              {routesInfo.length > 1 && (
                <View style={styles.bestSuggestionCard}>
                  <Text style={styles.bestSuggestionTitle}>
                    ✨ Best option is route {routesInfo[0].index + 1}
                  </Text>
                  <View style={styles.bulletList}>
                    <Text style={styles.bulletItem}>
                      • Have fewer damaged segments
                    </Text>
                    <Text style={styles.bulletItem}>
                      • Shortest estimated time
                    </Text>
                    <Text style={styles.bulletItem}>
                      • Distance:{" "}
                      <Text style={styles.bold}>{routesInfo[0].distance}</Text>{" "}
                      km
                    </Text>
                    <Text style={styles.bulletItem}>
                      • Time:{" "}
                      <Text style={styles.bold}>{routesInfo[0].duration}</Text>{" "}
                      min
                    </Text>
                  </View>
                </View>
              )}

              {routesInfo.map((r, i) => (
                <View
                  key={i}
                  style={[
                    styles.routeItemCard,
                    r.dangerWeight > 0 ? styles.dangerRoute : styles.safeRoute,
                  ]}
                >
                  <Text style={styles.routeItemTitle}>Route {r.index + 1}</Text>
                  <Text style={styles.routeItemSub}>
                    Distance: {r.distance} km
                  </Text>
                  <Text style={styles.routeItemSub}>
                    Time: {r.duration} min
                  </Text>
                  <Text
                    style={[
                      styles.routeItemSub,
                      r.dangerWeight > 0 ? styles.textDanger : styles.textSafe,
                    ]}
                  >
                    {r.dangerWeight > 0
                      ? `⚠️ Danger weight: ${r.dangerWeight}`
                      : "✅ Safe"}
                  </Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.closeRoutesModalBtn}
                onPress={() => setShowRoutesModal(false)}
              >
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for marker details */}
        <Modal visible={!!selectedMarkerInfo} transparent animationType="slide">
          <View style={styles.routesModalWrapper}>
            <View style={styles.detailCard}>
              {selectedMarkerInfo?.image && (
                <Image
                  source={{ uri: selectedMarkerInfo.image }}
                  style={styles.detailImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.rowBetween}>
                  <Text style={styles.tagBlue}>
                    Lat: {selectedMarkerInfo?.lat}
                  </Text>
                  <Text style={styles.tagDarkBlue}>
                    Long: {selectedMarkerInfo?.lng}
                  </Text>
                </View>
                <Text style={styles.sectionTitle}>Address:</Text>
                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>
                    {selectedMarkerInfo?.address}
                  </Text>
                </View>
                <View style={styles.rowBetween}>
                  <View style={styles.resultTag}>
                    <Text style={styles.resultText}>
                      📍 {selectedMarkerInfo?.result}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>
                    📍 {selectedMarkerInfo?.time}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeRoutesModalBtn}
                  onPress={() => setSelectedMarkerInfo(null)}
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
  container: { flex: 1, backgroundColor: "#fff" },
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
  routeItemCard: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
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
    marginTop: 40,
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

  closeRoutesModalBtn: {
    marginTop: 14,
    backgroundColor: "#2D82C6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  detailCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    maxHeight: "90%",
  },
  detailImage: {
    width: "100%",
    height: 200,
  },
  detailSection: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 15,
    color: "#333",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tagBlue: {
    backgroundColor: "#c2f0f7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#000",
  },
  tagDarkBlue: {
    backgroundColor: "#b6cefb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#000",
  },
  addressBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
  },
  resultTag: {
    backgroundColor: "#ffebeb",
    padding: 8,
    borderRadius: 10,
  },
  resultText: {
    color: "#d11a2a",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 13,
    color: "#444",
    textAlign: "right",
    marginTop: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#ffffff",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 20,
    borderColor: "#2D82C6",
    borderWidth: 2,
  },
  floatingButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },

  suggestionText: {
    color: "#0077b6",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  bestSuggestionCard: {
    backgroundColor: "#E6F7FF",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2D82C6",
    padding: 10,
    marginBottom: 10,
  },

  bestSuggestionTitle: {
    color: "#2D82C6",
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 14,
  },
  bulletList: {
    marginLeft: 4,
  },
  bulletItem: {
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
  },

  safeRoute: {
    backgroundColor: "#e6fffa",
    borderLeftWidth: 4,
    borderLeftColor: "#38b2ac",
  },
  dangerRoute: {
    backgroundColor: "#fff5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#f56565",
  },
  routeItemTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#222",
  },
  routeItemSub: {
    fontSize: 13,
    color: "#555",
  },
  textDanger: {
    color: "#c53030",
    fontWeight: "bold",
  },
  textSafe: {
    color: "#2f855a",
    fontWeight: "bold",
  },
  hintBubble: {
    position: "absolute",
    bottom: 110,
    right: 20,
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2D82C6",
    zIndex: 30,
    maxWidth: 240,
  },
  hintText: {
    color: "#2D82C6",
    fontWeight: "500",
    fontSize: 13,
  },
  hintArrow: {
    textAlign: "center",
    color: "#2D82C6",
    fontSize: 18,
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
    height: 150,
    top: 45,
  },
  label: {
    fontSize: 12,
    color: "#88888",
    marginBottom: 4,
    marginLeft: 4,
  },
  inputRowStyled: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  inputStyled: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
    zIndex: 100,
  },
  iconStart: {
    marginRight: 8,
    color: "#2D82C6",
  },
  goBtn: {
    backgroundColor: "#2D82C6",
    padding: 10,
    borderRadius: 10,
    left: 12,
  },
  suggestionBox: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    maxHeight: 140,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 999,
    position: "absolute",
    top: 40,
    left: 2,
    right: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionItem: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 13,
    color: "#333",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});
