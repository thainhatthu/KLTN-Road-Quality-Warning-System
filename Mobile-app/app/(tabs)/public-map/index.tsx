import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import type { LocationObjectCoords } from "expo-location";
import Header from "@/components/ui/header";
import LeafletMapWebView from "@/components/LeafletMapWebView";
import dataService from "@/services/data.service";
import { useBadRoutesStore } from "@/stores/badRoutesStore";
export default function PublicMapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [showBadRoutes, setShowBadRoutes] = useState(true);
  const [showNearby, setShowNearby] = useState(true);
  const { badRoutes, setBadRoutes } = useBadRoutesStore();
  const [nearbyDamagedRoads, setNearbyDamagedRoads] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchNearbyDamagedRoads(loc.coords);
    })();
  }, []);
  const fetchNearbyDamagedRoads = async (center: LocationObjectCoords) => {
    try {
      const res = (await dataService.getInfoRoads({ all: false })) as {
        data: { data: string[] };
      };
      const roads =
        res?.data?.data?.map((item: string) => JSON.parse(item)) ?? [];

      const threshold = 0.5; // km
      const isNear = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
      ) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371; // Earth radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };

      const nearby = roads.filter(
        (road: any) =>
          isNear(
            center.latitude,
            center.longitude,
            road.latitude,
            road.longitude
          ) < threshold
      );

      setNearbyDamagedRoads(nearby);
    } catch (err) {
      console.error("❌ Failed to fetch nearby damaged roads:", err);
    }
  };

  const handleToggleBadRoutes = async (value: boolean) => {
    setShowBadRoutes(value);

    if (value) {
      try {
        const res = (await dataService.getRouteMap()) as {
          data: { data: string[][] };
        };
        const raw = res?.data?.data;

        const parsed = Array.isArray(raw)
          ? raw.map((group: string[]) =>
              group.map((point: string) => {
                const [lat, lng] = point
                  .replace("(", "")
                  .replace(")", "")
                  .split(",")
                  .map((v) => parseFloat(v.trim()));
                return [lat, lng];
              })
            )
          : [];

        console.log("🧭 Parsed bad routes:", parsed);
        setBadRoutes(parsed); 
      } catch (error) {
        console.error("Error loading bad routes:", error);
      }
    } else {
      setBadRoutes([]); 
    }
  };
  return (
    <View style={styles.container}>
      <Header title="Public map" />
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
          <LeafletMapWebView
            location={location}
            badRoutes={badRoutes}
            style={{ height: 300 }}
            onMarkerClick={(data) => console.log("🟡 Marker clicked:", data)}
          />

          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => router.push("/full-map-public")}
          >
            <Ionicons name="expand-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>View Bad Routes</Text>
          <Switch
            value={showBadRoutes}
            onValueChange={handleToggleBadRoutes}
            trackColor={{ true: "#2D82C6", false: "#ccc" }}
          />
        </View>
        {showNearby && nearbyDamagedRoads.length > 0 && (
          <View style={styles.nearbyContainer}>
            <Text style={styles.nearbyTitle}>⚠️ Nearby damaged roads (within 1km)</Text>
            {nearbyDamagedRoads.map((r, idx) => (
              <View key={idx} style={styles.nearbyItem}>
                <Text style={styles.nearbyText}>
                  📍 {r.location || "Chưa rõ địa điểm"}
                </Text>
                <Text style={styles.nearbySub}>
                  {r.level || "Chưa xác định mức độ"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FF" },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  headerContainer: {
    backgroundColor: "#2D82C6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    height: 100,
  },
  banner: { width: "100%", height: 90, borderRadius: 12, resizeMode: "cover" },
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
  toggleLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  nearbyContainer: {
    backgroundColor: "#fffbe6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#facc15",
  },
  nearbyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#b45309",
    marginBottom: 6,
  },
  nearbyItem: {
    marginBottom: 6,
    paddingVertical: 4,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  nearbyText: {
    fontSize: 13,
    color: "#333",
  },
  nearbySub: {
    fontSize: 12,
    color: "#999",
  },
});
