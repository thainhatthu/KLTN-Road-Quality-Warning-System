import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import userProfileService from "@/services/userprofile.service";
import { useAccountStore } from "@/stores/accountStore";
import authService from "@/services/auth.service";

const AlertModal = ({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.alertButton}>
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAccountStore((state) => state.account);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userProfileService.getProfile({});
        setProfile(res);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Text style={{ marginTop: 20 }}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/banner-profile.png")}
          style={styles.banner}
        />
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("@/assets/images/img_avatar.png")
          }
          style={styles.avatar}
        />
      </View>

      <Text style={styles.name}>{user?.username ?? "Username"}</Text>
      <Text style={styles.contributionText}>
        Has contributed {profile?.contribution ?? 0} pics from{" "}
        {profile?.created?.slice(0, 10) ?? "N/A"}
      </Text>

      <View style={styles.rowButtonContainer}>
        <TouchableOpacity
          style={[styles.editButton, { marginRight: 10 }]}
          onPress={() => router.push({ pathname: "/edit-profile", params: { profile: JSON.stringify(profile) } })}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
          <Text style={styles.editText}>Edit profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowChangePasswordModal(true);
          }}
        >
          <Ionicons name="lock-closed-outline" size={16} color="#fff" />
          <Text style={[styles.editText, { marginLeft: 6 }]}>
            Change Password
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalization</Text>
        <View style={styles.infoBox1}>
          <View style={styles.infoRow1}>
            <Ionicons name="information-circle-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Full name: {profile?.fullname ?? "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow1}>
            <Ionicons name="mail-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Email: {profile?.email ?? "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow1}>
            <Ionicons name="call-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Phone: {profile?.phonenumber ?? "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other</Text>
        <View style={styles.infoBox2}>
          <View style={styles.infoRow2}>
            <Ionicons name="calendar-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Date: {profile?.birthday ?? "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow2}>
            <Ionicons name="male-female-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Gender: {profile?.gender ?? "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow2}>
            <Ionicons name="location-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Address: {profile?.location ?? "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow2}>
            <Ionicons name="flag-outline" size={16} />
            <Text style={styles.infoLabel}>
              {" "}
              Country: {profile?.state ?? "N/A"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await authService.logout();
              router.replace("/login");
            } catch (err) {
              console.error("❌ Logout failed:", err);
            }
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={showChangePasswordModal}
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              placeholder="Current Password"
              secureTextEntry
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowChangePasswordModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                  if (newPassword.length < 6 || confirmPassword.length < 6) {
                    setAlertMessage(
                      "Password must be at least 6 characters long."
                    );
                    setAlertVisible(true);
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setAlertMessage(
                      "New password and confirm password do not match."
                    );
                    setAlertVisible(true);
                    return;
                  }

                  try {
                    const updatedPasswordData = {
                      email: user?.email ?? "",
                      current_password: currentPassword,
                      new_password: newPassword,
                      confirm_password: confirmPassword,
                    };

                    const res = await authService.changePass(
                      updatedPasswordData
                    );

                    setAlertMessage("Password updated successfully!");
                    setAlertVisible(true);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setShowChangePasswordModal(false);
                  } catch (error) {
                    console.error("❌ Error updating password:", error);
                    setAlertMessage(
                      "Failed to update password. Please try again."
                    );
                    setAlertVisible(true);
                  }
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 80,
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
  rowButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    height: 50,
  },
  editButton: {
    backgroundColor: "#066E15",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    backgroundColor: "#8C1216",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 1,
    marginLeft: 170,
    marginTop: 60,
    position: "absolute",
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
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
  infoBox1: {
    backgroundColor: "#E6F5FF",
    padding: 12,
    borderRadius: 12,
    height: 180,
    justifyContent: "space-between",
  },
  infoRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoBox2: {
    backgroundColor: "#E6F5FF",
    padding: 12,
    borderRadius: 12,
    height: 220,
    justifyContent: "space-between",
  },
  infoRow2: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D82C6",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },

  cancelButton: {
    borderColor: "#2D82C6",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9534F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },

  alertBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    elevation: 6,
  },
  alertMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  alertButton: {
    backgroundColor: "#2D82C6",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  alertButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
