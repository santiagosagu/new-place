import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "@/i18n";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconItinerary } from "@/components/ui/iconsList";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colorText = useThemeColor({}, "text");
  const backgroundHeader = useThemeColor({}, "backgroundHeader");

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerTitle: "New Place",
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
          header: () => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                height: 100,
                paddingTop: 50,
                paddingHorizontal: 16,
                gap: 8,
                backgroundColor: backgroundHeader,

                shadowColor: colorText,
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Image
                source={require("../../assets/images/places.png")}
                style={{ width: 40, height: 40, marginBottom: 8 }}
              />
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: colorText }}
              >
                New Place
              </Text>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: i18n.t("tabs.inicio", { defaultValue: "Inicio" }),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            title: i18n.t("tabs.categorias", { defaultValue: "Categorías" }),
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="itinerarioIA"
          options={{
            title: "Tus Itinerarios",
            tabBarIcon: ({ color }) => <IconItinerary color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
