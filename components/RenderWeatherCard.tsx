import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as RNLocalize from "react-native-localize";

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useLocation } from "@/hooks/location/useLocation";

const RenderWeatherCard = ({ theme }: { theme: any }) => {
  const [weather, setWeather] = useState<any>(null);
  const [night, setNight] = useState(false);
  const { location } = useLocation();

  const fetchClima = async () => {
    if (location) {
      const idiomaUser = RNLocalize.getLocales()[0].languageCode;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&units=metric&lang=${idiomaUser}&appid=0742652bbd26704d89c7dde84fd1417f&units=standard`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    if (location) {
      fetchClima();
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      // setTime(currentTime.toTimeString().split(" ")[0].slice(0, 5));

      if (hours >= 18) {
        setNight(true);
      } else {
        setNight(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!location && !weather) {
    return (
      <View
        style={[styles.weatherCard, { backgroundColor: theme.cardBackground }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!weather) return null;

  return (
    <LinearGradient
      colors={theme.weatherGradient as [string, string, ...string[]]}
      style={styles.weatherCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.weatherHeader}>
        <View>
          <Text style={styles.weatherLocation}>{weather.name}</Text>
          <Text style={styles.weatherDate}>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={night ? "weather-night" : "weather-sunny"}
          size={40}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.weatherInfo}>
        <Text style={styles.weatherTemp}>
          {Math.round(weather.main.temp)}°C
        </Text>
        <Text style={styles.weatherCondition}>
          {weather.weather[0].description}
        </Text>
      </View>

      <View style={styles.weatherDetails}>
        <View style={styles.weatherDetailItem}>
          <Feather name="droplet" size={18} color="#FFFFFF" />
          <Text style={styles.weatherDetailText}>{weather.main.humidity}%</Text>
          <Text style={styles.weatherDetailLabel}>Humedad</Text>
        </View>
        <View style={styles.weatherDetailItem}>
          <Feather name="wind" size={18} color="#FFFFFF" />
          <Text style={styles.weatherDetailText}>
            {weather.wind.speed} km/h
          </Text>
          <Text style={styles.weatherDetailLabel}>Viento</Text>
        </View>
      </View>
    </LinearGradient>
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
  weatherCard: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 200,
    justifyContent: "center",
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  weatherDate: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  weatherInfo: {
    marginTop: 20,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  weatherCondition: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  weatherDetails: {
    flexDirection: "row",
    marginTop: 20,
  },
  weatherDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  weatherDetailText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 6,
    marginRight: 4,
  },
  weatherDetailLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
});

export default RenderWeatherCard;
