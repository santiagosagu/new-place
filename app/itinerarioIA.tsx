import { IconArrow } from "@/components/ui/iconsList";
import { useItinerariosContext } from "@/context/itinerariosContext";
import { Link, router } from "expo-router";
import { useEffect, useRef } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { FlatList, Pressable } from "react-native-gesture-handler";
import Rive, { RiveRef } from "rive-react-native";
import data from "../dataItinerarios.json";
import CardDetailsItinerary from "@/components/cardDetailsItinerary";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ItinerioIA() {
  const { itinerarios } = useItinerariosContext();
  const riveRefMapitinerary = useRef<RiveRef>(null);
  const colorText = useThemeColor({}, "text");

  useEffect(() => {
    if (riveRefMapitinerary.current) {
      riveRefMapitinerary.current.play();
      riveRefMapitinerary.current.setInputState(
        "map_interactivity",
        "active",
        true
      );
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
      {/* <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Tus Itinerarios
      </Text> */}
      {/* <Link
        href={{
          pathname: "/createItinerario",
        }}
        asChild
      > */}
      <Pressable
        onPress={() => router.push("/createItinerario")}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.6 : 1,
          },
        ]}
      >
        <View
          style={{
            backgroundColor: "#049CE4",
            height: 100,
            flexDirection: "row",
            gap: 10,

            alignItems: "center",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginTop: 20,
          }}
        >
          <Image
            source={require("@/assets/images/map.png")}
            style={{ width: 80, height: 80 }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Crear Nuevo Itinerario
            </Text>
            <Text style={{ marginRight: 10 }}>
              <IconArrow color="white" />
            </Text>
          </View>
        </View>
      </Pressable>
      {/* </Link> */}
      {itinerarios.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ width: 100, height: 100, borderRadius: 20 }}>
            <Rive
              autoplay
              ref={riveRefMapitinerary}
              url="https://public.rive.app/community/runtime-files/1411-2755-travel-icons-pack.riv"
              artboardName="map"
              stateMachineName="map_interactivity"
              style={{ width: 100, height: 100, borderRadius: 20 }}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: colorText,
              fontWeight: "bold",
            }}
          >
            No tienes itinerarios creados.
          </Text>
        </View>
      ) : (
        <View style={{ marginTop: 20, flex: 1 }}>
          <Text
            style={{
              color: colorText,
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Tus Itinerarios.
          </Text>

          <FlatList
            data={itinerarios}
            style={{ height: "100%" }}
            renderItem={({ item }) => <CardDetailsItinerary item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
