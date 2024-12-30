import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconStar, IconStarFilled } from "./ui/iconsList";
import { useLocation } from "@/hooks/location/useLocation";
import { useThemeColor } from "@/hooks/useThemeColor";

const notImage = require("@/assets/images/notImage.png");

export default function ListPlaceCard({
  places,
  setModalVisible,
  setPlace,
}: any) {
  const { location } = useLocation();

  const backgroundColor = useThemeColor({}, "backgroundCard");
  const backgroundColorTransparent = useThemeColor(
    {},
    "backgroundCardTransparent"
  );
  const colorText = useThemeColor({}, "text");

  const haversineDistance = (coords1: any, coords2: any) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(coords2.latitude - coords1.latitude);
    const dLon = deg2rad(coords2.longitude - coords1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coords1.latitude)) *
        Math.cos(deg2rad(coords2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distancia en km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const sortedData = places.sort((a: any, b: any) => {
    const distanceA = haversineDistance(
      {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
      { latitude: a.lat, longitude: a.lon }
    );
    const distanceB = haversineDistance(
      {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
      { latitude: b.lat, longitude: b.lon }
    );
    return distanceA - distanceB;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const distance = haversineDistance(
            {
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            },
            { latitude: item.lat, longitude: item.lon }
          );

          //   console.log(distance);

          return (
            <Pressable
              onPress={() => {
                setPlace(item);
                setModalVisible(true);
              }}
              style={{
                backgroundColor: backgroundColor,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={[
                  styles.containerCard,
                  { backgroundColor: backgroundColorTransparent },
                ]}
              >
                <Image
                  source={notImage}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                />
                <View style={{ flex: 1, height: 100 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: colorText,
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.cuisine !== "No disponible" && (
                    <Text style={{ color: colorText }}>
                      Cuisine: {item.cuisine}
                    </Text>
                  )}
                  <Text style={{ color: colorText }}>
                    Distancia: {distance.toFixed(2)} km
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 3 }}>
                    <IconStar />
                    <IconStar />
                    <IconStar />
                    <IconStarFilled />
                    <IconStarFilled />
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerCard: {
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "rgba(128, 128, 128, 0.3)",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    gap: 6,
    borderRadius: 10,
    borderBottomRightRadius: 90,
    minHeight: 150,
  },
});
