import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || "light");
  const navigation = useNavigation();

  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    // <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#121212" : "#F5F5F5" },
      ]}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#121212" : "#F5F5F5"}
      />

      <Header theme={theme} toggleTheme={toggleTheme} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StoryBar theme={theme} />
        <Feed theme={theme} navigation={navigation} />
      </ScrollView>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* <BottomNavBar theme={theme} navigation={navigation} /> */}
    </SafeAreaView>
    // </ThemeContext.Provider>
  );
}

function Header({ theme, toggleTheme }) {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme === "dark" ? "#121212" : "#F5F5F5" },
      ]}
    >
      <Text
        style={[
          styles.headerTitle,
          { color: theme === "dark" ? "#FFFFFF" : "#000000" },
        ]}
      >
        TravelSocial
      </Text>
      <View style={styles.headerIcons}>
        {/* <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={theme === "dark" ? "sunny-outline" : "moon-outline"}
            size={24}
            color={theme === "dark" ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.iconButton}>
          <Feather
            name="message-circle"
            size={24}
            color={theme === "dark" ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StoryBar({ theme }) {
  const stories = [
    { id: "add", name: "New", isAdd: true },
    {
      id: "1",
      name: "Paris",
      image:
        "https://api.a0.dev/assets/image?text=Paris%20Eiffel%20Tower%20glowing%20at%20sunset&aspect=1:1&seed=123",
    },
    {
      id: "2",
      name: "Rome",
      image:
        "https://api.a0.dev/assets/image?text=Rome%20Colosseum%20ancient%20architecture&aspect=1:1&seed=456",
    },
    {
      id: "3",
      name: "Bali",
      image:
        "https://api.a0.dev/assets/image?text=Bali%20beach%20sunset%20paradise&aspect=1:1&seed=789",
    },
    {
      id: "4",
      name: "NYC",
      image:
        "https://api.a0.dev/assets/image?text=New%20York%20City%20skyline%20urban&aspect=1:1&seed=101",
    },
    {
      id: "5",
      name: "Tokyo",
      image:
        "https://api.a0.dev/assets/image?text=Tokyo%20cityscape%20neon%20night&aspect=1:1&seed=112",
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storyBar}
      contentContainerStyle={styles.storyBarContent}
    >
      <Stack.Screen options={{ headerShown: false }} />
      {stories.map((story) => (
        <TouchableOpacity key={story.id} style={styles.storyItem}>
          <View
            style={[
              styles.storyCircle,
              {
                borderColor: theme === "dark" ? "#444" : "#ddd",
                backgroundColor: story.isAdd
                  ? theme === "dark"
                    ? "#333"
                    : "#f0f0f0"
                  : "transparent",
              },
            ]}
          >
            {story.isAdd ? (
              <Ionicons
                name="add"
                size={24}
                color={theme === "dark" ? "#FFFFFF" : "#000000"}
              />
            ) : (
              <Image source={{ uri: story.image }} style={styles.storyImage} />
            )}
          </View>
          <Text
            style={[
              styles.storyName,
              { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            ]}
          >
            {story.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function Feed({ theme, navigation }) {
  const [postsApi, setPostsApi] = useState([]);

  const posts = [
    {
      id: "1",
      type: "place",
      user: {
        name: "Alex Johnson",
        avatar:
          "https://api.a0.dev/assets/image?text=person%20profile%20picture%20traveler&aspect=1:1&seed=123",
      },
      place: "Seaside Resort & Spa",
      location: "Malibu, California",
      description:
        "Amazing weekend getaway with incredible ocean views and delicious seafood!",
      images: [
        "https://api.a0.dev/assets/image?text=beach%20resort%20luxury%20swimming%20pool%20ocean%20view&aspect=16:9&seed=1234",
        "https://api.a0.dev/assets/image?text=luxury%20hotel%20room%20with%20ocean%20view&aspect=16:9&seed=1235",
        "https://api.a0.dev/assets/image?text=seafood%20platter%20gourmet%20restaurant&aspect=16:9&seed=1236",
      ],
      likes: 342,
      comments: 58,
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "itinerary",
      user: {
        name: "Maria Silva",
        avatar:
          "https://api.a0.dev/assets/image?text=woman%20profile%20picture%20traveler&aspect=1:1&seed=456",
      },
      title: "Weekend in Barcelona",
      duration: "3 days",
      places: [
        "La Sagrada Familia",
        "Park Güell",
        "La Rambla",
        "Barceloneta Beach",
      ],
      coverImage:
        "https://api.a0.dev/assets/image?text=barcelona%20aerial%20view%20cityscape&aspect=16:9&seed=4567",
      likes: 189,
      comments: 27,
      time: "1 day ago",
    },
    {
      id: "3",
      type: "place",
      user: {
        name: "David Kim",
        avatar:
          "https://api.a0.dev/assets/image?text=asian%20man%20profile%20picture%20traveler&aspect=1:1&seed=789",
      },
      place: "Sakura Japanese Restaurant",
      location: "Kyoto, Japan",
      description:
        "Authentic Kaiseki dining experience with seasonal ingredients. A culinary journey through Japan",
      images: [
        "https://api.a0.dev/assets/image?text=japanese%20restaurant%20interior%20traditional&aspect=16:9&seed=7890",
        "https://api.a0.dev/assets/image?text=sushi%20platter%20gourmet%20food&aspect=16:9&seed=7891",
        "https://api.a0.dev/assets/image?text=traditional%20japanese%20garden%20view&aspect=16:9&seed=7892",
      ],
      likes: 267,
      comments: 41,
      time: "3 days ago",
    },
  ];

  useEffect(() => {
    const getPosts = async () => {
      const token = await AsyncStorage.getItem("jwt");

      const response = await fetch(
        `https://back-new-place-production.up.railway.app/api/post`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setPostsApi(data);
    };

    getPosts();
  }, []);

  return (
    <View style={styles.feed}>
      {postsApi.map((post) => (
        <View
          key={post._id}
          style={[
            styles.postCard,
            { backgroundColor: theme === "dark" ? "#242424" : "#FFFFFF" },
          ]}
        >
          <View style={styles.postHeader}>
            <Image
              source={{ uri: post.user.picture }}
              style={styles.userAvatar}
            />
            <View style={styles.postHeaderText}>
              <Text
                style={[
                  styles.userName,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                {post.user.name}
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={theme === "dark" ? "#BBB" : "#666"}
                />
                <Text
                  style={[
                    styles.locationText,
                    { color: theme === "dark" ? "#BBB" : "#666" },
                  ]}
                >
                  {post.type_post === "place"
                    ? post.place_details?.formatted_address
                    : ""}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={theme === "dark" ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          </View>

          {post.type_post === "place" ? (
            <>
              <Text
                style={[
                  styles.postDescription,
                  { color: theme === "dark" ? "#DDD" : "#333" },
                ]}
              >
                {post.content}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.postImagesScroll}
                contentContainerStyle={styles.postImagesContainer}
              >
                {post.media.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image.url }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              <View style={styles.divider} />
              {post.type_post === "place" && (
                <View style={styles.placeDetailsContainer}>
                  <Text
                    style={[
                      styles.placeName,
                      { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {post.place_details.name}
                  </Text>
                  <View style={styles.starRating}>
                    {[1, 2, 3, 4, 5]?.map((star) => {
                      let iconName: "star-outline" | "star" | "star-half" =
                        "star-outline"; // Estrella vacía

                      if (star <= post.place_details.rating) {
                        iconName = "star"; // Estrella llena
                      } else if (star - 0.5 <= post.place_details.rating) {
                        iconName = "star-half"; // Media estrella
                      }

                      return (
                        <Ionicons
                          key={star}
                          name={iconName}
                          size={18}
                          color={
                            post.place_details.rating ? "#FFD700" : "#CCCCCC"
                          }
                        />
                      );
                    })}

                    <Text
                      style={[
                        styles.ratingText,
                        { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {post.place_details?.rating?.toFixed(1)}
                    </Text>
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.detailsButton,
                  { backgroundColor: theme === "dark" ? "#444" : "#f0f0f0" },
                ]}
                onPress={() =>
                  navigation.navigate("PlaceDetails", {
                    placeIdProvider: post.place_id,
                  })
                }
              >
                <Text
                  style={[
                    styles.detailsButtonText,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  See Place Details
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.itineraryTitle,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                {post.title} • {post.places.length} places
              </Text>
              <Image
                source={{ uri: post.coverImage }}
                style={styles.itineraryCover}
                resizeMode="cover"
              />
              <View style={styles.itineraryPlaces}>
                {post.places.slice(0, 3).map((place, index) => (
                  <View key={index} style={styles.itineraryPlaceItem}>
                    <View
                      style={[
                        styles.placeNumberCircle,
                        {
                          backgroundColor:
                            theme === "dark" ? "#444" : "#f0f0f0",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.placeNumber,
                          { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.placeName,
                        { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {place}
                    </Text>
                  </View>
                ))}
                {post.places.length > 3 && (
                  <Text
                    style={[
                      styles.morePlaces,
                      { color: theme === "dark" ? "#BBB" : "#666" },
                    ]}
                  >
                    +{post.places.length - 3} more places
                  </Text>
                )}
              </View>

              <Link
                href={{
                  pathname: "/[ItineraryDetails]",
                  params: { ItineraryDetails: JSON.stringify(post) },
                }}
                style={[
                  styles.detailsButton,
                  { backgroundColor: theme === "dark" ? "#444" : "#f0f0f0" },
                ]}
                asChild
              >
                <TouchableOpacity onPress={() => {}}>
                  <Text
                    style={[
                      styles.detailsButtonText,
                      { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    View Full Itinerary
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={theme === "dark" ? "#FFFFFF" : "#000000"}
                  />
                </TouchableOpacity>
              </Link>
            </>
          )}

          <View style={styles.postActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
                <Text
                  style={[
                    styles.actionCount,
                    { color: theme === "dark" ? "#DDD" : "#666" },
                  ]}
                >
                  3
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={22}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
                <Text
                  style={[
                    styles.actionCount,
                    { color: theme === "dark" ? "#DDD" : "#666" },
                  ]}
                >
                  {post.comments_count}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.postTime,
                { color: theme === "dark" ? "#BBB" : "#888" },
              ]}
            >
              {post.time}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function BottomNavBar({ theme, navigation }) {
  return (
    <View
      style={[
        styles.bottomNav,
        { backgroundColor: theme === "dark" ? "#242424" : "#FFFFFF" },
      ]}
    >
      <TouchableOpacity style={styles.navItem}>
        <Ionicons
          name="home"
          size={24}
          color={theme === "dark" ? "#FFFFFF" : "#000000"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Search")}
      >
        <Ionicons
          name="search"
          size={24}
          color={theme === "dark" ? "#BBB" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Itineraries")}
      >
        <MaterialIcons
          name="map"
          size={24}
          color={theme === "dark" ? "#BBB" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={theme === "dark" ? "#BBB" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  storyBar: {
    paddingVertical: 12,
  },
  storyBarContent: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 16,
  },
  storyCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  storyImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  storyName: {
    fontSize: 12,
  },
  feed: {
    paddingHorizontal: 16,
  },
  postCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderText: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 2,
  },
  moreButton: {
    padding: 4,
  },
  placeDetailsContainer: {
    marginTop: 5,
    marginBottom: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#242424",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
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
  divider: {
    height: 1,
    backgroundColor: "#FF385C",
    marginVertical: 16,
  },
  postDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImagesScroll: {
    marginBottom: 12,
  },
  postImagesContainer: {
    paddingRight: 16,
  },
  postImage: {
    width: 250,
    height: 160,
    borderRadius: 12,
    marginRight: 8,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  detailsButtonText: {
    fontWeight: "600",
    marginRight: 4,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  itineraryCover: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  itineraryPlaces: {
    marginBottom: 12,
  },
  itineraryPlaceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  placeNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  placeNumber: {
    fontSize: 12,
    fontWeight: "600",
  },
  morePlaces: {
    marginTop: 4,
    fontSize: 14,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  postTime: {
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  navItem: {
    padding: 8,
  },
  createButton: {
    position: "absolute",
    bottom: 100,
    right: 0,
    padding: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF385C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
