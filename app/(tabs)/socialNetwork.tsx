import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import ImageViewing from "react-native-image-viewing";
import { NewModalPlaceActions } from "@/components/newModalPlaceActions";
import InteractionsComments from "@/components/InteractionsComments";
import ViewMedia from "@/components/ViewMedia";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useAuth } from "@/hooks/useAuth";
import { useFocusEffect } from "expo-router";

export interface Post {
  _id: string;
  user: {
    picture: string;
    name: string;
  };
  type_post: "place" | "itinerary";
  content?: string;
  media: { url: string; type: "image" | "video"; thumbnail?: string }[];
  place_details?: {
    formatted_address?: string;
    name?: string;
    rating?: number;
  };
  place_id?: string;
  title?: string;
  places: string[];
  coverImage?: string;
  comments_count: number;
  time: string;
  likes: {
    count: number;
    hasLiked: boolean;
    users: string[];
  };
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = useState(false);
  const [theme, setTheme] = useState(colorScheme || "light");
  const [postsApi, setPostsApi] = useState([]);
  const [visible, setVisible] = useState(false);
  const [postSeleted, setPostSeleted] = useState<Post | [] | null>([]);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const secondaryTextColor = theme === "dark" ? "#BBB" : "#666";

  const [viewCommetsModal, setViewCommetsModal] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  const { checkoutStatusSesionWithToken } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const checkSession = async () => {
        await checkoutStatusSesionWithToken();
      };

      checkSession();
    }, [])
  );

  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  //TODO: descomentar cuando este la funcionalidad
  // const getPosts = async () => {
  //   const token = await AsyncStorage.getItem("jwt");
  //   const user_id = await AsyncStorage.getItem("user_id");

  //   const response = await fetch(
  //     // `http://192.168.1.7:8080/api/post?user_id=${user_id}`,
  //     `https://back-new-place.onrender.com/api/post?user_id=${user_id}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     console.error("Error fetching posts:", response.statusText);
  //     return;
  //   }

  //   const data = await response.json();

  //   setRefreshing(false);

  //   setPostsApi(data);
  // };

  //TODO: descomentar cuando este la funcionalidad
  // useEffect(() => {
  //   getPosts();
  // }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  //TODO: descomentar cuando este la funcionalidad
  // useEffect(() => {
  //   getPosts();
  // }, [refreshing]);

  //TODO: comming soon social network people
  if (2 > 1) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Image
          source={{
            uri: "https://api.a0.dev/assets/image?text=coming%20soon%20social%20network%20people&aspect=1:1&seed=123",
          }}
          style={styles.comingSoonImage}
        />
        <Text style={[styles.comingSoonTitle, { color: textColor }]}>
          Coming Soon!
        </Text>
        <Text style={[styles.comingSoonText, { color: secondaryTextColor }]}>
          Estamos trabajando arduamente para traerte una increíble experiencia
          de red social. ¡Vuelve pronto para comenzar a crear y compartir tus
          aventuras de viaje!
        </Text>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.returnButtonText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // colors={[theme.primary]}
          />
        }
      >
        <StoryBar theme={theme} />
        <Feed
          theme={theme}
          navigation={navigation}
          posts={postsApi}
          visibleZoomImage={setVisible}
          setPostSeleted={setPostSeleted}
          setViewCommetsModal={setViewCommetsModal}
          setRefreshing={setRefreshing}
          setPostId={setPostId}
          setInitialMediaIndex={setInitialMediaIndex}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* <ImageViewing
        images={postSeleted}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        FooterComponent={() => (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="heart-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Me gusta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Comentar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons name="share-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        )}
      /> */}

      {visible && (
        <ViewMedia
          post={postSeleted as Post}
          dispatch={setVisible}
          initialIndex={initialMediaIndex}
        />
      )}

      {viewCommetsModal && (
        <NewModalPlaceActions
          dispatch={setViewCommetsModal}
          heightInitial={500}
          heightExpanded={500}
        >
          <InteractionsComments postId={postId} />
        </NewModalPlaceActions>
      )}

      {/* <BottomNavBar theme={theme} navigation={navigation} /> */}
    </SafeAreaView>
    // </ThemeContext.Provider>
  );
}

