import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { API_URL } from "@/configs";
import { getStoredUserInfo } from "@/utils/auth.util";
import Header from "@/components/ui/header";
import dataService from "@/services/data.service";
import moment from "moment";

export default function HomeScreen() {
  const [history, setHistory] = useState<
    {
      id: number;
      level: string;
      created_at: string;
      location: string;
      latitude: number;
      longitude: number;
      image: string;
    }[]
  >([]);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = await getStoredUserInfo();
        if (!user?.id) return;

        const res = (await dataService.getInfoRoads({
          user_id: user.id,
          all: true,
        })) as {
          data: { data: string[] };
        };

        const parsedHistory = res.data.data.map((item) => {
          const parsedItem = JSON.parse(item);
          const imageURL = `${API_URL}${parsedItem.filepath}`;
          return { ...parsedItem, image: imageURL };
        });

        setHistory(parsedHistory);
      } catch (error) {
        console.error("Lỗi tải dữ liệu lịch sử:", error);
      }
    };

    fetchHistory();

    const intervalId = setInterval(fetchHistory, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredHistory = history.filter((item) =>
    item.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="History" />

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
          <Text style={styles.headerTitle}>See your upload history!</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by location..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#888"
        />

        {filteredHistory.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.label}>
                📍 <Text style={styles.value}>Address:</Text> {item.location}
              </Text>

              <View style={styles.latLngGroup}>
                <Text style={styles.label}>
                  📌 <Text style={styles.value}>Latitude:</Text> {item.latitude}
                </Text>
                <Text style={[styles.label, { paddingLeft: 20, marginTop: -3 }]}>
                  <Text style={styles.value}>Longitude:</Text> {item.longitude}
                </Text>
              </View>

              <Text style={styles.label}>
                🛣️ <Text style={styles.value}>Status:</Text>{" "}
                <Text
                  style={{
                    color:
                      item.level === "Good"
                        ? "#4CAF50"
                        : item.level === "Poor"
                        ? "#FF9800"
                        : item.level === "Very poor"
                        ? "#F44336"
                        : "#999",
                    fontWeight: "bold",
                  }}
                >
                  {item.level}
                </Text>
              </Text>

              <Text style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                Time Uploaded:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {moment(item.created_at).format("DD/MM/YYYY HH:mm")}
                </Text>
              </Text>
            </View>
          </View>
        ))}
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
    marginBottom: 16,
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
  searchInput: {
    height: 40,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#444",
    marginBottom: 6,
  },
  value: {
    fontWeight: "bold",
    color: "#222",
  },
  latLngGroup: {
    flexDirection: "column",
  },
});
