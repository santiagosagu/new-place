import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  useColorScheme,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";

export default function ItineraryDetails() {
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const navigation = useNavigation();
  const { ItineraryDetails } = useLocalSearchParams();

  const post: any = JSON.parse(ItineraryDetails as string);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Extended itinerary details - this would come from an API in a real app
  const fullItinerary: any = {
    title: post.title,
    creator: post.user.name,
    avatar: post.user.avatar,
    coverImage: post.coverImage,
    duration: post.duration,
    description:
      "A perfect weekend exploring the gorgeous city of Barcelona, from architectural wonders to delicious tapas and beautiful beaches.",
    days: [
      {
        day: 1,
        title: "Architectural Wonders",
        places: [
          {
            name: "La Sagrada Familia",
            time: "9:00 AM - 11:30 AM",
            description:
              "Start your Barcelona journey with Gaudí's masterpiece, the still-incomplete Sagrada Familia cathedral.",
            image:
              "https://api.a0.dev/assets/image?text=sagrada%20familia%20barcelona%20architecture&aspect=16:9&seed=111",
            location: "Carrer de Mallorca, 401, Barcelona",
            coords: { lat: 6.2330708, lng: -75.6036337 },
          },
          {
            name: "Lunch at La Paradeta",
            time: "12:00 PM - 1:30 PM",
            description:
              "Enjoy fresh seafood at this local favorite where you choose your seafood by weight.",
            image:
              "https://api.a0.dev/assets/image?text=seafood%20restaurant%20barcelona%20fresh&aspect=16:9&seed=222",
            location: "Carrer Comercial, 7, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Park Güell",
            time: "2:30 PM - 4:30 PM",
            description:
              "Explore this whimsical park designed by Gaudí with amazing views of the city.",
            image:
              "https://api.a0.dev/assets/image?text=park%20guell%20colorful%20mosaics%20barcelona&aspect=16:9&seed=333",
            location: "Park Güell, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Dinner at El Nacional",
            time: "8:00 PM - 10:00 PM",
            description:
              "Dine at this upscale food hall with multiple restaurants under one beautiful roof.",
            image:
              "https://api.a0.dev/assets/image?text=el%20nacional%20barcelona%20restaurant%20interior&aspect=16:9&seed=444",
            location: "Passeig de Gràcia, 24, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
        ],
      },
      {
        day: 2,
        title: "Historic Barcelona & Beach",
        places: [
          {
            name: "La Rambla & Boqueria Market",
            time: "10:00 AM - 12:00 PM",
            description:
              "Stroll down Barcelona's famous pedestrian street and visit the colorful food market.",
            image:
              "https://api.a0.dev/assets/image?text=la%20boqueria%20market%20colorful%20fruits&aspect=16:9&seed=555",
            location: "La Rambla, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Gothic Quarter",
            time: "12:30 PM - 2:30 PM",
            description:
              "Wander through the narrow medieval streets of Barcelona's Gothic Quarter.",
            image:
              "https://api.a0.dev/assets/image?text=gothic%20quarter%20barcelona%20narrow%20streets&aspect=16:9&seed=666",
            location: "Barri Gòtic, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Barceloneta Beach",
            time: "3:00 PM - 6:00 PM",
            description:
              "Relax on Barcelona's most popular beach and enjoy the Mediterranean Sea.",
            image:
              "https://api.a0.dev/assets/image?text=barceloneta%20beach%20sunny%20mediterranean&aspect=16:9&seed=777",
            location: "Barceloneta Beach, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
        ],
      },
      {
        day: 3,
        title: "Modern Art & Farewell",
        places: [
          {
            name: "Casa Batlló",
            time: "9:30 AM - 11:30 AM",
            description:
              "Visit another Gaudí masterpiece, the fantastical Casa Batlló apartment building.",
            image:
              "https://api.a0.dev/assets/image?text=casa%20batllo%20colorful%20facade%20barcelona&aspect=16:9&seed=888",
            location: "Passeig de Gràcia, 43, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Lunch at Ciudad Condal",
            time: "12:00 PM - 1:30 PM",
            description:
              "Enjoy some of the best tapas in Barcelona at this busy local restaurant.",
            image:
              "https://api.a0.dev/assets/image?text=tapas%20barcelona%20restaurant%20food&aspect=16:9&seed=999",
            location: "Rambla de Catalunya, 18, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Picasso Museum",
            time: "2:00 PM - 4:00 PM",
            description:
              "Explore the extensive collection of works by Pablo Picasso, especially from his early years.",
            image:
              "https://api.a0.dev/assets/image?text=picasso%20museum%20barcelona%20art&aspect=16:9&seed=1010",
            location: "Carrer Montcada, 15-23, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
          {
            name: "Farewell Dinner at El Xampanyet",
            time: "8:00 PM - 10:00 PM",
            description:
              "End your Barcelona trip with cava and tapas at this historic, lively bar.",
            image:
              "https://api.a0.dev/assets/image?text=traditional%20tapas%20bar%20barcelona%20crowded&aspect=16:9&seed=1111",
            location: "Carrer de Montcada, 22, Barcelona",
            coords: { lat: 41.387902, lng: 2.169984 },
          },
        ],
      },
    ],
  };

  const openMaps = (location: any) => {
    console.log(location);
    const url = `https://maps.google.com/?q=${location}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openMap = (lat, lng, name) => {
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

  const saveItinerary = () => {
    setBookmarked(!bookmarked);
    // In a real app, this would save the itinerary to the user's saved items
  };

  // Theming
  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5";
  const cardColor = theme === "dark" ? "#242424" : "#FFFFFF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const secondaryTextColor = theme === "dark" ? "#BBB" : "#666";
  const borderColor =
    theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const dayBgColor = theme === "dark" ? "#333" : "#f0f0f0";

  const [activeDay, setActiveDay] = useState(1);

  const handleDayPress = (day: number) => {
    setActiveDay(day);
  };

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
          Itinerary Details
        </Text>
        <TouchableOpacity style={styles.bookmarkButton} onPress={saveItinerary}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={bookmarked ? "#FF385C" : textColor}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: fullItinerary.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay}>
            <Text style={styles.itineraryTitle}>{fullItinerary.title}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.duration}>{fullItinerary.duration}</Text>
              <View style={styles.creatorInfo}>
                <Image
                  source={{ uri: fullItinerary.avatar }}
                  style={styles.creatorAvatar}
                />
                <Text style={styles.creatorName}>
                  by {fullItinerary.creator}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.contentCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Overview
          </Text>
          <Text style={[styles.description, { color: secondaryTextColor }]}>
            {fullItinerary.description}
          </Text>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <View
            style={[styles.daysNavContainer, { backgroundColor: cardColor }]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysNavContent}
            >
              {fullItinerary.days.map((day: any) => {
                return (
                  <TouchableOpacity
                    key={day.day}
                    style={[
                      styles.dayTab,
                      activeDay === day.day && styles.activeDayTab,
                    ]}
                    onPress={() => handleDayPress(day.day)}
                  >
                    <Text
                      style={[
                        styles.dayTabText,
                        activeDay === day.day && styles.activeDayTabText,
                      ]}
                    >
                      Día {day.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.daySection}>
            <View style={[styles.dayHeader, { backgroundColor: dayBgColor }]}>
              <View style={styles.dayNumberContainer}>
                <Text style={styles.dayNumber}>
                  Day {fullItinerary.days[activeDay - 1].day}
                </Text>
              </View>
              <Text style={[styles.dayTitle, { color: textColor }]}>
                {fullItinerary.days[activeDay - 1].title}
              </Text>
            </View>

            {fullItinerary.days[activeDay - 1].places.map(
              (place: any, placeIndex: number) => (
                <View
                  key={placeIndex}
                  style={[
                    styles.placeCard,
                    { borderColor: borderColor },
                    placeIndex ===
                      fullItinerary.days[activeDay - 1].places.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View style={styles.timelineIndicator}>
                    <View style={styles.timelineDot} />
                    {placeIndex <
                      fullItinerary.days[activeDay - 1].places.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: borderColor },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.placeContent}>
                    <Text
                      style={[styles.placeTime, { color: secondaryTextColor }]}
                    >
                      {place.time}
                    </Text>
                    <Text style={[styles.placeName, { color: textColor }]}>
                      {place.name}
                    </Text>

                    <Image
                      source={{ uri: place.image }}
                      style={styles.placeImage}
                      resizeMode="cover"
                    />

                    <Text
                      style={[
                        styles.placeDescription,
                        { color: secondaryTextColor },
                      ]}
                    >
                      {place.description}
                    </Text>

                    <View style={styles.placeActionsRow}>
                      <View style={styles.locationRow}>
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color="#FF385C"
                        />
                        <Text
                          style={[
                            styles.locationText,
                            { color: secondaryTextColor },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {place.location}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.directionsButton}
                        onPress={() =>
                          openMap(
                            place.coords.lat,
                            place.coords.lng,
                            place.name
                          )
                        }
                      >
                        <MaterialIcons
                          name="directions"
                          size={16}
                          color="#FFFFFF"
                        />
                        <Text style={styles.directionsButtonText}>Go</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: cardColor }]}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor }]}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color={liked ? "#FF385C" : textColor}
          />
          <Text style={[styles.actionButtonText, { color: textColor }]}>
            {liked ? "Liked" : "Like"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { borderColor }]}
          onPress={saveItinerary}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={bookmarked ? "#FF385C" : textColor}
          />
          <Text style={[styles.actionButtonText, { color: textColor }]}>
            {bookmarked ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.useItineraryButton}>
          <Text style={styles.useItineraryButtonText}>Use This Itinerary</Text>
        </TouchableOpacity>
      </View>
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
  coverImageContainer: {
    height: 200,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  itineraryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  duration: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorName: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  contentCard: {
    padding: 16,
    marginBottom: 80, // Space for bottom bar
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dayNumberContainer: {
    backgroundColor: "#FF385C",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  dayNumber: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  placeCard: {
    flexDirection: "row",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  timelineIndicator: {
    width: 20,
    alignItems: "center",
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF385C",
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  placeContent: {
    flex: 1,
  },
  placeTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  placeImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  placeActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF385C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 4,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 20,
  },
  actionButtonText: {
    marginLeft: 4,
    fontWeight: "500",
  },
  useItineraryButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  useItineraryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  daysNavContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    // height: 60,
    marginBottom: 16,
  },
  daysNavContent: {
    paddingHorizontal: 20,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F0F2F5",
  },
  activeDayTab: {
    backgroundColor: "#FF385C",
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  activeDayTabText: {
    color: "white",
  },
});
