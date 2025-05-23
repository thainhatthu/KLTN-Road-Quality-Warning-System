import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { stateList } from "../app/country";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAccountStore } from "@/stores/accountStore";
import profileApi from "@/services/userprofile.service";
import { UploadAvatarType } from "@/defination/types/profile.type";

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const profile = params?.profile ? JSON.parse(params.profile as string) : {};

  const [name, setName] = useState(profile?.fullname || "");
  const user = useAccountStore((state) => state.account);
  const [phone, setPhone] = useState(profile?.phonenumber || "");
  const [dob, setDob] = useState(
    profile?.birthday ? new Date(profile.birthday) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(profile?.gender || "");
  const [address, setAddress] = useState(profile?.location || "");
  const [state, setState] = useState(profile?.state || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const file = {
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || 'image/jpeg',
        name: result.assets[0].fileName || 'avatar.jpg',
      };
      console.log("Selected file:", file);

      const formData = new FormData();
      formData.append('file', file as any);
      console.log("Form data:", formData);

      try {
        await profileApi.uploadAvatar(formData);
        Alert.alert("Thành công", "Cập nhật avatar thành công");
      } catch (err) {
        console.error("❌ Upload thất bại:", err);
        Alert.alert("Lỗi", "Upload thất bại");
      }
    }
  };
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === "ios");
    setDob(currentDate);
  };

  const handleSave = async () => {
    try {
      const formData = {
        username: user?.username ?? "",
        fullname: name,
        phonenumber: phone,
        birthday: dob.toISOString().split("T")[0],
        gender: gender,
        location: address,
        state: state,
      };

      const res = await profileApi.editProfile(formData);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/banner-profile.png")}
          style={styles.banner}
        />
        <Text style={styles.title}>Edit profile</Text>
      </View>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
      <Image
        source={
          avatarUri
            ? { uri: avatarUri }
            : user?.avatar
            ? { uri: user.avatar }
            : require("@/assets/images/img_avatar.png")
        }
        style={styles.avatar}
      />
      <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
        <Ionicons name="pencil" size={14} color="#fff" />
      </TouchableOpacity>

      </View>

      <Text style={styles.name}>{user?.username ?? "User name"}</Text>
      <Text style={styles.sectionTitle}>Personalization</Text>
      <View style={styles.inputBox1}>
        <TextInput
          placeholder="Fullname"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#6E6D6D"
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholderTextColor="#6E6D6D"
        />
      </View>

      <Text style={styles.sectionTitle}>Other</Text>
      <View style={styles.inputBox2}>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, styles.dateInput]}
          >
            <Ionicons name="calendar-outline" size={18} />
            <Text style={{ marginLeft: 6 }}>{dob.toDateString()}</Text>
          </TouchableOpacity>

        <View style={[styles.input, { width: "48%", height: 40, justifyContent: "center", paddingVertical: 0, paddingHorizontal: 4 }]}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            dropdownIconColor="#6E6D6D"
          >
            <Picker.Item label="Select gender" value="" color="#6E6D6D" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
        </View>
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholderTextColor="#6E6D6D"
        />
        <View style={[styles.input, { height: 40, paddingHorizontal: 0, justifyContent: "center" }]}>
          <Picker
            selectedValue={state}
            onValueChange={(itemValue) => setState(itemValue)}
            style={{ height: undefined }}
            dropdownIconColor="#6E6D6D"
          >
            <Picker.Item label="Select state" value="" color="#6E6D6D" />
            {stateList.map((stateItem) => (
              <Picker.Item key={stateItem.key} label={stateItem.label} value={stateItem.label} />
            ))}
          </Picker>
        </View>
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
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
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
    alignItems: "center",
    height: "100%",
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
    right: 5,
    backgroundColor: "#2D82C6",
    borderRadius: 12,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 1,
    marginLeft: 150,
    marginTop: 60,
    position: "absolute",
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
    justifyContent: "flex-start",
    width: "90%",
  },
  inputBox1: {
    backgroundColor: "#E6F5FF",
    padding: 12,
    borderRadius: 12,
    height: 120,
    width: "90%",
    justifyContent: "space-between",
  },
    inputBox2: {
    backgroundColor: "#E6F5FF",
    padding: 12,
    borderRadius: 12,
    height: 170,
    width: "90%",
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
    marginTop: 40,
    justifyContent: "flex-end",
    width: "90%",
  },
  cancelButton: {
    borderColor: "#2D82C6",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelText: {
    color: "#2D82C6",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#2D82C6",
    paddingVertical: 10,
    paddingHorizontal: 25,
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
