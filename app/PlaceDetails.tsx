import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Animated,
  useColorScheme,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useContext } from "react";
import { router, Stack } from "expo-router";
// import dataPlaceDetails from "@/dataPlaceDetails.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Place } from "@/interfaces/placeDetails";
import { NewModalPlaceActions } from "@/components/newModalPlaceActions";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import { useMapMatching, usePlaceNavigate } from "@/hooks/maps/usemaps";
import { useLocation } from "@/hooks/location/useLocation";
import FormCharactersRestaurant from "@/components/formsContribution/FormCharactersRestaurant";
import FormCommentsPlaceDetails from "@/components/FormCommentsPlaceDetails";

const { width } = Dimensions.get("window");

export default function PlaceDetails() {
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const route = useRoute();
  const navigation = useNavigation();
  const { placeIdProvider } = route.params as { placeIdProvider: string };
  const scrollX = new Animated.Value(0);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [dataPlaceDetails, setDataPlaceDetails] = useState<Place | null>(null);
  const [viewNavigationModal, setViewNavigationModal] = useState(false);
  const [viewCommentsModal, setViewCommentsModal] = useState(false);
  const [viewContributionModal, setViewContributionModal] = useState(false);

  const { location } = useLocation();
  const { setIsNavigating, place } = usePlaceNavigateContext();
  const { navigatePlace } = usePlaceNavigate();
  const { getMapMatchedLocation } = useMapMatching();

  const reviews = [
    {
      id: "1",
      user: {
        name: "Jennifer K.",
        avatar:
          "https://api.a0.dev/assets/image?text=woman%20portrait%20professional&aspect=1:1&seed=231",
      },
      rating: 5,
      date: "January 15, 2025",
      text: "Absolutely breathtaking! The ocean view from our room was spectacular, and the staff went above and beyond to make our stay memorable.",
    },
    {
      id: "2",
      user: {
        name: "Michael T.",
        avatar:
          "https://api.a0.dev/assets/image?text=man%20portrait%20business&aspect=1:1&seed=657",
      },
      rating: 4,
      date: "December 28, 2024",
      text: "Great property with excellent amenities. The only reason for 4 stars instead of 5 is that the restaurant was closed for renovation during our stay.",
    },
    {
      id: "3",
      user: {
        name: "Sarah L.",
        avatar:
          "https://api.a0.dev/assets/image?text=woman%20portrait%20casual&aspect=1:1&seed=987",
      },
      rating: 5,
      date: "February 2, 2025",
      text: "Perfect weekend getaway. The spa services were incredible and the beachfront location is unbeatable.",
    },
  ];

  const amenities = [
    { icon: "wifi", name: "Free WiFi" },
    { icon: "pool", name: "Swimming Pool" },
    { icon: "utensils", name: "Restaurant" },
    { icon: "spa", name: "Spa Services" },
    { icon: "parking", name: "Free Parking" },
    { icon: "concierge-bell", name: "Concierge" },
  ];

  useEffect(() => {
    const getDetailsPlace = async () => {
      const token = await AsyncStorage.getItem("jwt");

      const response = await fetch(
        // `http://192.168.1.6:8080/api/place-details?place_id=${placeIdProvider}&lang=es`,
        `https://back-new-place-production.up.railway.app/api/place-details?place_id=${placeIdProvider}&lang=es`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setDataPlaceDetails({
        ...data,
        reviews: [...data.comments, ...data.reviews],
      });
    };

    getDetailsPlace();
  }, [placeIdProvider]);

  const navigateExternalApp = () => {
    const lat = dataPlaceDetails?.geometry?.location?.lat;
    const lng = dataPlaceDetails?.geometry?.location?.lng;
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

  const handleNavigatePlace = async () => {
    setViewNavigationModal(false);
    setIsNavigating(true);

    if (location) {
      navigatePlace(
        [location.coords.longitude, location.coords.latitude],
        // [-75.606303, 6.203676],
        [place.lon, place.lat]
      );
      getMapMatchedLocation();
      router.push("/NavigateDriver");
    } else {
      console.log("No se pudo obtener la ubicación actual");
    }
  };

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const secondaryTextColor = useThemeColor({}, "subtext");

  if (!dataPlaceDetails) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Place Details
        </Text>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => setBookmarked(!bookmarked)}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={bookmarked ? "#FF385C" : textColor}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageGalleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {dataPlaceDetails?.photos?.length > 0 ? (
              dataPlaceDetails?.photos?.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))
            ) : (
              <Image
                source={{
                  uri: "https://api.a0.dev/assets/image?text=Una ilustración minimalista y moderna de una pantalla de error '404 Not Found'. La imagen muestra un paisaje digital desolado con un letrero roto que dice '404'. Un pequeño robot con una expresión confundida revisa el letrero, mientras que en el fondo hay una atmósfera futurista con tonos azulados y morados. La escena transmite una sensación de exploración y pérdida, pero con un toque amigable y tecnológico.&aspect =16:9",
                }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            )}
          </ScrollView>

          {dataPlaceDetails?.photos?.length > 1 && (
            <View style={styles.pagination}>
              {dataPlaceDetails?.photos?.map((_, i) => {
                const opacity = scrollX.interpolate({
                  inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={i}
                    style={[
                      styles.paginationDot,
                      { opacity, backgroundColor: "#FFFFFF" },
                    ]}
                  />
                );
              })}
            </View>
          )}
        </View>

        <View style={[styles.detailsCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.placeName, { color: textColor }]}>
            {dataPlaceDetails.name}
          </Text>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={24} color="#FF385C" />
            <Text style={[styles.locationText, { color: secondaryTextColor }]}>
              {dataPlaceDetails.formatted_address}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.starRating}>
              {[1, 2, 3, 4, 5]?.map((star) => {
                let iconName: "star-outline" | "star" | "star-half" =
                  "star-outline"; // Estrella vacía

                if (star <= dataPlaceDetails.rating) {
                  iconName = "star"; // Estrella llena
                } else if (star - 0.5 <= dataPlaceDetails.rating) {
                  iconName = "star-half"; // Media estrella
                }

                return (
                  <Ionicons
                    key={star}
                    name={iconName}
                    size={18}
                    color={dataPlaceDetails.rating ? "#FFD700" : "#CCCCCC"}
                  />
                );
              })}

              <Text style={[styles.ratingText, { color: textColor }]}>
                {dataPlaceDetails?.rating?.toFixed(1)}
              </Text>
            </View>
            <Text style={[styles.reviewCount, { color: secondaryTextColor }]}>
              ({dataPlaceDetails.user_ratings_total} reviews)
            </Text>
          </View>

          <View style={styles.divider} />

          {dataPlaceDetails?.editorial_summary?.overview && (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Description
              </Text>
              <Text style={[styles.description, { color: secondaryTextColor }]}>
                {dataPlaceDetails?.editorial_summary?.overview}

                {"\n\n"}
              </Text>
            </>
          )}

          {dataPlaceDetails?.opening_hours?.weekday_text?.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Opening Hours
              </Text>
            </View>
          )}
          {dataPlaceDetails?.opening_hours?.weekday_text?.map((day, index) => {
            const today = new Date().getDay();

            return (
              <View style={styles.openingHoursRow} key={index}>
                <Ionicons name="today" size={24} color="#FF385C" />
                <Text
                  key={index}
                  style={[
                    styles.openingHours,
                    {
                      color:
                        index === today - 1 ? "#FF385C" : secondaryTextColor,
                      fontWeight: index === today - 1 ? "bold" : "normal",
                      fontStyle: index === today - 1 ? "italic" : "normal",
                      fontSize: index === today - 1 ? 16 : 14,
                    },
                  ]}
                >
                  {day}
                </Text>
              </View>
            );
          })}
          {dataPlaceDetails?.opening_hours?.weekday_text?.length > 0 && (
            <View style={styles.divider} />
          )}

          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Amenities
          </Text>
          <View style={styles.amenitiesGrid}>
            {dataPlaceDetails.types?.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <AntDesign name="enviroment" size={24} color="#FF385C" />
                <Text
                  style={[styles.amenityText, { color: secondaryTextColor }]}
                >
                  {amenity}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Reviews
          </Text>
          {dataPlaceDetails?.reviews &&
            dataPlaceDetails?.reviews
              ?.slice(
                0,
                reviewsExpanded ? dataPlaceDetails?.reviews?.length : 1
              )
              ?.map((review) => (
                <View key={review.time} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.profile_photo_url }}
                      style={styles.reviewerAvatar}
                    />
                    <View style={styles.reviewerInfo}>
                      <Text style={[styles.reviewerName, { color: textColor }]}>
                        {review.author_name}
                      </Text>
                      <View style={styles.reviewMeta}>
                        <View style={styles.miniStarRating}>
                          {[...Array(5)]?.map((_, i) => (
                            <Ionicons
                              key={i}
                              name="star"
                              size={12}
                              color={
                                i < review.rating
                                  ? "#FFD700"
                                  : secondaryTextColor
                              }
                            />
                          ))}
                        </View>
                        <Text
                          style={[
                            styles.reviewDate,
                            { color: secondaryTextColor },
                          ]}
                        >
                          {review.relative_time_description}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={[styles.reviewText, { color: secondaryTextColor }]}
                  >
                    {review.text}
                  </Text>
                </View>
              ))}

          {dataPlaceDetails?.reviews?.length > 1 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setReviewsExpanded(!reviewsExpanded)}
            >
              <Text style={[styles.expandButtonText, { color: "#FF385C" }]}>
                {reviewsExpanded
                  ? "Show less"
                  : `Show all ${dataPlaceDetails?.reviews?.length} reviews`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: cardColor }]}>
        <TouchableOpacity
          style={[
            styles.directionsButton,
            {
              backgroundColor: cardColor,
              borderColor: "#FF385C",
              borderWidth: 1,
            },
          ]}
          onPress={() => setViewCommentsModal(true)}
        >
          <Text style={[styles.directionsButtonText, { color: textColor }]}>
            Comentar
          </Text>
          <MaterialCommunityIcons
            name="comment-bookmark-outline"
            size={18}
            color={textColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.directionsButton,
            {
              backgroundColor: cardColor,
              borderColor: "#FF385C",
              borderWidth: 1,
            },
          ]}
          onPress={() => setViewContributionModal(true)}
        >
          <Text style={[styles.directionsButtonText, { color: textColor }]}>
            Contribution
          </Text>
          <MaterialIcons name="star-outline" size={18} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => setViewNavigationModal(true)}
        >
          <Text style={styles.directionsButtonText}>Directions</Text>
          <MaterialIcons name="directions" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {viewCommentsModal && (
        <NewModalPlaceActions
          dispatch={setViewCommentsModal}
          heightInitial={500}
          heightExpanded={500}
        >
          <FormCommentsPlaceDetails
            placeId={dataPlaceDetails?.place_id}
            setModalVisible={setViewCommentsModal}
          />
        </NewModalPlaceActions>
      )}

      {viewContributionModal && (
        <NewModalPlaceActions
          dispatch={setViewContributionModal}
          heightInitial={800}
          heightExpanded={800}
        >
          <FormCharactersRestaurant
            placeId={dataPlaceDetails?.place_id}
            setModalVisible={setViewContributionModal}
          />
        </NewModalPlaceActions>
      )}

      {viewNavigationModal && (
        <NewModalPlaceActions
          dispatch={setViewNavigationModal}
          heightInitial={200}
          heightExpanded={200}
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: textColor,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                },
              ]}
            >
              Como Quieres Viajar?
            </Text>
            <View style={styles.actionButtonsContainer}>
              <Pressable
                onPress={handleNavigatePlace}
                style={[styles.actionButton, { backgroundColor: "#FF385C" }]}
              >
                <Ionicons name="navigate" size={24} color="white" />
                <Text
                  style={[{ color: "white", fontSize: 16, fontWeight: "bold" }]}
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
                <Ionicons name="navigate" size={24} color={textColor} />
                <Text
                  style={[
                    { color: textColor, fontSize: 16, fontWeight: "bold" },
                  ]}
                >
                  App Externa
                </Text>
              </Pressable>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  bookmarkButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageGalleryContainer: {
    height: 300,
    position: "relative",
  },
  galleryImage: {
    width,
    height: 300,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 23,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  detailsCard: {
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  starRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#FF385C",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  openingHoursRow: {
    flexDirection: "row",
    gap: 14,
  },
  openingHours: {
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 16,
  },
  amenityText: {
    fontSize: 14,
    marginLeft: 8,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniStarRating: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  expandButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF385C",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: 120,
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 10,
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
});
