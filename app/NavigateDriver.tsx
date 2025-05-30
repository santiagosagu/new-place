import ViewMapMapbox from "@/components/viewMapMapbox";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import { useLocation } from "@/hooks/location/useLocation";
import { router } from "expo-router";

import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function NavigateDriver() {
  const { place, isNavigating } = usePlaceNavigateContext();

  const { location } = useLocation();

  useEffect(() => {
    if (!isNavigating) {
      router.back();
    }
  }, [isNavigating]);

  if (!place) {
    return (
      <View style={{ flex: 1 }}>
        <Text>No hay información disponible</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isNavigating && location?.coords && (
        <ViewMapMapbox
          data={[place]}
          latitude={location.coords.latitude}
          longitude={location.coords.longitude}
        />
      )}
    </View>
  );
}
