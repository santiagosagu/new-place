import Mapbox, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  MarkerView,
  ShapeSource,
  CustomLocationProvider,
  Terrain,
  Images,
} from "@rnmapbox/maps";
import { IconClose, IconNavigation } from "./ui/iconsList";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Animated,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalPlaceDetail from "./modalPlaceDetail";
import { useLocation } from "@/hooks/location/useLocation";
import {
  useHeadingFromRoute,
  useMapMatching,
  usePlaceNavigate,
} from "../hooks/maps/usemaps";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Speech from "expo-speech";

import ListPlaceCard from "./listPlaceCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import TravelingWithExternalApp from "./TravelingWithExternalApp";
import i18n from "@/i18n";
import { deactivateKeepAwake, useKeepAwake } from "expo-keep-awake";

// @ts-ignore
import navigateIMage from "../assets/images/gps.png";
import { NewModalPlaceActions } from "./newModalPlaceActions";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import AddNewPlaceForm from "./AddNewPlaceForm";
import RouteLine from "./mapsItems/routeLine";
import * as turf from "@turf/turf";
import Toast from "react-native-toast-message";
import { SnapbackZoom, ResumableZoom } from "react-native-zoom-toolkit";
import { Easing } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/hooks/navigation/types";

interface itemMarker {
  _id: string;
  name: string;
  cuisine: string;
  lat: number;
  lon: number;
  horario: string;
  phone: string;
  website: string;
}

