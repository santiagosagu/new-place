import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  useColorScheme,
  Dimensions,
  StatusBar,
  Animated,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack, useFocusEffect } from "expo-router";
import CategoryCard from "@/components/CategoryCard";
import data from "@/data.json";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get("window");

const CategoryScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [currentTheme, setCurrentTheme] = useState(isDarkMode);
  const themeAnim = new Animated.Value(isDarkMode ? 1 : 0);

  const { checkoutStatusSesionWithToken } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const checkSession = async () => {
        await checkoutStatusSesionWithToken();
      };

      checkSession();
    }, [])
  );

  // Asegurarse de que el tema siga el modo del sistema
  useEffect(() => {
    setCurrentTheme(isDarkMode);
    Animated.timing(themeAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const toggleTheme = () => {
    setCurrentTheme(!currentTheme);
    Animated.timing(themeAnim, {
      toValue: currentTheme ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Colores dinámicos basados en el tema
  const backgroundColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F5F7FA", "#121212"],
  });

  const textColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#333333", "#FFFFFF"],
  });

  const cardBackgroundColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#1E1E1E"],
  });

  const subtitleColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#666666", "#BBBBBB"],
  });

  const headerBgColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.9)", "rgba(18, 18, 18, 0.9)"],
  });

  const shadowColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.5)"],
  });

  const categories = [
    {
      id: 1,
      title: "Comidas y Bebidas",
      icon: (
        <MaterialIcons
          name="restaurant-menu"
          size={28}
          color={currentTheme ? "#FFD700" : "#4285F4"}
        />
      ),
      desc: "Restaurantes, bares y cafeterías",
      image: `https://api.a0.dev/assets/image?text=food and drinks&aspect=16:9&seed=1`,
    },
    {
      id: 2,
      title: "Alojamientos",
      icon: (
        <FontAwesome5
          name="hotel"
          size={24}
          color={currentTheme ? "#00CED1" : "#FF6D00"}
        />
      ),
      desc: "Hoteles, hostales y apartamentos",
      image: `https://api.a0.dev/assets/image?text=accommodation hotels hostels apartments &aspect=16:9&seed=2`,
    },
    {
      id: 3,
      title: "Tiendas",
      icon: (
        <MaterialIcons
          name="shopping-bag"
          size={28}
          color={currentTheme ? "#FF6B81" : "#0F9D58"}
        />
      ),
      desc: "Comercios, boutiques y mercados",
      image: `https://api.a0.dev/assets/image?text=retail shops boutique fashion store mall shopping&aspect=16:9&seed=3`,
    },
    {
      id: 4,
      title: "Ocio",
      icon: (
        <Ionicons
          name="game-controller"
          size={28}
          color={currentTheme ? "#9C27B0" : "#D61A60"}
        />
      ),
      desc: "Entretenimiento y actividades recreativas",
      image: `https://api.a0.dev/assets/image?text=entertainment cinema theater park activities&aspect=16:9&seed=4`,
    },
    {
      id: 5,
      title: "Educación",
      icon: (
        <Ionicons
          name="school"
          size={28}
          color={currentTheme ? "#4CAF50" : "#3949AB"}
        />
      ),
      desc: "Centros educativos y formación",
      image: `https://api.a0.dev/assets/image?text=education school university campus library&aspect=16:9&seed=5`,
    },
    {
      id: 6,
      title: "Salud y bienestar",
      icon: (
        <FontAwesome5
          name="hospital"
          size={24}
          color={currentTheme ? "#F44336" : "#1E88E5"}
        />
      ),
      desc: "Centros médicos, spa, gimnasios y clínicas",
      image: `https://api.a0.dev/assets/image?text=healthcare wellness hospital clinic medical &aspect=16:9&seed=6`,
    },
    {
      id: 7,
      title: "Iglesias y templos",
      icon: (
        <FontAwesome5
          name="church"
          size={24}
          color={currentTheme ? "#1E88E5" : "#F44336"}
        />
      ),
      desc: "Centros religiosos y lugares de culto",
      image: `https://api.a0.dev/assets/image?text=church temple religious place of worship&aspect=16:9&seed=6`,
    },
    {
      id: 8,
      title: "servicios publicos",
      icon: (
        <FontAwesome5
          name="landmark"
          size={24}
          color={currentTheme ? "#D61A60" : "#9C27B0"}
        />
      ),
      desc: "Servicios públicos",
      image: `https://api.a0.dev/assets/image?text=landmark monument historical place of interest&aspect=16:9&seed=6`,
    },
  ];

  const renderFeaturedCategory = () => {
    const featured = categories[1]; // Turismo como destacado

    return (
      <Link
        href={{
          pathname: "/[id]",
          params: { id: featured.id },
        }}
        style={styles.featuredContainer}
        asChild
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            console.log(`Seleccionada categoría: ${featured.title}`)
          }
        >
          <Image
            source={{ uri: featured.image }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
            style={styles.featuredGradient}
          >
            <View style={styles.featuredContent}>
              <View style={styles.featuredIconContainer}>{featured.icon}</View>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredDesc}>{featured.desc}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar
          barStyle={currentTheme ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        <Animated.View
          style={[styles.header, { backgroundColor: headerBgColor }]}
        >
          {/* <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={currentTheme ? "#FFFFFF" : "#333333"}
              />
            </TouchableOpacity>
          </View> */}

          <Animated.Text style={[styles.headerTitle, { color: textColor }]}>
            Explorar Categorías
          </Animated.Text>

          {/* <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Ionicons
              name={currentTheme ? "sunny" : "moon"}
              size={24}
              color={currentTheme ? "#FFD700" : "#4A4A4A"}
            />
          </TouchableOpacity> */}
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.Text style={[styles.sectionTitle, { color: textColor }]}>
            Descubre nuevos lugares
          </Animated.Text>
          <Animated.Text
            style={[styles.sectionSubtitle, { color: subtitleColor }]}
          >
            Explora por categorías y encuentra lo que buscas
          </Animated.Text>

          {renderFeaturedCategory()}

          <Animated.Text style={[styles.categoriesTitle, { color: textColor }]}>
            Todas las categorías
          </Animated.Text>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                currentTheme={currentTheme}
              />
            ))}
          </View>
        </ScrollView>
        <View style={styles.bottomSpacer} />
      </Animated.View>
    </SafeAreaView>
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

export default CategoryScreen;
