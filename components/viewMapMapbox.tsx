import Mapbox, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  MarkerView,
  ShapeSource,
} from "@rnmapbox/maps";
import { IconClose, IconLocationPoint, IconNavigation } from "./ui/iconsList";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalPlaceDetail from "./modalPlaceDetail";
import { useLocation } from "@/hooks/location/useLocation";
import { useHeadingFromRoute, usePlaceNavigate } from "../hooks/maps/usemaps";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

// @ts-ignore
import CompassHeading from "react-native-compass-heading";
import ListPlaceCard from "./listPlaceCard";
import { useThemeColor } from "@/hooks/useThemeColor";

interface itemMarker {
  id: string;
  name: string;
  cuisine: string;
  lat: number;
  lon: number;
  horario: string;
  phone: string;
  website: string;
}

export default function ViewMapMapbox({ data, latitude, longitude }: any) {
  const accesstoken =
    "pk.eyJ1IjoiczRndSIsImEiOiJjbDhwZHE2NDIxa2k4M3B0b3FsaXZydm02In0.plTbzb5jQBHgNvkiWE4h9w";
  Mapbox.setAccessToken(accesstoken);

  const [modalVisible, setModalVisible] = useState(false);
  const [heading, setHeading] = useState(0);
  const [seeInCards, setSeeInCards] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<Camera>(null);

  const backgroundTabTop = useThemeColor({}, "background");
  const colorText = useThemeColor({}, "text");

  const { location } = useLocation();
  const { navigatePlace, checkingRoute, cancelNavigation } = usePlaceNavigate();
  const { getHeadingFromRoute, findClosestPointIndex } = useHeadingFromRoute();
  const { route, instructionStep, isNavigating, setPlace, place } =
    usePlaceNavigateContext();

  const handleNavigatePlace = async () => {
    if (location) {
      navigatePlace(
        [location.coords.longitude, location.coords.latitude],
        // [-75.601843, 6.202858],
        [place.lon, place.lat]
      );
    } else {
      navigatePlace([longitude, latitude], [place.lon, place.lat]);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      cancelNavigation();
      if (cameraRef.current) {
        if (location) {
          cameraRef.current.setCamera({
            centerCoordinate: [
              location.coords.longitude,
              location.coords.latitude,
            ],
            animationDuration: 1000,
            zoomLevel: 12,
          });
        } else {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            animationDuration: 1000,
            zoomLevel: 12,
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (route.length > 0) {
      checkingRoute();
    }
  }, [route, location]);

  useEffect(() => {
    if (cameraRef.current && isNavigating) {
      if (location) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            location.coords.longitude,
            location.coords.latitude,
          ],
          animationDuration: 1000,
          zoomLevel: 18,
        });
      } else {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          animationDuration: 1000,
          zoomLevel: 18,
        });
      }
    }
  }, [location]);

  const centerCamera = () => {
    if (cameraRef.current && isNavigating) {
      if (location) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            location.coords.longitude,
            location.coords.latitude,
          ],
          animationDuration: 1000,
          zoomLevel: 18,
        });
      } else {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          animationDuration: 1000,
          zoomLevel: 18,
        });
      }
    }
  };

  useEffect(() => {
    if (route.length > 0 && location) {
      const index = findClosestPointIndex(route, [
        location.coords.longitude,
        location.coords.latitude,
      ]);
      const headingCalculate = getHeadingFromRoute(route, index);
      setHeading(headingCalculate);
    }
  }, [route, location]);

  if (seeInCards) {
    return (
      <>
        <ModalPlaceDetail
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigatePlace={handleNavigatePlace}
          setSeeInCards={setSeeInCards}
        />
        <View style={styles.containerButtonModeSelect}>
          <Pressable
            onPress={() => setSeeInCards(false)}
            style={[
              {
                flex: 1,
                justifyContent: "center",
                backgroundColor: backgroundTabTop,
                paddingVertical: 10,
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              },
              !seeInCards && { backgroundColor: "#049CE4" },
            ]}
          >
            <View>
              <Text
                style={{ fontSize: 20, color: colorText, textAlign: "center" }}
              >
                Ver en mapa
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => !isNavigating && setSeeInCards(true)}
            style={[
              {
                flex: 1,
                justifyContent: "center",
                backgroundColor: backgroundTabTop,
                paddingVertical: 10,
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              },
              seeInCards && { backgroundColor: "#049CE4" },
            ]}
          >
            <View>
              <Text
                style={{ fontSize: 20, color: colorText, textAlign: "center" }}
              >
                Ver en tarjetas
              </Text>
            </View>
          </Pressable>
        </View>
        <ListPlaceCard
          places={data}
          setModalVisible={setModalVisible}
          setPlace={setPlace}
        />
      </>
    );
  }

  return (
    <>
      <ModalPlaceDetail
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigatePlace={handleNavigatePlace}
        setSeeInCards={setSeeInCards}
      />
      {!isNavigating && (
        <View style={styles.containerButtonModeSelect}>
          <Pressable
            onPress={() => setSeeInCards(false)}
            style={[
              {
                flex: 1,
                justifyContent: "center",
                backgroundColor: backgroundTabTop,
                paddingVertical: 10,
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              },
              !seeInCards && { backgroundColor: "#049CE4" },
            ]}
          >
            <View>
              <Text
                style={{ fontSize: 20, color: colorText, textAlign: "center" }}
              >
                Ver en mapa
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => !isNavigating && setSeeInCards(true)}
            style={[
              {
                flex: 1,
                justifyContent: "center",
                backgroundColor: backgroundTabTop,
                paddingVertical: 10,
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              },
              seeInCards && { backgroundColor: "#049CE4" },
            ]}
          >
            <View>
              <Text
                style={{ fontSize: 20, color: colorText, textAlign: "center" }}
              >
                Ver en tarjetas
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
        <Camera
          ref={cameraRef}
          zoomLevel={isNavigating ? 18 : 12}
          animationDuration={1000}
          heading={heading}
          // heading={getHeadingFromRoute(route)}
          pitch={50}
          centerCoordinate={
            location && isNavigating
              ? [location.coords.longitude, location.coords.latitude]
              : [longitude, latitude]
          }
          animationMode="flyTo"
        />
        {/* {location && (
          <MarkerView
            coordinate={[location!.coords.longitude, location!.coords.latitude]}
            allowOverlap={true}
            allowOverlapWithPuck={true}
          >
            <IconNavigation />
          </MarkerView>
        )} */}
        {/* <UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          minDisplacement={0.1}
          androidRenderMode="gps"
          onUpdate={(location) => {
            console.log("mapbox location", location);
          }}
        /> */}
        <LocationPuck
          pulsing={{ isEnabled: true }}
          puckBearingEnabled
          puckBearing="course"
          androidRenderMode="gps"
        />

        {!isNavigating ? (
          data.map(
            (item: itemMarker) =>
              item.lat &&
              item.lon && (
                <MarkerView
                  id={item.id}
                  key={item.id}
                  coordinate={[Number(item.lon), Number(item.lat)]}
                  allowOverlap={true}
                  allowOverlapWithPuck={true}
                >
                  <Pressable
                    onPress={() => {
                      setModalVisible(true);
                      setPlace(item);
                    }}
                  >
                    <IconLocationPoint />
                  </Pressable>
                </MarkerView>
              )
          )
        ) : (
          <>
            <MarkerView
              coordinate={[place.lon, place.lat]}
              allowOverlap={true}
              allowOverlapWithPuck={true}
            >
              <IconLocationPoint />
            </MarkerView>

            <ShapeSource
              id="routeSource"
              lineMetrics
              shape={{
                properties: {},
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
              }}
            >
              <LineLayer
                id="exampleLineLayer"
                style={{
                  lineColor: "rgba(255, 255, 255, 0.6)",
                  lineCap: "round",
                  lineJoin: "round",
                  lineWidth: 7,
                }}
              />
            </ShapeSource>
          </>
        )}
      </MapView>
      {isNavigating && (
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={[215, 500]}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View style={styles.containerInstruction}>
              <Text style={styles.instructionText}>{instructionStep}</Text>
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}
              >
                <IconClose />
              </Pressable>
            </View>
            <Pressable onPress={centerCamera}>
              <View style={styles.containerButtonNavigation}>
                <View style={styles.buttonNavigation}>
                  <IconNavigation />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 0,
                  textAlign: "center",
                }}
              >
                Centrar
              </Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  containerButtonModeSelect: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  containerInstruction: {
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    // alignItems: "center",
    height: 70,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: "bold",
    width: "80%",
  },
  containerButtonNavigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
  },
  buttonNavigation: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
});
