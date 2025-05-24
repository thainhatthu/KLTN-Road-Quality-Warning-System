import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAccountStore } from "@/stores/accountStore";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const account = useAccountStore((state) => state.account);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/main-logo.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
        <Image
          source={
            account?.avatar
              ? { uri: account.avatar }
              : require("@/assets/images/main-logo.png")
          }
          style={styles.avatar}
        />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
  },
});
