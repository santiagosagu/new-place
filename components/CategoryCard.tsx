import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const { width } = Dimensions.get("window");

const CategoryCard = ({
  category,
  currentTheme,
}: {
  category: any;
  currentTheme: boolean;
}) => {
  return (
    <Link
      href={{
        pathname: "/[id]",
        params: { id: category.id },
      }}
      asChild
      style={[
        styles.categoryCard,
        {
          backgroundColor: currentTheme ? "#1E1E1E" : "#FFFFFF",
          shadowColor: currentTheme ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => console.log(`Seleccionada categoría: ${category.title}`)}
      >
        <Image source={{ uri: category.image }} style={styles.categoryImage} />
        <View style={styles.categoryContent}>
          <View style={styles.categoryIconContainer}>{category.icon}</View>
          <Text
            style={[
              styles.categoryTitle,
              { color: currentTheme ? "#FFFFFF" : "#333333" },
            ]}
          >
            {category.title}
          </Text>
          <Text
            style={[
              styles.categoryDesc,
              { color: currentTheme ? "#BBBBBB" : "#666666" },
            ]}
          >
            {category.desc}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerLeft: {
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  themeToggle: {
    width: 40,
    alignItems: "flex-end",
    padding: 8,
  },
  scrollContent: {
    paddingTop: 64,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  featuredContainer: {
    marginHorizontal: 16,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  featuredContent: {
    padding: 16,
  },
  featuredIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  featuredDesc: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: (width - 48) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  categoryContent: {
    padding: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoryDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 70,
  },
});

export default CategoryCard;
