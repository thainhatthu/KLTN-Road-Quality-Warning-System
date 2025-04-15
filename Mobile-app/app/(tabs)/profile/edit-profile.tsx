import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === "ios");
    setDob(currentDate);
  };

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
      <Text style={styles.sectionTitle}>Personalization</Text>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
      </View>

      <Text style={styles.sectionTitle}>Other</Text>
      <View style={styles.inputBox}>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, styles.dateInput]}
          >
            <Ionicons name="calendar-outline" size={18} />
            <Text style={{ marginLeft: 6 }}>{dob.toDateString()}</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            style={[styles.input, { width: "48%" }]}
          />
        </View>
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <TextInput
          placeholder="State"
          value={state}
          onChangeText={setState}
          style={styles.input}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  topBackground: {
    backgroundColor: "#2D82C6",
    height: 100,
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -60,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    bottom: 4,
    right: 115,
    backgroundColor: "#2D82C6",
    borderRadius: 12,
    padding: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D82C6",
    textAlign: "center",
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginTop: 24,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "#E6F5FF",
    padding: 12,
    borderRadius: 12,
    height: 180,
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelButton: {
    borderColor: "#2D82C6",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: {
    color: "#2D82C6",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#2D82C6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
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
