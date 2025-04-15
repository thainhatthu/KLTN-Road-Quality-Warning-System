import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/banner-profile.png")}
          style={styles.banner}
        />
      </View>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("@/assets/images/img_avatar.png")}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>User name</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/profile/edit-profile")}
      >
        <Text style={styles.editText}>Edit profile</Text>
      </TouchableOpacity>

      <Text style={styles.contributionText}>
        Has contributed 100 pics from 15/5/2022
      </Text>

      {/* Personalization Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalization</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} />
            <Text style={styles.infoLabel}> Full name:</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} />
            <Text style={styles.infoLabel}> Email:</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} />
            <Text style={styles.infoLabel}> Phone:</Text>
          </View>
        </View>
      </View>

      {/* Other Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other</Text>

        <View style={styles.infoBox}>
          <View style={[styles.rowBetween]}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} />
              <Text style={styles.infoLabel}> Date:</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="male-female-outline" size={16} />
              <Text style={styles.infoLabel}> Gender:</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} />
            <Text style={styles.infoLabel}> Address:</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="flag-outline" size={16} />
            <Text style={styles.infoLabel}> Country:</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 40,
    alignItems: "center",
    height: "100%",
  },
  avatarContainer: {
    marginTop: -60,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 4,
    right: 5,
    backgroundColor: "#2D82C6",
    borderRadius: 12,
    padding: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D82C6",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#2D82C6",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 6,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  contributionText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  section: {
    marginTop: 24,
    width: "90%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: "#E6F5FF",
    padding: 12,
    borderRadius: 12,
    height: 180,
    justifyContent: "space-between",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    marginLeft: 6,
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    backgroundColor: "#2D82C6",
    borderRadius: 12,
    marginBottom: 20,
    height: "20%",
    width: "100%",
  },
  banner: {
    width: "150%",
    height: 140,
    top: 60,
    resizeMode: "cover",
  },
});
