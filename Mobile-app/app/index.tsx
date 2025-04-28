import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require("@/assets/images/road-background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome to{"\n"}Road damage{"\n"}detection system
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Do you have an account?{" "}
            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 30,
  },
  footer: {
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "#0C6CCB",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 90,
    borderRadius: 25,
    marginBottom: 35,
    elevation: 3,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 23,
    fontWeight: "600",
  },
  loginText: {
    color: "white",
    fontSize: 23,
    marginBottom: 35,
    fontWeight: "600",
  },
  loginLink: {
    color: "white",
    textDecorationLine: "underline",
  },
});
