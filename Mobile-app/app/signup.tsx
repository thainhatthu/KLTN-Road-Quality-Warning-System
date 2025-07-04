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
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import authService from "@/services/auth.service";

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const handleSignUpClick = async () => {
    try {
      if (!formData.username || !formData.email || !formData.password) {
        alert("Please fill in all fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const res = await authService.signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert("Sign up successful!");
      router.push({
        pathname: "/verify",
        params: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
      alert("Sign up failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/login-car.png")}
              style={styles.image}
            />
            <Text style={styles.title}>SIGN UP</Text>
          </View>

          <Text style={styles.subtitle}>Create your account!</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="abcabc"
            placeholderTextColor="#888"
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />

          <TextInput
            placeholder="abc@gmail.com"
            placeholderTextColor="#888"
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <TextInput
            placeholder="********"
            secureTextEntry
            placeholderTextColor="#888"
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />

          <TextInput
            placeholder="********"
            secureTextEntry
            placeholderTextColor="#888"
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSignUpClick}
          >
            <Text style={styles.loginButtonText}>Confirm</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.signupLink}>
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#E6F5FF",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    position: "relative",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
  },
  title: {
    position: "absolute",
    top: "8%",
    fontSize: 48,
    fontWeight: "bold",
    color: "#23038C",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#4F80E1",
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#4F80E1",
  },
  rememberText: {
    fontSize: 14,
    color: "#000",
  },
  forgotLink: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#4F80E1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 50,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#000",
    fontSize: 16,
  },
  signupLink: {
    color: "#4F80E1",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
