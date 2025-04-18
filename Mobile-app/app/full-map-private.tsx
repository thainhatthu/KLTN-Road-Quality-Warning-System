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
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { getLeafletHtml } from "@/utils/leafletMapHtml";
import type { WebView as WebViewType } from "react-native-webview";
import type { LocationObjectCoords } from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import dataService from "@/services/data.service";
import { API_URL } from "@/configs";
import LeafletMapWebView from "@/components/LeafletMapWebView";
import { getStoredUserInfo } from "@/utils/auth.util";
import PrivateMapWebView from "@/components/PrivateMapWebView";

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
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<null | {
    id: number;
    title: string;
    lat: number;
    lng: number;
    address: string;
    time: string;
    result: string;
    image: string;
  }>(null);
  const [editMode, setEditMode] = useState(false);

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
      const js = `window.setUserLocation(${location.latitude}, ${location.longitude});`;
      webviewRef.current.injectJavaScript(js);
    }
  };

  const handleRoute = () => {
    if (!from.coord || !to.coord) return;
    const js = `window.drawRoute(${from.coord.lat}, ${from.coord.lng}, ${to.coord.lat}, ${to.coord.lng});`;
    webviewRef.current?.injectJavaScript(js);
  };

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const user = await getStoredUserInfo();
        if (!user?.id) return;

        const res = await dataService.getInfoRoads({ user_id: user.id, all: false });
        if (webviewRef.current && Array.isArray(res?.data)) {
          const parsedRoads = res.data.map((item: string) => JSON.parse(item));
          webviewRef.current.injectJavaScript(`window.API_BASE = "${API_URL}";`);
          webviewRef.current.injectJavaScript(`window.displayRoadMarkers(${JSON.stringify(parsedRoads)});`);
        }
      } catch (error) {
        console.error("❌ Error fetching user roads:", error);
      }
    };

    fetchRoads();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <PrivateMapWebView location={location} style={styles.map} onMarkerClick={(data) => setSelectedMarkerInfo(data)} />

        <Modal visible={!!selectedMarkerInfo} transparent animationType="slide">
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View style={styles.routesModalWrapper}>
              <View style={styles.detailCard}>
                <ScrollView contentContainerStyle={styles.detailSection} keyboardShouldPersistTaps="handled">
                  {selectedMarkerInfo?.image && (
                    <View>
                      <Image source={{ uri: selectedMarkerInfo.image }} style={styles.detailImage} resizeMode="cover" />
                      <View style={styles.imageActionButtons}>
                        <TouchableOpacity style={styles.editIcon} onPress={() => setEditMode(true)}>
                          <Ionicons name="create-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteIcon}
                          onPress={async () => {
                            try {
                              await dataService.deleteRoad({ id_road: selectedMarkerInfo!.id, all: false });
                              alert("Đã xoá đoạn đường!");
                              setSelectedMarkerInfo(null);
                            } catch (err) {
                              console.error("❌ Delete error:", err);
                              alert("Xoá thất bại!");
                            }
                          }}
                        >
                          <Ionicons name="trash-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <Text style={styles.sectionTitle}>Location</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.tagBlue}>Lat: {selectedMarkerInfo?.lat}</Text>
                    <Text style={styles.tagDarkBlue}>Long: {selectedMarkerInfo?.lng}</Text>
                  </View>
                  <Text style={styles.sectionTitle}>Address:</Text>
                  <View style={styles.addressBox}>
                    <Text style={styles.addressText}>{selectedMarkerInfo?.address}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <View style={styles.resultTag}>
                      <Text style={styles.resultText}>📍 {selectedMarkerInfo?.result}</Text>
                    </View>
                    <Text style={styles.timeText}>📍 {selectedMarkerInfo?.time}</Text>
                  </View>

                  {editMode && (
                    <View>
                      <Text style={styles.sectionTitle}>Edit location: </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="New Latitude"
                        keyboardType="numeric"
                        value={String(selectedMarkerInfo?.lat)}
                        onChangeText={(text) =>
                          setSelectedMarkerInfo((prev) => (prev ? { ...prev, lat: parseFloat(text) } : prev))
                        }
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="New Longitude"
                        keyboardType="numeric"
                        value={String(selectedMarkerInfo?.lng)}
                        onChangeText={(text) =>
                          setSelectedMarkerInfo((prev) => (prev ? { ...prev, lng: parseFloat(text) } : prev))
                        }
                      />
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: "#2D82C6", marginTop: 10 }]}
                        onPress={async () => {
                          console.log("📌 Update Params:", {
                            id: selectedMarkerInfo!.id,
                            lat: selectedMarkerInfo!.lat,
                            lng: selectedMarkerInfo!.lng,
                          });
                          
                          try {
                            await dataService.updateLocationRoad(
                              selectedMarkerInfo!.id,
                              selectedMarkerInfo!.lat,
                              selectedMarkerInfo!.lng
                            );
                            alert("Cập nhật thành công!");
                            setEditMode(false);
                          } catch (err) {
                            console.error("❌ Update error:", err);
                            alert("Cập nhật thất bại!");
                          }
                        }}
                      >
                        <Text style={styles.actionButtonText}>Lưu</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.closeRoutesModalBtn, { marginTop: 14 }]}
                    onPress={() => {
                      setEditMode(false);
                      setSelectedMarkerInfo(null);
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Đóng</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  routesModalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
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
  imageActionButtons: {
    position: "absolute",
    flexDirection: "row",
    right: 10,
    top: 10,
    zIndex: 10,
    gap: 10,
  },
  editIcon: {
    backgroundColor: "#2D82C6",
    padding: 8,
    borderRadius: 8,
  },
  deleteIcon: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
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
  closeRoutesModalBtn: {
    backgroundColor: "#2D82C6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  } 
});
