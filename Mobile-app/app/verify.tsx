import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

export default function VerifyScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
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
          <Text style={styles.title}>Enter OTP</Text>
          <Image
            source={require("@/assets/images/verify-email.png")}
            style={styles.image}
          />
          <Text style={styles.subtitle}>
            OTP code has been sent to your email address
          </Text>
          <Text style={styles.emailText}>abcd@gmail.com</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          <Text style={styles.timerText}>00.30</Text>

          <Text style={styles.resendText}>
            Did you get the otp code? ?{" "}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F5FF",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#23038C",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  image: {
    height: 260,
    width: "100%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 24,
    color: "#000",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#AAA",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 15,
  },
  resendText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
  },
  resendLink: {
    fontWeight: "bold",
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#4F80E1",
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
