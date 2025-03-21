import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";

const { width } = Dimensions.get("window");

const FeaturedSection = ({ theme }: { theme: any }) => {
  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Itinerarios Destacados
        </Text>
        <TouchableOpacity
          onPress={() => console.log("Ver todos los itinerarios")}
        >
          <Text style={[styles.viewAllText, { color: theme.primary }]}>
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itinerariesContainer}
      >
        {[1, 2, 3].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.itineraryCard,
              { backgroundColor: theme.cardBackground },
            ]}
            onPress={() => console.log(`Itinerario ${item} seleccionado`)}
          >
            <Image
              source={{
                uri: `https://api.a0.dev/assets/image?text=travel itinerary destination scenic view ${item}&aspect=16:9&seed=${
                  item * 10
                }`,
              }}
              style={styles.itineraryImage}
            />
            <View style={styles.itineraryInfo}>
              <Text style={[styles.itineraryTitle, { color: theme.text }]}>
                {item === 1
                  ? "Ciudad de México en 3 días"
                  : item === 2
                  ? "Aventura en Cancún"
                  : "Pueblos Mágicos"}
              </Text>
              <View style={styles.itineraryDetails}>
                <View style={styles.itineraryDetailItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={theme.subtext}
                  />
                  <Text
                    style={[
                      styles.itineraryDetailText,
                      { color: theme.subtext },
                    ]}
                  >
                    {item === 1 ? "3 días" : item === 2 ? "5 días" : "7 días"}
                  </Text>
                </View>
                <View style={styles.itineraryDetailItem}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={theme.subtext}
                  />
                  <Text
                    style={[
                      styles.itineraryDetailText,
                      { color: theme.subtext },
                    ]}
                  >
                    {item === 1 ? "CDMX" : item === 2 ? "Cancún" : "Varios"}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  itinerariesContainer: {
    paddingRight: 16,
  },
  itineraryCard: {
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
  itineraryImage: {
    width: "100%",
    height: 120,
  },
  itineraryInfo: {
    padding: 12,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  itineraryDetails: {
    flexDirection: "row",
  },
  itineraryDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  itineraryDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default FeaturedSection;
