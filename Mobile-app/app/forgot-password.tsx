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

export default function ForgotPasswordScreen() {
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
            Don't worry! A new password will be sent to your email.
          </Text>

          <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send new password</Text>
          </TouchableOpacity>
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
    color: "#55",
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
    backgroundColor: '#4F80E1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  root: {
    flex: 1,
    backgroundColor: '#E6F5FF', 
  },
  
});
