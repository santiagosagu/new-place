import { Tabs, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Image, Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "@/i18n";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconItinerary } from "@/components/ui/iconsList";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/useAuth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colorText = useThemeColor({}, "text");
  const backgroundHeader = useThemeColor({}, "backgroundHeader");

  const { checkoutStatusSesionWithToken } = useAuth();

  useFocusEffect(
    useCallback(() => {
      checkoutStatusSesionWithToken();

      return () => {};
    }, [])
  );

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          headerTitle: "New Place",
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          // tabBarStyle: Platform.select({
          //   ios: {
          //     // Use a transparent background on iOS to show the blur effect
          //     position: "absolute",
          //   },
          //   default: {},
          // }),
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

          tabBarStyle: {
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 12,
            paddingTop: 8,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 65,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: useThemeColor({}, "cardBackground"),
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          },
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
            title: "Explorar",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="explore" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="socialNetwork"
          options={{
            title: "Red",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Itineraries"
          options={{
            title: "Tus Itinerarios",
            tabBarIcon: ({ color }) => <IconItinerary color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
