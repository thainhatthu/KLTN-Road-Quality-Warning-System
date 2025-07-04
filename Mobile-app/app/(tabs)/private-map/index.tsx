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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import type { LocationObjectCoords } from "expo-location";
import * as ImagePicker from "expo-image-picker";
import Header from "@/components/ui/header";
import PrivateMapWebView from "@/components/PrivateMapWebView";
import dataService from "@/services/data.service";
import type { WebView as WebViewType } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import userProfileService from "@/services/userprofile.service";

export default function PrivateMapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [showBadRoutes, setShowBadRoutes] = useState(true);
  const [showNearby, setShowNearby] = useState(true);
  const [uploadLat, setUploadLat] = useState("");
  const [uploadLng, setUploadLng] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userRoads, setUserRoads] = useState<any[]>([]);
  const webviewRef = useRef<WebViewType>(null);
  const [webviewKey, setWebviewKey] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userProfileService.getProfile({});
        setProfile(res);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const fetchUserRoads = async () => {
    try {
      const res = await dataService.getInfoRoads({
        all: false,
      });
      if (!res) return;
      const parsed = Array.isArray(res?.data)
        ? res.data.map((item: string) => JSON.parse(item))
        : [];
      setUserRoads(parsed);
    } catch (e) {
      console.error("Failed to fetch user roads:", e);
    }
  };

  useEffect(() => {
    fetchUserRoads();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchUserRoads();
      setWebviewKey((prev) => prev + 1);
    }, [])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return alert("Camera permission is required");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);

      if (!location) return alert("Location not available");

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));

      try {
        await dataService.uploadRoad(formData);
        fetchUserRoads();
        alert("Upload success!");
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Upload fail. Try again!");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Map management" />
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
        <View style={styles.mapWrapper}>
          <PrivateMapWebView
            key={webviewKey}
            location={location}
            style={{ height: 300 }}
            onMarkerClick={(data) => console.log("🟡 Marker clicked:", data)}
            webviewRef={webviewRef}
          />
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => router.push("/full-map-private")}
          >
            <Ionicons name="expand-outline" size={22} color="#fff" />
          </TouchableOpacity>
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
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={18}
              color="#2D82C6"
            />
            <Text style={styles.infoCardText}>
              You’ve uploaded{" "}
              <Text style={styles.infoHighlight}>
                {profile?.contribution ?? 0} road issue
                {profile?.contribution === 1 ? "" : "s"}
              </Text>
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <Text style={styles.tipHeader}>📸 Tips for better uploads:</Text>
          <Text style={styles.tipItem}>• Capture in daylight</Text>
          <Text style={styles.tipItem}>• Focus clearly on the damage</Text>
          <Text style={styles.tipItem}>• Avoid blurry or tilted images</Text>
        </View>

        {/* Upload Modal */}
        <Modal visible={showUploadModal} transparent animationType="slide">
          <View style={styles.modalWrapper}>
            <View style={styles.modalCard}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowUploadModal(false)}
              >
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>📍 Upload Road Issue</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Latitude</Text>
                <TextInput
                  placeholder="e.g., 10.762622"
                  keyboardType="numeric"
                  value={uploadLat}
                  onChangeText={setUploadLat}
                  style={styles.inputModal}
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Longitude</Text>
                <TextInput
                  placeholder="e.g., 106.660172"
                  keyboardType="numeric"
                  value={uploadLng}
                  onChangeText={setUploadLng}
                  style={styles.inputModal}
                  placeholderTextColor="#aaa"
                />
              </View>

              <TouchableOpacity
                style={[styles.actionButtonModal, { marginVertical: 12 }]}
                onPress={pickImage}
              >
                <Ionicons
                  name="image-outline"
                  size={18}
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
                    borderRadius: 10,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.actionButtonModal,
                  { backgroundColor: "#5CB338" },
                ]}
                onPress={async () => {
                  setShowUploadModal(false);
                  if (!selectedImage || !uploadLat || !uploadLng)
                    return alert("Please fill all information");

                  const fileName = selectedImage.split("/").pop();
                  const latNum = parseFloat(uploadLat);
                  const lngNum = parseFloat(uploadLng);

                  if (isNaN(latNum) || isNaN(lngNum))
                    return alert("Invalid coordinates");

                  const formData = new FormData();
                  formData.append("file", {
                    uri: selectedImage.startsWith("file://")
                      ? selectedImage
                      : `file://${selectedImage}`,
                    name: fileName || "photo.jpg",
                    type: "image/jpeg",
                  } as any);
                  formData.append("latitude", latNum.toString());
                  formData.append("longitude", lngNum.toString());

                  try {
                    await dataService.uploadRoad(formData);
                    setWebviewKey((prev) => prev + 1);
                    alert("Upload successful!");
                  } catch (err) {
                    console.error("❌ Upload failed:", err);
                    alert("Upload failed!");
                  }
                }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionButtonText}>Submit</Text>
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
    zIndex: 1,
    fontSize: 14,
    textAlign: "center",
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
  infoCard: {
    marginTop: 16,
    backgroundColor: "#F0F9FF",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderTopWidth: 1,
    borderTopColor: "#2D82C6",
    borderLeftColor: "#2D82C6",
    borderRightColor: "#2D82C6",
    borderBottomColor: "#2D82C6",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#333",
    flexShrink: 1,
  },
  infoHighlight: {
    fontWeight: "bold",
    color: "#1C6DD0",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#cce3f5",
    marginVertical: 10,
  },
  tipHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
    marginBottom: 2,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 6,
  },
  actionButtonModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D82C6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginVertical: 6,
    flexWrap: "nowrap",
  },
});