export default function ViewMapMapbox({
  data,
  latitude,
  longitude,
  title,
  category,
  contributions,
}: any) {
  // const isDevelop = process.env.NODE_ENV === "development";

  // const accesstoken = !isDevelop
  //   ? process.env.PRIVATE_API_KEY_MAPBOX
  //   : process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const accesstoken =
    "pk.eyJ1IjoiczRndSIsImEiOiJjbDhwZHE2NDIxa2k4M3B0b3FsaXZydm02In0.plTbzb5jQBHgNvkiWE4h9w";

  // const accesstoken = process.env.PRIVATE_API_KEY_MAPBOX;
  Mapbox.setAccessToken(accesstoken!);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTraveling, setModalVisibleTraveling] = useState(false);
  const [modalNewPlace, setModalNewPlace] = useState(false);
  const [heading, setHeading] = useState(0);
  const [seeInCards, setSeeInCards] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [showTransportOptions, setShowTransportOptions] = useState(false);
  const [modeTraveling, setModeTraveling] = useState<any>("driving-traffic");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<Camera>(null);
  const imagesRef = useRef<Images>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current; // comienza un poco abajo

  const cardColor = useThemeColor({}, "cardBackground");
  const secondaryTextColor = useThemeColor({}, "subtext");
  const backgroundTabTop = useThemeColor({}, "background");
  const colorText = useThemeColor({}, "text");

  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const { location } = useLocation();
  const { navigatePlace, checkingRoute, cancelNavigation } = usePlaceNavigate();
  const { getHeadingFromRoute, findClosestPointIndex } = useHeadingFromRoute();
  // const { getMapMatchedLocation } = useMapMatching();

  const {
    place,
    route,
    alternateRoutes,
    dataAditionalTravel,
    instructions,
    instructionStep,
    isNavigating,
    currentInstruction,
    inOnRoute,
    matchedData,
    traficData,
    setPlace,
    setIsNavigating,
  } = usePlaceNavigateContext();

  const navigateExternalApp = () => {
    setModalVisible(false);
    const lat = place?.geometry?.location?.lat;
    const lng = place?.geometry?.location?.lng;
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url =
      Platform.OS === "ios"
        ? `${scheme}?q=${lat},${lng}&z=16`
        : `${scheme}${lat},${lng}?q=${lat},${lng}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback para web
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        );
      }
    });
  };

  useKeepAwake();
  useMapMatching();

  const handleNavigatePlace = async (
    mode: "walking" | "driving-traffic" | "cycling"
  ) => {
    setModeTraveling(mode);
    setSeeInCards(false);

    if (location) {
      setModalVisible(false);
      try {
        await navigatePlace(
          [location.coords.longitude, location.coords.latitude],
          [place.lon, place.lat],
          mode
        );
        setIsNavigating(true);
      } catch (error) {
        Toast.show({
          type: "error", // o "success", "info"
          text1: "Error al navegar",
          text2: `${(error as Error).message}`,
          position: "top",
          visibilityTime: 8000, // duración en milisegundos (6 segundos)
          text1Style: {
            fontSize: 18,
            fontWeight: "bold",
          },
          text2Style: {
            fontSize: 14,
          },
        });
      }
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setMapReady(false);
      if (cameraRef.current) {
        if (location) {
          cameraRef.current.setCamera({
            centerCoordinate: [
              location.coords.longitude,
              location.coords.latitude,
            ],
            animationDuration: 1000,
            zoomLevel: 14,
          });
        } else {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            animationDuration: 1000,
            zoomLevel: 14,
          });
        }
      }
    }
  }, []);

  // useEffect(() => {
  //   if (location && isNavigating) {
  //     console.log("hola");
  //     useMapMatching();
  //   }
  // }, [isNavigating, location]);
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, 400); // puedes ajustar este delay

      return () => clearTimeout(timeout);
    } else {
      fadeAnim.setValue(0);
      translateY.setValue(20);
    }
  }, [isNavigating]);

  useEffect(() => {
    if (route.length > 0 && instructions.length > 0) {
      checkingRoute();
    }
  }, [location]);

  useEffect(() => {
    if (cameraRef.current && isNavigating) {
      if (location) {
        cameraRef.current.setCamera({
          centerCoordinate: matchedData.lat
            ? [matchedData.lon, matchedData.lat]
            : [location.coords.longitude, location.coords.latitude],
          animationDuration: 1000,
          zoomLevel: 18,
        });
      } else {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          animationDuration: 1000,
          zoomLevel: 19,
        });
      }
    }
  }, [location]);

  const centerCamera = () => {
    if (cameraRef.current && isNavigating) {
      if (location) {
        cameraRef.current.setCamera({
          centerCoordinate: matchedData.lat
            ? [matchedData.lon, matchedData.lat]
            : [location.coords.longitude, location.coords.latitude],
          animationDuration: 1000,
          zoomLevel: 18,
        });
      } else {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          animationDuration: 1000,
          zoomLevel: 19,
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

  useEffect(() => {
    if (!inOnRoute && location && isNavigating) {
      navigatePlace(
        [location.coords.longitude, location.coords.latitude],
        // [-75.606303, 6.203676],
        [place.lon, place.lat],
        modeTraveling
      );
    }
  }, [inOnRoute, location, isNavigating]);

  const speak = () => {
    const thingToSay = "Comencemos nuestra ruta";
    Speech.speak(thingToSay);
  };

  const speakInstruction = () => {
    const thingToSay = instructionStep;
    Speech.speak(thingToSay);
  };
  useEffect(() => {
    Mapbox.locationManager.start();
    if (isNavigating) {
      speak();
    }
  }, [isNavigating]);

  useEffect(() => {
    if (isNavigating && instructionStep !== "No disponible") {
      speakInstruction();
    }
  }, [instructionStep]);

  useEffect(() => {
    if (imagesRef.current) {
      setTimeout(() => {
        setMapReady(true);
      }, 3000);
    } else {
      setMapReady(false);
    }
  }, [imagesRef.current]);

  useEffect(() => {
    if (modalVisible === false) {
      setShowTransportOptions(false);
    }
  }, [modalVisible]);

  function isUserNearRoute(
    userCoords: [number, number],
    routeCoords: [number, number][],
    maxDistanceMeters = 50
  ): boolean {
    const point = turf.point(userCoords);
    const line = turf.lineString(routeCoords);
    const distance = turf.pointToLineDistance(point, line, { units: "meters" });
    return distance <= maxDistanceMeters;
  }

  if (seeInCards) {
    return (
      <>
        {/* <ModalPlaceDetail
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalVisibleTraveling={modalVisibleTraveling}
          setModalVisibleTraveling={setModalVisibleTraveling}
          navigatePlace={handleNavigatePlace}
          setSeeInCards={setSeeInCards}
        /> */}
        {/* <TravelingWithExternalApp
          modalVisibleTraveling={modalVisibleTraveling}
          setModalVisibleTraveling={setModalVisibleTraveling}
        /> */}
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
                {i18n.t(`UI.ver en mapa`, { defaultValue: "Ver en mapa" })}
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
                {i18n.t(`UI.ver en tarjetas`, {
                  defaultValue: "Ver en tarjetas",
                })}
              </Text>
            </View>
          </Pressable>
        </View>
        <ListPlaceCard
          places={data}
          setModalVisible={setModalVisible}
          setPlace={setPlace}
        />
        {modalVisible && (
          <NewModalPlaceActions
            dispatch={setModalVisible}
            heightInitial={400}
            heightExpanded={400}
          >
            <View>
              <Text
                style={[
                  // styles.sectionTitle,
                  {
                    color: colorText,
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                  },
                ]}
              >
                {place.name}
              </Text>
              <View>
                <Image
                  source={{
                    uri:
                      place.photos.length > 0
                        ? place.photos[0]
                        : "https://api.a0.dev/assets/image?text=Una ilustración minimalista y moderna de una pantalla de error '404 Not Found'. La imagen muestra un paisaje digital desolado con un letrero roto que dice '404'. Un pequeño robot con una expresión confundida revisa el letrero, mientras que en el fondo hay una atmósfera futurista con tonos azulados y morados. La escena transmite una sensación de exploración y pérdida, pero con un toque amigable y tecnológico.&aspect =16:9",
                  }}
                  style={styles.image}
                />
                <View style={styles.actionButtonsContainer}>
                  {showTransportOptions ? (
                    <>
                      <Pressable
                        onPress={() => handleNavigatePlace("walking")}
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#4CAF50" },
                        ]}
                      >
                        <Ionicons name="walk" size={24} color="white" />
                        <Text style={styles.buttonText}>Caminar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleNavigatePlace("driving-traffic")}
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#2196F3" },
                        ]}
                      >
                        <Ionicons name="car" size={24} color="white" />
                        <Text style={styles.buttonText}>Carro</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleNavigatePlace("cycling")}
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#FF9800" },
                        ]}
                      >
                        <Ionicons name="bicycle" size={24} color="white" />
                        <Text style={styles.buttonText}>Bicicleta</Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Pressable
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate<any>("PlaceDetails", {
                            placeIdProvider: place._id,
                          });
                        }}
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: cardColor,
                            borderWidth: 1,
                            borderColor: "#FF385C",
                          },
                        ]}
                      >
                        <FontAwesome name="home" size={24} color={colorText} />
                        <Text
                          style={[
                            {
                              color: colorText,
                              fontSize: 16,
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          Detalles
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled
                        onPress={() => setShowTransportOptions(true)}
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#CCCCCC" },
                        ]}
                      >
                        <Ionicons name="navigate" size={24} color="white" />
                        <Text
                          style={[
                            {
                              color: "white",
                              fontSize: 16,
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          Navegar
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={navigateExternalApp}
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: cardColor,
                            borderWidth: 1,
                            borderColor: "#FF385C",
                          },
                        ]}
                      >
                        <Ionicons name="navigate" size={24} color={colorText} />
                        <Text
                          style={[
                            {
                              color: colorText,
                              fontSize: 16,
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          App Externa
                        </Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            </View>
          </NewModalPlaceActions>
        )}
      </>
    );
  }

  return (
    <>
      {/* <ModalPlaceDetail
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalVisibleTraveling={modalVisibleTraveling}
        setModalVisibleTraveling={setModalVisibleTraveling}
        navigatePlace={handleNavigatePlace}
        setSeeInCards={setSeeInCards}
      /> */}

      <TravelingWithExternalApp
        modalVisibleTraveling={modalVisibleTraveling}
        setModalVisibleTraveling={setModalVisibleTraveling}
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
                {i18n.t(`UI.ver en mapa`, { defaultValue: "Ver en mapa" })}
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
                {i18n.t(`UI.ver en tarjetas`, {
                  defaultValue: "Ver en tarjetas",
                })}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* mapbox://styles/mapbox/dark-v11 */}
      {/* mapbox://styles/mapbox/outdoors-v11 */}

      <MapView
        id="map"
        style={{ flex: 1 }}
        styleURL="mapbox://styles/s4gu/cm5iozsw7003601qpdhq7dkwn"
        logoEnabled={false}
        onPress={(feature: any) => {
          if (isNavigating) {
            return;
          }
          const coordinates = feature.geometry.coordinates;
          setSelectedPoint(null);
          setModalNewPlace(false);
          setTimeout(() => {
            setModalNewPlace(true);
            setSelectedPoint({
              longitude: coordinates[0],
              latitude: coordinates[1],
            });
          }, 0);
          console.log("Coordenadas seleccionadas:", coordinates);
        }}
      >
        {selectedPoint && modalNewPlace && (
          <MarkerView
            coordinate={[selectedPoint.longitude, selectedPoint.latitude]}
            allowOverlap={true}
            allowOverlapWithPuck={true}
          >
            <Image
              source={require("../assets/images/pin-map.png")}
              style={{ width: 40, height: 40 }}
            />
          </MarkerView>
        )}
        <Camera
          ref={cameraRef}
          zoomLevel={isNavigating ? 18 : 14}
          animationDuration={1000}
          heading={heading}
          followHeading={5}
          // heading={getHeadingFromRoute(route)}
          pitch={isNavigating ? 50 : 50}
          centerCoordinate={
            location && isNavigating && matchedData.lat
              ? [matchedData.lon, matchedData.lat]
              : [longitude, latitude]
          }
          // centerCoordinate={[2.2932, 48.86069]}
          animationMode="flyTo"
          maxZoomLevel={20}
          minZoomLevel={isNavigating ? 16 : 10}
        />

        <Images
          ref={imagesRef}
          images={{
            "puck-image": navigateIMage,
          }}
        />

        {location && (
          <>
            <CustomLocationProvider
              // coordinate={[location!.coords.longitude, location!.coords.latitude]}
              coordinate={
                matchedData.lon
                  ? [matchedData.lon, matchedData.lat]
                  : [location?.coords.longitude, location?.coords.latitude]
              }
              heading={location?.coords.heading ?? 0}
            />
          </>
        )}

        {/* {mapReady && ( */}

        {/* )} */}
        {/* {!isNavigating && (
          <LocationPuck
            pulsing={{
              isEnabled: true,
              color: "#2196F3",
              radius: "accuracy",
            }}
            visible
            puckBearingEnabled
            scale={["interpolate", ["linear"], ["zoom"], 14, 1, 20, 1]}
            puckBearing="heading"
            androidRenderMode="gps"
            // topImage={"puck-image"}
            // bearingImage={mapReady && isNavigating ? "puck-image-2" : ""}
          />
        )} */}

        {!isNavigating ? (
          data.map(
            (item: itemMarker) =>
              item.lat &&
              item.lon && (
                <MarkerView
                  id={item._id}
                  key={item._id}
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
                    {/* <IconLocationPoint /> */}
                    <Image
                      source={require("../assets/images/pin-map.png")}
                      style={{ width: 40, height: 40 }}
                    />
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
              {/* <IconLocationPoint /> */}
              <Image
                source={require("../assets/images/location.png")}
                style={{ width: 50, height: 50 }}
              />
            </MarkerView>

            <ShapeSource
              id="routeIntructionSource"
              lineMetrics
              shape={{
                properties: {},
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: currentInstruction,
                },
              }}
            >
              <LineLayer
                id="lineIntructionLayer"
                layerIndex={10}
                style={{
                  lineColor: "rgba(154, 230, 166, 0.9)",
                  // lineColor: "green",
                  lineCap: "round",
                  lineJoin: "round",
                  lineWidth: [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    2,
                    14,
                    5,
                    19,
                    20,
                    20,
                    12,
                  ],
                }}
              />
            </ShapeSource>

            {location && Object.keys(matchedData).length > 0 && (
              <>
                {alternateRoutes
                  .filter((route) =>
                    isUserNearRoute([matchedData.lon, matchedData.lat], route)
                  )
                  .map((alternateRoute, index) => {
                    const shape = {
                      type: "Feature" as const,
                      geometry: {
                        type: "LineString" as const,
                        coordinates: alternateRoute,
                      },
                      properties: {},
                    };

                    return (
                      <ShapeSource
                        key={`routeShape${index}`}
                        id={`routeShape${index}`}
                        lineMetrics
                        shape={shape}
                      >
                        {/* Borde (más grueso y opaco) */}
                        <LineLayer
                          id={`routeBorder${index}`}
                          layerIndex={10}
                          style={{
                            lineColor: "rgba(0,0,0, 1)", // fuerte
                            lineCap: "round",
                            lineJoin: "round",
                            lineWidth: [
                              "interpolate",
                              ["linear"],
                              ["zoom"],
                              10,
                              4, // más grueso que el interior
                              14,
                              8,
                              20,
                              20,
                            ],
                          }}
                        />

                        {/* Interior (más delgado y translúcido) */}
                        <LineLayer
                          id={`routeInterior${index}`}
                          layerIndex={11}
                          style={{
                            lineColor: "rgba(5, 200, 247, 0.8)", // semitransparente
                            lineCap: "round",
                            lineJoin: "round",
                            lineWidth: [
                              "interpolate",
                              ["linear"],
                              ["zoom"],
                              10,
                              2, // más delgado
                              14,
                              5,
                              20,
                              12,
                            ],
                          }}
                        />
                      </ShapeSource>
                    );
                  })}
              </>
            )}

            <RouteLine
              route={route}
              userLocation={{
                latitude: matchedData.lat
                  ? matchedData.lat
                  : location?.coords.latitude,
                longitude: matchedData.lon
                  ? matchedData.lon
                  : location?.coords.longitude,
              }}
              // userLocation={
              //   !location
              //     ? null
              //     : {
              //         latitude: location?.coords.latitude,
              //         longitude: location?.coords.longitude,
              //       }
              // }
            />
          </>
        )}
        {traficData.length > 0 && (
          <ShapeSource
            id="trafic"
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
              id="traficLineLayer"
              style={{
                lineColor: "red",
                lineCap: "round",
                lineJoin: "round",
                lineWidth: 7,
              }}
            />
          </ShapeSource>
        )}
        <LocationPuck
          pulsing={{
            isEnabled: true,
            color: "#000",
            radius: "accuracy",
          }}
          visible
          puckBearingEnabled
          scale={["interpolate", ["linear"], ["zoom"], 14, 0.2, 20, 0.3]}
          puckBearing="course"
          topImage={mapReady ? "puck-image" : ""}
          // bearingImage={mapReady && isNavigating ? "puck-image-2" : ""}
        />
      </MapView>
      {modalVisible && (
        <NewModalPlaceActions
          dispatch={setModalVisible}
          heightInitial={400}
          heightExpanded={400}
        >
          <View>
            <Text
              style={[
                // styles.sectionTitle,
                {
                  color: colorText,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                },
              ]}
            >
              {place.name}
            </Text>
            <View>
              <Image
                source={{
                  uri:
                    place.photos.length > 0
                      ? place.photos[0]
                      : "https://api.a0.dev/assets/image?text=Una ilustración minimalista y moderna de una pantalla de error '404 Not Found'. La imagen muestra un paisaje digital desolado con un letrero roto que dice '404'. Un pequeño robot con una expresión confundida revisa el letrero, mientras que en el fondo hay una atmósfera futurista con tonos azulados y morados. La escena transmite una sensación de exploración y pérdida, pero con un toque amigable y tecnológico.&aspect =16:9",
                }}
                style={styles.image}
              />
              <View style={styles.actionButtonsContainer}>
                {showTransportOptions ? (
                  <>
                    <Pressable
                      onPress={() => handleNavigatePlace("walking")}
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#4CAF50" },
                      ]}
                    >
                      <Ionicons name="walk" size={24} color="white" />
                      <Text style={styles.buttonText}>Caminar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleNavigatePlace("driving-traffic")}
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#2196F3" },
                      ]}
                    >
                      <Ionicons name="car" size={24} color="white" />
                      <Text style={styles.buttonText}>Carro</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleNavigatePlace("cycling")}
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#FF9800" },
                      ]}
                    >
                      <Ionicons name="bicycle" size={24} color="white" />
                      <Text style={styles.buttonText}>Bicicleta</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate<any>("PlaceDetails", {
                          placeIdProvider: place._id,
                        });
                      }}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: cardColor,
                          borderWidth: 1,
                          borderColor: "#FF385C",
                        },
                      ]}
                    >
                      <FontAwesome name="home" size={24} color={colorText} />
                      <Text
                        style={[
                          {
                            color: colorText,
                            fontSize: 16,
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        Detalles
                      </Text>
                    </Pressable>

                    <Pressable
                      disabled
                      onPress={() => setShowTransportOptions(true)}
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#CCCCCC" },
                      ]}
                    >
                      <Ionicons name="navigate" size={24} color="white" />
                      <Text
                        style={[
                          { color: "white", fontSize: 16, fontWeight: "bold" },
                        ]}
                      >
                        Navegar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={navigateExternalApp}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: cardColor,
                          borderWidth: 1,
                          borderColor: "#FF385C",
                        },
                      ]}
                    >
                      <Ionicons name="navigate" size={24} color={colorText} />
                      <Text
                        style={[
                          {
                            color: colorText,
                            fontSize: 16,
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        App Externa
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </View>
        </NewModalPlaceActions>
      )}

      {modalNewPlace && (
        <NewModalPlaceActions
          dispatch={setModalNewPlace}
          heightInitial={550}
          heightExpanded={550}
        >
          <AddNewPlaceForm
            category={category}
            selectedPoint={selectedPoint}
            dispatch={setModalNewPlace}
            title={title}
            contributions={contributions}
          />
        </NewModalPlaceActions>
      )}

      {isNavigating && (
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={[250, 500]}
        >
          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity: fadeAnim,
              flex: 1,
            }}
          >
            <BottomSheetView style={styles.contentContainer}>
              <View style={styles.containerInstruction}>
                <Text style={styles.instructionText}>{instructionStep}</Text>
                <Pressable
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    cancelNavigation();
                  }}
                >
                  <IconClose color="black" />
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

              {/* Distancia y duración mejor presentados */}
              {dataAditionalTravel && (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    marginTop: 20,
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: "#FF385C",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginRight: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <FontAwesome name="map-marker" size={18} color="#FF385C" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#000",
                        marginLeft: 8,
                      }}
                    >
                      {(dataAditionalTravel.distance / 1000).toFixed(2)} km
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: "#FF385C",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <FontAwesome name="clock-o" size={18} color="#FF385C" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#000",
                        marginLeft: 8,
                      }}
                    >
                      {Math.round(dataAditionalTravel.duration / 60)} min
                    </Text>
                  </View>
                </Animated.View>
              )}
            </BottomSheetView>
          </Animated.View>
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
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    minWidth: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    // backgroundColor: "#F0F0F0",
    marginTop: 10,
    borderRadius: 8,
    padding: 12,
    // height: 150,
    textAlignVertical: "top",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
