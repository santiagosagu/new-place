import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/hooks/navigation/types";
import { Stack } from "expo-router";
import { useSavePlaceData } from "@/services/home/useSavePlaceData";
import { RefreshControl } from "react-native-gesture-handler";
import { useSavePlaceDataPost } from "@/services/useSavePlacePost";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NewModalPlaceActions } from "@/components/newModalPlaceActions";

// Datos de muestra para lugares guardados
// const savedPlaces = [
//   {
//     id: "1",
//     name: "Casa de Playa",
//     location: "Cancún, México",
//     rating: 4.8,
//     image:
//       "https://api.a0.dev/assets/image?text=Casa de Playa en Cancún&aspect=16:9",
//   },
//   {
//     id: "2",
//     name: "Cabaña en el Bosque",
//     location: "Sierra Nevada, España",
//     rating: 4.7,
//     image:
//       "https://api.a0.dev/assets/image?text=Cabaña en el Bosque&aspect=16:9",
//   },
//   {
//     id: "3",
//     name: "Apartamento Céntrico",
//     location: "Barcelona, España",
//     rating: 4.9,
//     image:
//       "https://api.a0.dev/assets/image?text=Apartamento en Barcelona&aspect=16:9",
//   },
//   {
//     id: "4",
//     name: "Villa con Piscina",
//     location: "Tulum, México",
//     rating: 5.0,
//     image:
//       "https://api.a0.dev/assets/image?text=Villa en Tulum con Piscina&aspect=16:9",
//   },
//   {
//     id: "5",
//     name: "Loft Moderno",
//     location: "Ciudad de México, México",
//     rating: 4.6,
//     image: "https://api.a0.dev/assets/image?text=Loft Moderno CDMX&aspect=16:9",
//   },
// ];

// Componente de tarjeta para cada lugar guardado
const PlaceCard = ({
  place,
  setPlaceDelete,
  navigation,
  cardColor,
  textColor,
  setModalConfirmDeletePlace,
}: any) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={() => {
        //   setModalVisible(false);
        navigation.navigate("PlaceDetails", {
          placeIdProvider: place.place._id,
        });
      }}
    >
      <Image
        source={{ uri: place.place.media }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={[styles.cardContent, { backgroundColor: cardColor }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {place.place.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{place.place.ratingCount}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 200,
            gap: 10,
          }}
        >
          <Ionicons name="location-outline" size={24} color="#FF385C" />
          <Text
            style={[
              styles.cardLocation,
              { color: textColor, textTransform: "capitalize" },
            ]}
          >
            {place.place.category}
          </Text>
        </View>
        <View style={styles.cardActions}>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={18} color="#555" />
          </TouchableOpacity> */}
          <View style={{ flexDirection: "row", gap: 10, width: 200 }}>
            <Entypo name="back-in-time" size={24} color="#FF385C" />
            <Text style={{ color: textColor, textTransform: "capitalize" }}>
              {place.saved_at}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            // onPress={() => handleSavePlace(place.place._id)}
            onPress={() => {
              setModalConfirmDeletePlace(true);
              setPlaceDelete(place.place._id);
            }}
          >
            <Ionicons name="heart" size={30} color="#FF385C" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SavedPlacesScreen() {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [modalConfirmDeletePlace, setModalConfirmDeletePlace] = useState(false);
  const [placeDelete, setPlaceDelete] = useState(null);

  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "cardBackground");

  const {
    data: savePlaceData,
    loading: loadingSavePlaces,
    error: errorSavePlaces,
    setRefreshing: setRefreshingSavePlaces,
  } = useSavePlaceData();

  const { fetchData } = useSavePlaceDataPost();

  useEffect(() => {
    if (loadingSavePlaces) return;
    if (errorSavePlaces) {
      console.log("Error en index:", (errorSavePlaces as Error).message);
    } else {
      console.log("index", savePlaceData);
    }
  }, [savePlaceData, loadingSavePlaces, errorSavePlaces]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshingSavePlaces(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshingSavePlaces(false);
    }, 1000);
  };

  const handleSavePlace = () => {
    fetchData(placeDelete!);
    setRefreshing(true);
    setRefreshingSavePlaces(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshingSavePlaces(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: "Tus lugares",
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {savePlaceData && (
          <>
            {savePlaceData.map((place: any) => (
              <PlaceCard
                key={place.id}
                place={place}
                setPlaceDelete={setPlaceDelete}
                navigation={navigation}
                cardColor={cardColor}
                textColor={textColor}
                setModalConfirmDeletePlace={setModalConfirmDeletePlace}
              />
            ))}
          </>
        )}

        {!savePlaceData ||
          (savePlaceData && savePlaceData.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color="#FF385C" />
              <Text style={[styles.emptyText, { color: textColor }]}>
                No tienes lugares guardados
              </Text>
              <Text style={styles.emptySubtext}>
                Guarda tus lugares favoritos para acceder a ellos fácilmente
              </Text>
            </View>
          ))}
      </ScrollView>
      {modalConfirmDeletePlace && (
        <NewModalPlaceActions
          dispatch={setModalConfirmDeletePlace}
          heightInitial={200}
          heightExpanded={200}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 50,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{ color: textColor, fontSize: 18, textAlign: "center" }}
            >
              ¿Estás seguro de que deseas eliminar este lugar?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF385C",
                  padding: 10,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={() => {
                  // Aquí puedes agregar la lógica para eliminar el lugar

                  handleSavePlace();
                  setModalConfirmDeletePlace(false);
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#666",
                  padding: 10,
                  borderRadius: 8,
                }}
                onPress={() => {
                  setPlaceDelete(null);
                  setModalConfirmDeletePlace(false);
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </NewModalPlaceActions>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8f8f8",
  },

  filterButton: {
    padding: 5,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  cardLocation: {
    fontSize: 14,
    color: "#666",
    // marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "#555",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
});