function Header({ theme, toggleTheme }: { theme: string; toggleTheme: any }) {
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

function StoryBar({ theme }: { theme: string }) {
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

function Feed({
  theme,
  navigation,
  posts,
  visibleZoomImage,
  setPostSeleted,
  setViewCommetsModal,
  setRefreshing,
  setPostId,
  setInitialMediaIndex,
}: {
  theme: string;
  navigation: any;
  posts: Post[];
  visibleZoomImage: (visible: boolean) => void;
  setPostSeleted: (post: Post | [] | null) => void;
  setViewCommetsModal: (visible: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setPostId: (postId: string) => void;
  setInitialMediaIndex: (index: number) => void;
}) {
  const [postTransformed, setPostTransformed] = useState<Post[]>([]);

  const toggleVote = async (postId: string) => {
    const token = await AsyncStorage.getItem("jwt");
    const user_id = await AsyncStorage.getItem("user_id");

    const response = await fetch(
      // `http://192.168.1.8:8080/api/vote`,
      `https://back-new-place.onrender.com/api/votes`,
      {
        method: "POST",
        body: JSON.stringify({
          post_id: postId,
          user_id: user_id,
          type_vote: "like",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setRefreshing(true);
    } else {
      console.log("Error al votar");
    }
  };

  useEffect(() => {
    const processMedia = async () => {
      const processed = await Promise.all(
        posts.map(async (item) => {
          const transformedMedia = await Promise.all(
            item.media.map(async (media) => {
              if (media.type === "video") {
                try {
                  const { uri } = await VideoThumbnails.getThumbnailAsync(
                    media.url,
                    {
                      time: 15000,
                    }
                  );
                  return { url: media.url, type: "video", thumbnail: uri };
                } catch (error) {
                  console.warn("Error generando thumbnail", error);
                  return null;
                }
              } else {
                return { url: media.url, type: "image" };
              }
            })
          );

          return {
            ...item,
            media: transformedMedia.filter(Boolean),
          };
        })
      );

      setPostTransformed(processed.filter(Boolean) as Post[]);
    };

    processMedia();
  }, [posts]);

  if (!posts || posts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={[
            { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            { fontSize: 18 },
          ]}
        >
          No hay publicaciones disponibles.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.feed}>
      {postTransformed?.map((post) => (
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
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setPostSeleted(post);
                      visibleZoomImage(true);
                      setInitialMediaIndex(index);
                    }}
                  >
                    {image.type === "image" ? (
                      <Image
                        source={{ uri: image.url }}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <Image
                          source={{ uri: image.thumbnail }}
                          style={styles.postImage}
                        />
                        <View style={styles.playIconWrapper}>
                          <Ionicons
                            name="play-circle"
                            size={48}
                            color={"#FF385C"}
                          />
                        </View>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.divider} />
              {post.type_post === "place" && (
                <View
                  style={[
                    styles.placeDetailsContainer,
                    { backgroundColor: theme === "dark" ? "#333" : "#f0f0f0" },
                  ]}
                >
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <Ionicons
                      name="location-outline"
                      size={23}
                      color={theme === "dark" ? "#BBB" : "#666"}
                    />
                    <Text
                      style={[
                        styles.placeName,
                        { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {post?.place_details?.name}
                    </Text>
                  </View>
                  <View style={styles.starRating}>
                    {[1, 2, 3, 4, 5]?.map((star) => {
                      let iconName: "star-outline" | "star" | "star-half" =
                        "star-outline"; // Estrella vacía

                      if (
                        post?.place_details?.rating &&
                        star <= post.place_details.rating
                      ) {
                        iconName = "star"; // Estrella llena
                      } else if (
                        post?.place_details?.rating &&
                        star - 0.5 <= post.place_details.rating
                      ) {
                        iconName = "star-half"; // Media estrella
                      }

                      return (
                        <Ionicons
                          key={star}
                          name={iconName}
                          size={18}
                          color={
                            post?.place_details?.rating ? "#FFD700" : "#CCCCCC"
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
                  pathname: "/itinerario/[ItineraryDetails]",
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleVote(post._id)}
              >
                {post.likes.hasLiked ? (
                  <Ionicons name="heart" size={24} color={"#FF385C"} />
                ) : (
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color={theme === "dark" ? "#FFFFFF" : "#000000"}
                  />
                )}

                <Text
                  style={[
                    styles.actionCount,
                    { color: theme === "dark" ? "#DDD" : "#666" },
                  ]}
                >
                  {post.likes.count}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setViewCommetsModal(true);
                  setPostId(post._id);
                }}
              >
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

const styles = StyleSheet.create({
  comingSoonImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 16,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 32,
    marginBottom: 32,
    lineHeight: 24,
  },
  returnButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  returnButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
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
    backgroundColor: "#BBB",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
    right: 10,
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  button: {
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  videoThumbnail: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  video: {
    width: "100%",
    height: 300,
  },
  videoWrapper: {
    position: "relative",
  },

  playIconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
});
