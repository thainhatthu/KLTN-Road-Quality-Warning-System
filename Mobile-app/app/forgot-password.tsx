import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import authService from "@/services/auth.service";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      await authService.forgotPass({ email });
      setSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Error sending reset email:", error);
      Alert.alert("Error", "Failed to send reset password. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/forgot-password.png")}
            style={styles.headerImage}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
              Don’t worry! Just enter your registered email to receive a new password.
          </Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send new password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={success}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSuccess(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>SEND SUCCESSFUL</Text>
            <Text style={styles.modalMessage}>
                A new password has been sent. Please login and update it.
            </Text>
            <Image
              source={require("@/assets/images/forgot.png")}
              style={styles.modalImage}
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                setSuccess(false);
                router.push("/login");
              }}
            >
              <Text style={styles.loginText}>LOGIN AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#E6F5FF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#E6F5FF",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "left",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4F80E1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: "hidden",
    paddingBottom: 20,
    alignItems: "center",
    width: "100%",
    marginBottom: 5,
  },
  headerImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#23038C",
    textAlign: "center",
    marginBottom: 10,
  },
  modalMessage: {
    color: "#153C71",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  modalImage: {
    width: 130,
    height: 130,
    marginBottom: 15,
    resizeMode: "contain",
  },
  loginButton: {
    backgroundColor: "#024296",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});