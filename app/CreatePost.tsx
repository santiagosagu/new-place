import React, { useState, useRef, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocation } from "@/hooks/location/useLocation";
// import ThemeContext from "../context/ThemeContext";
// import { toast } from "sonner-native";

export interface Place {
  placeIdProvider: string;
  name: string;
  lat: number;
  lon: number;
  types: string[];
  vicinity: string;
  rating: number;
  userRatingTotal: number;
  photos: (string | never[] | null)[];
  businessStatus: string;
}

const fakeLocationSearch = async (query: string, lat: number, long: number) => {
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("query", query);
  const token = await AsyncStorage.getItem("jwt");

  const response = await fetch(
    // `http://192.168.1.8:8080/api/place-autocomplete?input=${query}&lang=es&lat=${lat}&long=${long}`,
    `https://back-new-place-production.up.railway.app/api/place-autocomplete?input=${query}&lang=es&lat=${lat}&long=${long}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return await data;
};

export default function CreatePost() {
  // const { theme } = useContext(ThemeContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const navigation = useNavigation();

  const [postType, setPostType] = useState("place"); // 'place' or 'itinerary'
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textInputRef = useRef(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [images, setImages] = useState<
    { uri: string; mimeType?: string; fileName?: string }[]
  >([]);

  const { location } = useLocation();

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

    console.log(result);

    if (!result.canceled) {
      if (result.assets) {
        // Check if we're adding too many images
        if (images.length + result.assets.length > 10) {
          console.error("You can only add up to 10 photos/videos");
          return;
        }
        setImages(
          result.assets as {
            uri: string;
            mimeType?: string;
            fileName?: string;
          }[]
        );
      }
    }
  };

  const removeImage = (index: number) => {
    const newImagesSend = [...images];
    newImagesSend.splice(index, 1);
    setImages(newImagesSend);
  };

  const handleLocationSearch = async (text: string) => {
    if (text.length < 3) {
      setLocationResults([]);
      return;
    }

    setIsSearching(true);

    try {
      if (!location) {
        console.error("No se pudo obtener la ubicación actual");
        return;
      }

      const results = await fakeLocationSearch(
        text,
        location.coords.latitude,
        location.coords.longitude
      );
      setLocationResults(results);
    } catch (error) {
      console.error("Error searching locations:", error);
      console.error("Failed to search locations");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleLocationSearch(locationQuery);
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [locationQuery]);

  const selectLocation = (location: Place) => {
    setSelectedLocation(location);
    setLocationQuery("");
    setLocationResults([]);
    setShowLocationSearch(false);
  };

  const handleSubmit = async () => {
    // Validate post data
    // if (!title.trim()) {
    //   toast.error("Please enter a title");
    //   return;
    // }

    if (postType === "place" && !selectedLocation) {
      console.log("Please select a location");
      console.error("Please select a location");
      return;
    }

    if (postType === "place" && images.length === 0) {
      console.log("Please add at least one photo");
      console.error("Please add at least one photo");
      return;
    }

    console.log("entre aqui");
    const user_id = await AsyncStorage.getItem("user_id");
    setIsSubmitting(true);

    if (!user_id) {
      console.error("No se pudo obtener el id de usuario");
      return;
    }

    if (!selectedLocation) {
      console.error("No se pudo obtener el id de la ubicación");
      return;
    }
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("media", {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: image.fileName || `photo_${index}.jpg`,
        } as unknown as Blob);
      });

      formData.append("user_id", user_id);
      formData.append("content", description);
      formData.append("place_id", selectedLocation.placeIdProvider);
      formData.append("type_post", postType);

      const response = await fetch(
        // "http://192.168.1.8:8080/api/new-post",
        "https://back-new-place-production.up.railway.app/api/new-post",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el post");
      }

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      // toast.success("Post created successfully!");
      navigation.goBack();
    }, 2000);
  };

  // console.log(dataPlaceDetails);

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
              postType === "place" && !selectedLocation
                ? styles.disabledButton
                : { backgroundColor: "#FF385C" },
            ]}
            onPress={handleSubmit}
            disabled={
              (postType === "place" && !selectedLocation) || isSubmitting
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
                    onChangeText={setLocationQuery}
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
                        {locationResults.map((location, index) => (
                          <TouchableOpacity
                            key={index}
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

                {images.map((image, index) => (
                  <View key={index} style={styles.selectedImageContainer}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.selectedImage}
                    />
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
