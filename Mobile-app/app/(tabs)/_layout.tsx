import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="public-map/index"
        options={{
          title: "Public map",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol
              size={28}
              name="globe.asia.australia.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="private-map/index"
        options={{
          title: "Private map",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="lock.shield.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history/index"
        options={{
          title: "History",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="book.closed.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
