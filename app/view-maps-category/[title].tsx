import ViewMapMapbox from "@/components/viewMapMapbox";
import { useLocation } from "@/hooks/location/useLocation";
import { useFetchData } from "@/hooks/maps/usemaps";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import i18n from "@/i18n";
import { StyleSheet, Text, View } from "react-native";
import Rive, { RiveRef } from "rive-react-native";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";

export default function ViewMapsCategory() {
  const { title, radius, type, keyword, contributions } =
    useLocalSearchParams();

  const { location } = useLocation();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [resultPlaces, setResultPlaces] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const riveRef = useRef<RiveRef>(null);
  const riveRefError = useRef<RiveRef>(null);

  useEffect(() => {
    if (error && riveRefError.current) {
      console.log("Error");
      riveRefError.current?.play();
    }
  }, [error]);

  const { place, isNavigating } = usePlaceNavigateContext();

  useEffect(() => {
    if (location) {
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataLoaded && latitude && longitude) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await useFetchData(
            latitude,
            longitude,
            radius.toString(),
            type.toString(),
            keyword.toString()
          );
          setResultPlaces(data);
          setDataLoaded(true);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al cargar los lugares"
          );
          console.error("Error al cargar lugares:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [latitude, longitude, dataLoaded]);

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

      {error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <View style={{ height: 350 }}>
            <Rive
              autoplay
              ref={riveRefError}
              url="https://public.rive.app/community/runtime-files/5613-11021-404-cat.riv"
              artboardName="404"
              stateMachineName="State Machine 1"
              style={{ width: 300, height: 300, borderRadius: 20 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFF1F1",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginTop: 16,
                maxWidth: "80%",
                borderWidth: 1,
                borderColor: "#FF385C",
                shadowColor: "#FF385C",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text style={{ marginRight: 8, color: "#FF385C", fontSize: 20 }}>
                ✕
              </Text>
              <Text
                style={{
                  color: "#FF385C",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            </View>
          </View>
        </View>
      ) : !isLoading && location ? (
        <ViewMapMapbox
          data={resultPlaces.places || []}
          latitude={latitude}
          longitude={longitude}
          title={title}
          category={type}
          contributions={contributions}
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
