import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  useColorScheme,
  StatusBar,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useFocusEffect } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import RenderWeatherCard from "@/components/RenderWeatherCard";
import QuickAccess from "@/components/QuickAccess";
import FeaturedSection from "@/components/FeaturedSection";
import RedSocialSection from "@/components/RedSocialSection";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemColorScheme === "dark");

  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const { user } = useAuth();

  // Colores basados en el tema
  const theme = {
    background: useThemeColor({}, "background"),
    cardBackground: useThemeColor({}, "cardBackground"),
    primary: useThemeColor({}, "primary"),
    secondary: useThemeColor({}, "secondary"),
    text: useThemeColor({}, "text"),
    subtext: useThemeColor({}, "subtext"),
    border: darkMode ? "#333333" : "#E9ECEF",
    weatherGradient: darkMode ? ["#1E1E1E", "#252525"] : ["#4CC9F0", "#4361EE"],
    shadowColor: darkMode ? "#000000" : "#000000",
    statusBarStyle: darkMode ? "light-content" : "dark-content",
  };

  useEffect(() => {
    setDarkMode(systemColorScheme === "dark");
  }, [systemColorScheme]);

  //   const onRefresh = () => {
  //     setRefreshing(true);
  //     fetchWeather();
  //   };

  // console.log(user);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={theme.statusBarStyle as any} />

      {/* Header con botón de cambio de tema */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>
            ¡Hola, Viajero!
          </Text>
          <Text style={[styles.subGreeting, { color: theme.subtext }]}>
            ¿Qué descubrirás hoy?
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* Switch para cambiar el modo oscuro */}
          {/* <Switch
            trackColor={{ false: "#f4f3f3", true: "#50b7ef" }}
            thumbColor={darkMode ? "#f4f3f4" : "#ffffff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setDarkMode(!darkMode)}
            value={darkMode}
          /> */}

          <TouchableOpacity
            style={[
              styles.profileButton,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Ionicons name="person" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            // onRefresh={onRefresh}
            colors={[theme.primary]}
          />
        }
      >
        <RenderWeatherCard theme={theme} />
        <QuickAccess theme={theme} />

        <FeaturedSection theme={theme} />

        <RedSocialSection theme={theme} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subGreeting: {
    fontSize: 14,
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  bottomSpacer: {
    height: 70,
  },
});

export default HomeScreen;
