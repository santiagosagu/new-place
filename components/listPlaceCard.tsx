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
import { AntDesign, Ionicons } from "@expo/vector-icons";

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
    <View style={{ marginTop: 10, paddingBottom: 80 }}>
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.placeIdProvider}
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
              style={[styles.pressable, { backgroundColor }]}
            >
              <View style={styles.containerCard}>
                <Image
                  source={{
                    uri:
                      item.photos.length > 0
                        ? item.photos[0]
                        : "https://api.a0.dev/assets/image?text=Una ilustración minimalista y moderna de una pantalla de error '404 Not Found'. La imagen muestra un paisaje digital desolado con un letrero roto que dice '404'. Un pequeño robot con una expresión confundida revisa el letrero, mientras que en el fondo hay una atmósfera futurista con tonos azulados y morados. La escena transmite una sensación de exploración y pérdida, pero con un toque amigable y tecnológico.&aspect =16:9",
                  }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.name, { color: colorText }]}>
                    {item.name}
                  </Text>
                  {/* //TODO:falta logica si el lugar esta abierto o cerrado */}
                  {/* {item?.openingHours?.open_now ? (
                    <View
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 20,
                        backgroundColor: "#E8F5E9", // Verde claro para el fondo
                        borderColor: "#81C784", // Verde intermedio para el borde
                        borderWidth: 1,
                        alignSelf: "flex-start",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#388E3C", // Verde oscuro para el texto
                        }}
                      >
                        Abierto
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 20,
                        backgroundColor: "#FCE4EC", // Rojo claro para el fondo
                        borderColor: "#E57373", // Rojo intermedio para el borde
                        borderWidth: 1,
                        alignSelf: "flex-start",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#D32F2F", // Rojo oscuro para el texto
                        }}
                      >
                        Cerrado
                      </Text>
                    </View>
                  )} */}
                  <View
                    style={{
                      flexDirection: "row",
                      width: 100,
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#FF385C"
                    />
                    <Text style={[styles.distance, { color: colorText }]}>
                      {distance.toFixed(2)} km
                    </Text>
                  </View>
                  <View style={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <AntDesign
                        key={i}
                        name="star"
                        size={18}
                        color={
                          i < item.rating ? "#FFD700" : "#D3D3D3" // Amarillo para estrellas llenas, gris para vacías
                        }
                      />
                    ))}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colorText,
                        marginLeft: 4,
                      }}
                    >
                      reviews: ({item.ratingCount})
                    </Text>
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
  pressable: {
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  containerCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 19,
    fontWeight: "600",

    marginBottom: 5,
  },
  open: {
    color: "#388E3C",
    fontSize: 13,
  },
  closed: {
    color: "#FF385C",
    fontSize: 13,
  },
  distance: {
    fontSize: 13,
    marginVertical: 4,
  },
  rating: {
    flexDirection: "row",
    marginTop: 4,
  },
});
