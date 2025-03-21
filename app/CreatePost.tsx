import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useContext } from "react";
// import ThemeContext from "../context/ThemeContext";
// import { toast } from "sonner-native";

// Simulating server responses
const fakeLocationSearch = async (query) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (query.length < 2) return [];

  const locations = [
    { id: "1", name: "The Ritz-Carlton", address: "Los Angeles, California" },
    { id: "2", name: "Nobu Restaurant", address: "Malibu, California" },
    {
      id: "3",
      name: "Grand Central Market",
      address: "Downtown Los Angeles, CA",
    },
    {
      id: "4",
      name: "Griffith Observatory",
      address: "Los Angeles, California",
    },
    { id: "5", name: "Venice Beach Boardwalk", address: "Venice, California" },
    { id: "6", name: "The Getty Center", address: "Los Angeles, California" },
    {
      id: "7",
      name: "Hollywood Walk of Fame",
      address: "Hollywood, California",
    },
    { id: "8", name: "Santa Monica Pier", address: "Santa Monica, California" },
  ];

  return locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.address.toLowerCase().includes(query.toLowerCase())
  );
};

export default function CreatePost() {
  // const { theme } = useContext(ThemeContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const navigation = useNavigation();

  const [postType, setPostType] = useState("place"); // 'place' or 'itinerary'
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textInputRef = useRef(null);

  // Theming colors
  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5";
  const cardColor = theme === "dark" ? "#242424" : "#FFFFFF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const secondaryTextColor = theme === "dark" ? "#BBB" : "#666";
  const inputBgColor = theme === "dark" ? "#333" : "#f0f0f0";
  const placeholderColor = theme === "dark" ? "#888" : "#aaa";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets) {
        // Check if we're adding too many images
        if (selectedImages.length + result.assets.length > 10) {
          toast.error("You can only add up to 10 photos/videos");
          return;
        }
        setSelectedImages([
          ...selectedImages,
          ...result.assets.map((asset) => asset.uri),
        ]);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleLocationSearch = async (text) => {
    setLocationQuery(text);

    if (text.length < 2) {
      setLocationResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const results = await fakeLocationSearch(text);
      setLocationResults(results);
    } catch (error) {
      console.error("Error searching locations:", error);
      toast.error("Failed to search locations");
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setLocationQuery("");
    setLocationResults([]);
    setShowLocationSearch(false);
  };

  const handleSubmit = async () => {
    // Validate post data
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (postType === "place" && !selectedLocation) {
      toast.error("Please select a location");
      return;
    }

    if (postType === "place" && selectedImages.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }

    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Post created successfully!");
      navigation.goBack();
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: textColor }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                postType === "place" && [
                  styles.activeSegment,
                  { backgroundColor: "#FF385C" },
                ],
              ]}
              onPress={() => setPostType("place")}
            >
              <Text
                style={[
                  styles.segmentText,
                  postType === "place"
                    ? styles.activeSegmentText
                    : { color: textColor },
                ]}
              >
                Place
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentButton,
                postType === "itinerary" && [
                  styles.activeSegment,
                  { backgroundColor: "#FF385C" },
                ],
              ]}
              onPress={() => setPostType("itinerary")}
            >
              <Text
                style={[
                  styles.segmentText,
                  postType === "itinerary"
                    ? styles.activeSegmentText
                    : { color: textColor },
                ]}
              >
                Itinerary
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              !title.trim() || (postType === "place" && !selectedLocation)
                ? styles.disabledButton
                : { backgroundColor: "#FF385C" },
            ]}
            onPress={handleSubmit}
            disabled={
              !title.trim() ||
              (postType === "place" && !selectedLocation) ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        {postType === "place" ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.formCard, { backgroundColor: cardColor }]}>
              <TextInput
                ref={textInputRef}
                placeholder="What's the name of this place?"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.titleInput,
                  {
                    color: textColor,
                    backgroundColor: inputBgColor,
                  },
                ]}
                value={title}
                onChangeText={setTitle}
              />

              <TouchableOpacity
                style={[
                  styles.locationPickerButton,
                  {
                    backgroundColor: inputBgColor,
                    borderColor: selectedLocation ? "#FF385C" : "transparent",
                  },
                ]}
                onPress={() => {
                  setShowLocationSearch(!showLocationSearch);
                  setTimeout(() => textInputRef.current?.focus(), 100);
                }}
              >
                <MaterialIcons name="location-on" size={22} color="#FF385C" />
                <Text
                  style={[
                    styles.locationButtonText,
                    { color: selectedLocation ? textColor : placeholderColor },
                  ]}
                >
                  {selectedLocation
                    ? `${selectedLocation.name}, ${selectedLocation.address}`
                    : "Add location (required)"}
                </Text>
                {selectedLocation && (
                  <TouchableOpacity
                    style={styles.clearLocationButton}
                    onPress={() => setSelectedLocation(null)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={secondaryTextColor}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showLocationSearch && (
                <View
                  style={[
                    styles.locationSearchContainer,
                    { backgroundColor: inputBgColor },
                  ]}
                >
                  <TextInput
                    ref={textInputRef}
                    placeholder="Search for a location..."
                    placeholderTextColor={placeholderColor}
                    style={[styles.locationSearchInput, { color: textColor }]}
                    value={locationQuery}
                    onChangeText={handleLocationSearch}
                    autoFocus
                  />

                  {isSearching ? (
                    <ActivityIndicator
                      style={styles.searchingIndicator}
                      color="#FF385C"
                    />
                  ) : (
                    locationResults.length > 0 && (
                      <View style={styles.locationResultsList}>
                        {locationResults.map((location) => (
                          <TouchableOpacity
                            key={location.id}
                            style={[
                              styles.locationResultItem,
                              {
                                borderBottomColor:
                                  theme === "dark" ? "#444" : "#eee",
                              },
                            ]}
                            onPress={() => selectLocation(location)}
                          >
                            <MaterialIcons
                              name="location-on"
                              size={18}
                              color="#FF385C"
                            />
                            <View style={styles.locationResultText}>
                              <Text
                                style={[
                                  styles.locationName,
                                  { color: textColor },
                                ]}
                              >
                                {location.name}
                              </Text>
                              <Text
                                style={[
                                  styles.locationAddress,
                                  { color: secondaryTextColor },
                                ]}
                              >
                                {location.address}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )
                  )}
                </View>
              )}

              <TextInput
                placeholder="Write a description about this place..."
                placeholderTextColor={placeholderColor}
                style={[
                  styles.descriptionInput,
                  {
                    color: textColor,
                    backgroundColor: inputBgColor,
                    height: 100,
                  },
                ]}
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Add Photos/Videos
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagePickerContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    { backgroundColor: inputBgColor },
                  ]}
                  onPress={pickImage}
                >
                  <Ionicons name="add" size={40} color="#FF385C" />
                </TouchableOpacity>

                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.selectedImageContainer}>
                    <Image source={{ uri }} style={styles.selectedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF385C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.tipContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#FF385C"
                />
                <Text style={[styles.tipText, { color: secondaryTextColor }]}>
                  Add up to 10 photos or videos to showcase this place.
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View
            style={[
              styles.itineraryPlaceholder,
              { backgroundColor: cardColor },
            ]}
          >
            <MaterialIcons name="map" size={60} color="#FF385C" />
            <Text style={[styles.itineraryTitle, { color: textColor }]}>
              Itinerary Creation
            </Text>
            <Text
              style={[
                styles.itineraryDescription,
                { color: secondaryTextColor },
              ]}
            >
              Itineraries can be created from your saved places in the
              Itineraries tab. Add places to your saved collection first.
            </Text>
            <TouchableOpacity
              style={styles.goToItinerariesButton}
              onPress={() => navigation.navigate("Itineraries")}
            >
              <Text style={styles.goToItinerariesText}>
                Go to My Itineraries
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  segmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeSegment: {
    backgroundColor: "#FF385C",
  },
  activeSegmentText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 2,
  },
  locationButtonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  clearLocationButton: {
    padding: 4,
  },
  locationSearchContainer: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  locationSearchInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchingIndicator: {
    marginVertical: 16,
  },
  locationResultsList: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  locationResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  locationResultText: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  descriptionInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  imagePickerContainer: {
    paddingVertical: 8,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  itineraryPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  itineraryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  itineraryDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  goToItinerariesButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  goToItinerariesText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
