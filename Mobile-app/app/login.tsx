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
import z from "zod";
import { ERROR_MESSAGES } from "@/defination/consts/messages.const";
import { useRecoilState } from "recoil";
import { accountState } from "@/atoms/authState";
import authService from "@/services/auth.service";
import { API_URL } from "@/configs";
import { LoginDataType } from "@/defination/types/auth.type";
import { saveAccessToken, setStoredUserInfo } from "@/utils/auth.util";

const signInSchema = z.object({
  username: z.string().min(6, ERROR_MESSAGES.auth.username),
  password: z.string().min(6, ERROR_MESSAGES.auth.password),
});

type SignInData = z.infer<typeof signInSchema>;
export default function LoginScreen() {
  const [formData, setFormData] = useState<SignInData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [, setAccountState] = useRecoilState(accountState);
  // Handle input field changes
  const handleChange = (fieldName: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const [rememberMe, setRememberMe] = useState(false);
  const handleSignInClick = async () => {
    setError(null);

    const parseResult = signInSchema.safeParse(formData);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0].message;
      setError(errorMessage);
      return;
    }

    try {
      const data = await authService.signIn(formData);
      const { info, token } = data;

      if (info && token) {
        const user_avatar = `${API_URL}/user/api/getAvatar?username=${info.username}`;
        const fullInfo = { ...info, avatar: user_avatar };

        saveAccessToken(token);
        setStoredUserInfo(fullInfo); 
        setAccountState(fullInfo);

        router.push("/home"); 
      } else {
        console.error("Missing info or token");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password.");
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
            <Text style={styles.title}>LOGIN</Text>
          </View>

          <Text style={styles.subtitle}>
            Welcome Back, Please login to your account!
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="uit@gmail.com"
            placeholderTextColor="#888"
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="********"
            secureTextEntry
            placeholderTextColor="#888"
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />

          <View style={styles.rememberRow}>
            {/* Custom Checkbox */}
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxRow}
            >
              <View
                style={[
                  styles.checkboxBox,
                  rememberMe && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />
            <Link href="/forgot-password">
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </Link>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSignInClick}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Link href="/signup" style={styles.signupLink}>
              Sign up
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
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
  },
  title: {
    position: "absolute",
    top: "15%",
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
    marginBottom: 25,
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
    marginBottom: 4,
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
