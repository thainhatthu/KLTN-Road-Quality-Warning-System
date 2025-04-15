import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import type { LocationObjectCoords } from "expo-location";
import type { WebView as WebViewType } from "react-native-webview";
import { getLeafletHtml } from "@/utils/leafletMapHtml";

import * as ImagePicker from "expo-image-picker";
import Header from "@/components/ui/header";

export default function PrivateMapScreen() {
  const router = useRouter();
  const webviewRef = useRef<WebViewType>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [showBadRoutes, setShowBadRoutes] = useState(true);

  const [uploadLat, setUploadLat] = useState("");
  const [uploadLng, setUploadLng] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
  const [showNearby, setShowNearby] = useState(true);

  const nearbyData = [
    {
      address: "Đường số 10, Phường Dĩ An, Thành phố Dĩ An, Tỉnh Bình Dương",
      status: "Very poor",
    },
    {
      address: "Đường Cà Phê Xóm Vắng 2, Phường Tân Đông Hiệp",
      status: "Poor",
    },
    {
      address: "QL1K, Khu phố Đông Tân, P. Dĩ An",
      status: "Moderate",
    },
    {
      address: "Đường số 10, Phường Dĩ An, Thành phố Dĩ An, Tỉnh Bình Dương",
      status: "Very poor",
    },
    {
      address: "Đường Cà Phê Xóm Vắng 2, Phường Tân Đông Hiệp",
      status: "Poor",
    },
    {
      address: "QL1K, Khu phố Đông Tân, P. Dĩ An",
      status: "Moderate",
    },
  ];

  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Map management"></Header>

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
        {/* View Bad Routes Toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>View Bad Routes</Text>
          <Switch
            value={showBadRoutes}
            onValueChange={setShowBadRoutes}
            trackColor={{ true: "#2D82C6", false: "#ccc" }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
            onPress={openCamera}
          >
            <Ionicons
              name="camera"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2D82C6" }]}
            onPress={() => setShowUploadModal(true)}
          >
            <Ionicons
              name="cloud-upload"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
        {/* Nearby Damaged Roads */}
        <View style={styles.roadBox}>
          <TouchableOpacity
            onPress={() => setShowNearby((prev) => !prev)}
            style={styles.roadBoxHeader}
          >
            <Text style={styles.roadBoxTitle}>
              Các đoạn đường xấu gần khu vực của bạn
            </Text>
            <Ionicons
              name={showNearby ? "chevron-up" : "chevron-down"}
              size={18}
              color="#333"
            />
          </TouchableOpacity>

          {showNearby && (
            <ScrollView style={styles.roadScroll} nestedScrollEnabled>
              {nearbyData.map((item, idx) => (
                <View style={styles.roadScrollItem} key={idx}>
                  <Ionicons
                    name="ellipse"
                    size={6}
                    color="#2D82C6"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.roadScrollText}>
                    {item.address} - Trạng thái: {item.status}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Modal Upload */}
        <Modal visible={showUploadModal} transparent animationType="slide">
          <View style={styles.modalWrapper}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Upload Đoạn đường</Text>

              <TextInput
                placeholder="Latitude"
                style={styles.inputModal}
                keyboardType="numeric"
                value={uploadLat}
                onChangeText={setUploadLat}
              />
              <TextInput
                placeholder="Longitude"
                style={styles.inputModal}
                keyboardType="numeric"
                value={uploadLng}
                onChangeText={setUploadLng}
              />

              <TouchableOpacity
                style={[styles.actionButton, { marginVertical: 12 }]}
                onPress={pickImage}
              >
                <Ionicons
                  name="image"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionButtonText}>Choose Image</Text>
              </TouchableOpacity>

              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
              )}

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#2D82C6" }]}
                onPress={() => {
                  setShowUploadModal(false);
                  // TODO: Submit uploadLat, uploadLng, selectedImage
                  console.log(
                    "Uploaded info:",
                    uploadLat,
                    uploadLng,
                    selectedImage
                  );
                }}
              >
                <Text style={styles.actionButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginBottom: 20,
    position: "relative",
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  roadBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  roadBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  roadBoxTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  roadScroll: {
    maxHeight: 180,
    paddingHorizontal: 12,
  },
  roadScrollItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  roadScrollText: {
    fontSize: 13,
    color: "#444",
    flex: 1,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2D82C6",
  },
  inputModal: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
});
