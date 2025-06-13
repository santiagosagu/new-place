import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/hooks/navigation/types";

const { width } = Dimensions.get("window");

const SavedPlaces = ({
  theme,
  savePlaceData,
  loadingPlaces,
  errorSavePlaces,
}: {
  theme: any;
  savePlaceData: any;
  loadingPlaces: any;
  errorSavePlaces: any;
}) => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Tus places guardados
        </Text>
        {savePlaceData && savePlaceData?.length > 3 && (
          <TouchableOpacity onPress={() => navigation.navigate("SavedPlaces")}>
            <Text style={[styles.viewAllText, { color: "#FF385C" }]}>
              Ver todos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loadingPlaces && (
        <ActivityIndicator size="small" color={theme.primary} />
      )}

      {savePlaceData && savePlaceData.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {savePlaceData.slice(0, 3).map((item: any) => (
            <TouchableOpacity
              key={item._id}
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
              onPress={() => {
                //   setModalVisible(false);
                navigation.navigate("PlaceDetails", {
                  placeIdProvider: item.place._id,
                });
              }}
            >
              <Image
                source={{
                  uri: item.place.media,
                }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {item.place.name}
                </Text>
                <View style={styles.details}>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#FF385C"
                    />
                    <Text style={[styles.detailText, { color: theme.subtext }]}>
                      {item.saved_at}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#FF385C"
                    />
                    <Text style={[styles.detailText, { color: theme.subtext }]}>
                      {item.place.category}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: theme.cardBackground,
            borderRadius: 16,
            marginBottom: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#FF385C",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="bookmark-outline" size={30} color="#FFFFFF" />
          </View>
          <Text style={{ color: theme.text, fontWeight: "bold" }}>
            Aun no hay places guardados
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    textAlign: "center",
  },
  featuredSection: {
    marginBottom: 24,
  },
  container: {
    paddingRight: 16,
  },
  card: {
    width: width * 0.7,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 120,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default SavedPlaces;
