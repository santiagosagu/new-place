import ViewMap from "@/components/viewMap";
import ViewMapMapbox from "@/components/viewMapMapbox";
import { useLocation } from "@/hooks/location/useLocation";
import { useFetchData } from "@/hooks/maps/usemaps";
import { Navigator, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import i18n from "@/i18n";
import { ActivityIndicator, StyleSheet, Text, View, Image } from "react-native";
import * as Location from "expo-location";
import Rive, { RiveRef } from "rive-react-native";
import { Pressable } from "react-native-gesture-handler";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";

export default function ViewMapsCategory() {
  const { title, categoryMap, valueCategoryMap, query } =
    useLocalSearchParams();

  console.log(title);

  const { location } = useLocation();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [resultPlaces, setResultPlaces] = useState<any>([]);

  const riveRef = useRef<RiveRef>(null);

  const { place, isNavigating } = usePlaceNavigateContext();

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

  useEffect(() => {
    if (riveRef.current) {
      handlePlay();
    }
  }, []);

  const handlePlay = () => {
    riveRef.current?.play();
  };

  useEffect(() => {
    let isToggled = 0;

    const interval = setInterval(() => {
      riveRef.current?.setInputState("State Machine 1", "Direction", isToggled);

      if (isToggled == 0) {
        isToggled = 1;
      } else if (isToggled == 1) {
        isToggled = -1;
      } else {
        isToggled = 0;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title:
            place && isNavigating
              ? place.name
              : i18n.t(`categoriasInternas.${title}`, { defaultValue: title }),
        }}
      />

      {(location && resultPlaces.length > 0) || (isNavigating && location) ? (
        <ViewMapMapbox
          data={resultPlaces}
          latitude={latitude}
          longitude={longitude}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#313131",
          }}
        >
          <View
            style={{
              width: 300,
              height: 300,
              borderRadius: 20,
              backgroundColor: "white",
              zIndex: 1000,
            }}
          >
            {/* <Rive
              autoplay
              ref={riveRef}
              url="https://public.rive.app/community/runtime-files/12610-23923-jungle-drive.riv"
              artboardName="Jungle Drive"
              stateMachineName="Jungle Drive"
              style={{ width: 300, height: 300, borderRadius: 20 }}
            ></Rive> */}
            <Rive
              autoplay
              ref={riveRef}
              url="https://public.rive.app/community/runtime-files/15421-29110-eath-animation.riv"
              artboardName="earth"
              stateMachineName="State Machine 1"
              style={{ width: 300, height: 300, borderRadius: 20 }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Loading places...
            </Text>
          </View>
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
  riveAnimation: {
    width: 300,
    height: 300,
  },
});
