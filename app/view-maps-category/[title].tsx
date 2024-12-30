import ViewMap from "@/components/viewMap";
import ViewMapMapbox from "@/components/viewMapMapbox";
import { useLocation } from "@/hooks/location/useLocation";
import { useFetchData } from "@/hooks/maps/usemaps";
import { Navigator, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import i18n from "@/i18n";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

export default function ViewMapsCategory() {
  const { title, categoryMap, valueCategoryMap, query } =
    useLocalSearchParams();

  const { location } = useLocation();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [resultPlaces, setResultPlaces] = useState<any>([]);

  useEffect(() => {
    if (location) {
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (latitude && longitude) {
        const data = await useFetchData(
          latitude,
          longitude,
          categoryMap.toString(),
          valueCategoryMap.toString(),
          query.toString()
        );
        setResultPlaces(data);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: i18n.t(`categoriasInternas.${title}`, { defaultValue: title }),
        }}
      />

      {/* <ViewMap data={restaurants} /> */}
      {location && resultPlaces.length > 0 && latitude && longitude ? (
        <ViewMapMapbox
          data={resultPlaces}
          latitude={latitude}
          longitude={longitude}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
