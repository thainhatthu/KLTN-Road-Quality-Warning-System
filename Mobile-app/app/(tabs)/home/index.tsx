import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const [showFullText, setShowFullText] = useState(false);
  const stepItems = [
    {
      image: require("@/assets/images/step-1.png"),
      title: "Detect the damage road",
      desc: "Take a photo and upload it using your account when you see damaged road.",
    },
    {
      image: require("@/assets/images/step-2.png"),
      title: "Receive result",
      desc: "Get instant feedback about the road condition from the system.",
    },
    {
      image: require("@/assets/images/step-3.png"),
      title: "Emergency fixing",
      desc: "Our repair team will arrive at the location to promptly fix the issue.",
    },
    {
      image: require("@/assets/images/step-4.png"),
      title: "Q&A Support",
      desc: "Ask any questions directly through our in-app support chatbox.",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/react-logo.png")}
            style={styles.icon}
          />
          <Text style={styles.mainTitle}>Home</Text>
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

        {/* Abstraction */}
        <Text style={styles.sectionTitle}>Abstraction</Text>
        <Image
          source={require("@/assets/images/road-crack.png")}
          style={styles.crackImage}
        />
        <Text
          style={styles.paragraph}
          numberOfLines={showFullText ? undefined : 3}
        >
          Cracks are common pavement distresses that seriously affect road
          safety and driving safety. For transportation agencies in most
          provinces and cities, maintaining high-quality road surfaces is one of
          the keys to maintaining road safety. The timely detection of pavement
          cracks is of great significance to prevent road damage and maintain
          traffic.
        </Text>
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => setShowFullText(!showFullText)}
        >
          <Text style={styles.seeMoreText}>
            {showFullText ? "See less ↑" : "See more →"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>How does this website work?</Text>

        <View style={styles.stepGrid}>
          {stepItems.map((item, index) => (
            <View style={styles.stepCard} key={index}>
              <Image source={item.image} style={styles.stepImageLarge} />
              <Text style={styles.stepLabel}>Step {index + 1}</Text>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDescGrid}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const stepImages = [
  require("@/assets/images/step-1.png"),
  require("@/assets/images/step-2.png"),
  require("@/assets/images/step-3.png"),
  require("@/assets/images/step-4.png"),
];

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
    backgroundColor: "#ffff",
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
    color: "#000000",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000000",
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
  crackImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 10,
  },
  seeMoreButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#298CFF",
    borderRadius: 20,
    marginBottom: 24,
  },
  seeMoreText: {
    color: "#fff",
    fontWeight: "600",
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  stepImage: {
    width: 100,
    height: 80,
    borderRadius: 10,
    resizeMode: "cover",
  },
  stepText: {
    flex: 1,
    justifyContent: "center",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D82C6",
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  stepGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  stepCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  stepImageLarge: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 8,
  },

  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D82C6",
    marginBottom: 4,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 4,
  },

  stepDescGrid: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
});
