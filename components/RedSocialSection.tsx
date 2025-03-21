import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RedSocialSection = ({ theme }: { theme: any }) => {
  return (
    <View style={styles.socialSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Comunidad Viajera
        </Text>
        <TouchableOpacity onPress={() => console.log("Ver comunidad")}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>
            Ver más
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.socialCard, { backgroundColor: theme.cardBackground }]}
      >
        <View style={styles.socialCardHeader}>
          <Image
            source={{
              uri: "https://api.a0.dev/assets/image?text=travel social profile photo&aspect=1:1&seed=42",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={[styles.profileName, { color: theme.text }]}>
              Laura Martínez
            </Text>
            <Text style={[styles.postTime, { color: theme.subtext }]}>
              Hace 2 horas
            </Text>
          </View>
        </View>

        <Text style={[styles.postText, { color: theme.text }]}>
          ¡Increíble día explorando las pirámides de Teotihuacán!
          Definitivamente recomiendo ir temprano para evitar el calor 🌞
        </Text>

        <Image
          source={{
            uri: "https://api.a0.dev/assets/image?text=teotihuacan pyramids mexico&aspect=16:9&seed=123",
          }}
          style={styles.postImage}
        />

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={22} color={theme.subtext} />
            <Text style={[styles.actionText, { color: theme.subtext }]}>
              128
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={theme.subtext}
            />
            <Text style={[styles.actionText, { color: theme.subtext }]}>
              24
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={22} color={theme.subtext} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subGreeting: {
    fontSize: 14,
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  quickAccessContainer: {
    marginBottom: 24,
  },
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
  socialSection: {
    marginBottom: 24,
  },
  socialCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  socialCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  postTime: {
    fontSize: 12,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
  },
  bottomSpacer: {
    height: 70,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default RedSocialSection;
