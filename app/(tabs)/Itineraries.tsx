import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Itineraries() {
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my"); // 'my' or 'saved'

  // Sample data
  const myItineraries = [
    {
      id: "1",
      title: "Weekend in Barcelona",
      coverImage:
        "https://api.a0.dev/assets/image?text=barcelona%20cityscape%20vibrant&aspect=16:9&seed=123",
      places: 7,
      duration: "3 days",
      lastEdited: "2 weeks ago",
      isPublished: true,
    },
    {
      id: "2",
      title: "Tokyo Food Tour",
      coverImage:
        "https://api.a0.dev/assets/image?text=tokyo%20street%20food%20night&aspect=16:9&seed=456",
      places: 12,
      duration: "5 days",
      lastEdited: "1 month ago",
      isPublished: true,
    },
    {
      id: "3",
      title: "New York City Adventure",
      coverImage:
        "https://api.a0.dev/assets/image?text=new%20york%20city%20skyscrapers%20sunset&aspect=16:9&seed=789",
      places: 8,
      duration: "4 days",
      lastEdited: "3 days ago",
      isPublished: false,
    },
    {
      id: "4",
      title: "Rome Historical Tour",
      coverImage:
        "https://api.a0.dev/assets/image?text=rome%20colosseum%20ancient%20ruins&aspect=16:9&seed=101",
      places: 6,
      duration: "3 days",
      lastEdited: "Just now",
      isPublished: false,
    },
  ];

  const savedItineraries = [
    {
      id: "5",
      title: "Paris in Spring",
      coverImage:
        "https://api.a0.dev/assets/image?text=paris%20eiffel%20tower%20spring%20blossoms&aspect=16:9&seed=202",
      creator: "Emma Wilson",
      creatorAvatar:
        "https://api.a0.dev/assets/image?text=woman%20portrait%20professional&aspect=1:1&seed=203",
      places: 9,
      duration: "4 days",
      likes: 342,
    },
    {
      id: "6",
      title: "Thailand Beach Hopping",
      coverImage:
        "https://api.a0.dev/assets/image?text=thailand%20beaches%20paradise%20islands&aspect=16:9&seed=304",
      creator: "Mike Chen",
      creatorAvatar:
        "https://api.a0.dev/assets/image?text=asian%20man%20profile%20picture&aspect=1:1&seed=305",
      places: 5,
      duration: "7 days",
      likes: 289,
    },
    {
      id: "7",
      title: "Italian Countryside",
      coverImage:
        "https://api.a0.dev/assets/image?text=tuscany%20countryside%20rolling%20hills%20sunset&aspect=16:9&seed=406",
      creator: "Sophia Martinez",
      creatorAvatar:
        "https://api.a0.dev/assets/image?text=latina%20woman%20portrait&aspect=1:1&seed=407",
      places: 6,
      duration: "5 days",
      likes: 156,
    },
  ];

  // Filter itineraries based on search query
  const filteredMyItineraries = myItineraries.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSavedItineraries = savedItineraries.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Theming
  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5";
  const cardColor = theme === "dark" ? "#242424" : "#FFFFFF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const secondaryTextColor = theme === "dark" ? "#BBB" : "#666";
  const borderColor =
    theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const searchBgColor = theme === "dark" ? "#333" : "#EBEBEB";

  const renderMyItineraryItem = ({ item }: { item: any }) => {
    const itemParams = JSON.stringify({
      type: "itinerary",
      user: {
        name: item.creator,
        avatar: item.creatorAvatar,
      },
      title: item.title,
      duration: item.duration,
      places: ["Loading places..."],
      coverImage: item.coverImage,
      likes: item.likes,
      comments: 0,
      time: "Recently saved",
    });

    return (
      <Link
        href={{
          pathname: "/itinerario/[ItineraryDetails]",
          params: { ItineraryDetails: itemParams },
        }}
        style={[styles.itineraryCard, { backgroundColor: cardColor }]}
        asChild
      >
        <TouchableOpacity onPress={() => {}}>
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
          <View style={styles.itineraryDetails}>
            <View style={styles.itineraryHeader}>
              <Text style={[styles.itineraryTitle, { color: textColor }]}>
                {item.title}
              </Text>
              <TouchableOpacity>
                <Feather
                  name="more-vertical"
                  size={20}
                  color={secondaryTextColor}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.itineraryMeta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="place" size={16} color="#FF385C" />
                <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                  {item.places} places
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#FF385C" />
                <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                  {item.duration}
                </Text>
              </View>
            </View>

            <View style={styles.itineraryFooter}>
              <Text
                style={[styles.lastEditedText, { color: secondaryTextColor }]}
              >
                Edited {item.lastEdited}
              </Text>

              {item.isPublished ? (
                <View style={styles.publishedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.publishedText}>Published</Text>
                </View>
              ) : (
                <View style={styles.draftBadge}>
                  <Ionicons name="document-outline" size={14} color="#FF9800" />
                  <Text style={styles.draftText}>Draft</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const renderSavedItineraryItem = ({ item }: { item: any }) => {
    const itemParams = JSON.stringify({
      type: "itinerary",
      user: {
        name: item.creator,
        avatar: item.creatorAvatar,
      },
      title: item.title,
      duration: item.duration,
      places: ["Loading places..."],
      coverImage: item.coverImage,
      likes: item.likes,
      comments: 0,
      time: "Recently saved",
    });

    return (
      <Link
        href={{
          pathname: "/itinerario/[ItineraryDetails]",
          params: { ItineraryDetails: itemParams },
        }}
        style={[styles.itineraryCard, { backgroundColor: cardColor }]}
        asChild
      >
        <TouchableOpacity onPress={() => {}}>
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
          <View style={styles.itineraryDetails}>
            <View style={styles.itineraryHeader}>
              <Text style={[styles.itineraryTitle, { color: textColor }]}>
                {item.title}
              </Text>
              <TouchableOpacity>
                <Ionicons name="bookmark" size={20} color="#FF385C" />
              </TouchableOpacity>
            </View>

            <View style={styles.creatorInfo}>
              <Image
                source={{ uri: item.creatorAvatar }}
                style={styles.creatorAvatar}
              />
              <Text style={[styles.creatorName, { color: secondaryTextColor }]}>
                by {item.creator}
              </Text>
            </View>

            <View style={styles.itineraryMeta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="place" size={16} color="#FF385C" />
                <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                  {item.places} places
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#FF385C" />
                <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                  {item.duration}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="heart" size={16} color="#FF385C" />
                <Text style={[styles.metaText, { color: secondaryTextColor }]}>
                  {item.likes}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Itineraries
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateItinerary")}
        >
          <Ionicons name="add-circle" size={28} color="#FF385C" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: searchBgColor }]}>
          <Ionicons name="search" size={20} color={secondaryTextColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search itineraries..."
            placeholderTextColor={secondaryTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={secondaryTextColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "my" && [
              styles.activeTab,
              { borderBottomColor: "#FF385C" },
            ],
          ]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "my" ? "#FF385C" : secondaryTextColor },
            ]}
          >
            My Itineraries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "saved" && [
              styles.activeTab,
              { borderBottomColor: "#FF385C" },
            ],
          ]}
          onPress={() => setActiveTab("saved")}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "saved" ? "#FF385C" : secondaryTextColor },
            ]}
          >
            Saved Itineraries
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "my" ? (
        <FlatList
          data={filteredMyItineraries}
          renderItem={renderMyItineraryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialIcons name="map" size={60} color="#FF385C" />
              <Text style={[styles.emptyStateTitle, { color: textColor }]}>
                No itineraries found
              </Text>
              <Text
                style={[styles.emptyStateText, { color: secondaryTextColor }]}
              >
                {searchQuery.length > 0
                  ? "No results match your search. Try a different query."
                  : "You haven't created any itineraries yet. Tap + to create one."}
              </Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={filteredSavedItineraries}
          renderItem={renderSavedItineraryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={60} color="#FF385C" />
              <Text style={[styles.emptyStateTitle, { color: textColor }]}>
                No saved itineraries
              </Text>
              <Text
                style={[styles.emptyStateText, { color: secondaryTextColor }]}
              >
                {searchQuery.length > 0
                  ? "No results match your search. Try a different query."
                  : "You haven't saved any itineraries yet. Explore the feed to find some!"}
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.exploreButtonText}>Explore Feed</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <View style={{ height: 70 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  itineraryCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: 160,
  },
  itineraryDetails: {
    padding: 12,
  },
  itineraryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 14,
  },
  itineraryMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  itineraryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastEditedText: {
    fontSize: 12,
  },
  publishedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  publishedText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
  },
  draftBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  draftText: {
    fontSize: 12,
    color: "#FF9800",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
