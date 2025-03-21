import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  FlatList,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, ThemeProvider } from "@/components/ThemeContext";
import StepIndicator from "@/components/StepIndicator";
import CategoryIcon from "@/components/CategoryIcon";
import Button from "@/components/Button";
import { Stack, useNavigation } from "expo-router";
import Toast, { BaseToast } from "react-native-toast-message";
import { useLocation } from "@/hooks/location/useLocation";
import { useFetchData } from "@/hooks/maps/usemaps";
import { Picker } from "@react-native-picker/picker";

const toastConfig = {
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "red", zIndex: 9999, elevation: 9999 }}
      contentContainerStyle={{
        backgroundColor: "white",
        zIndex: 9999,
        elevation: 9999,
      }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14, fontWeight: "normal" }}
    />
  ),
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", zIndex: 9999, elevation: 9999 }}
      contentContainerStyle={{
        backgroundColor: "white",
        zIndex: 9999,
        elevation: 9999,
      }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14, fontWeight: "normal" }}
    />
  ),
};

// Step components
const NameItinerary = ({ nameItinerary, setNameItinerary }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        ¿Qué nombre quieres dar a tu itinerario?
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Ej. Viaje a la playa"
        placeholderTextColor={colors.inactive}
        value={nameItinerary}
        onChangeText={setNameItinerary}
      />
      <Text style={[styles.hint, { color: colors.inactive }]}>
        Introduce un nombre para tu itinerario
      </Text>
    </View>
  );
};

const RenderLocationStep = ({
  selectedCountry,
  selectedCity,
  setCountrySearch,
  setShowCountryList,
  countrySearch,
  showCountryList,
  loading,
  filteredCountries,
  citySearch,
  setCitySearch,
  setShowCityList,
  showCityList,
  filteredCities,
  setSelectedCountry,
  setSelectedCity,
}: any) => {
  const { colors } = useTheme();

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country.name);
    setCountrySearch(country.name);
    setShowCountryList(false);
    setSelectedCity("");
    setCitySearch("");
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setShowCityList(false);
    // onLocationSelected(selectedCountry, city);
  };

  return (
    <View style={styles.container}>
      {/* Country Selection */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>País</Text>
        <View
          style={[styles.searchContainer, { backgroundColor: colors.card }]}
        >
          <TextInput
            style={[
              styles.inputSearch,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={countrySearch}
            onChangeText={(text) => {
              setCountrySearch(text);
              setShowCountryList(true);
            }}
            placeholder="Buscar país..."
            onFocus={() => setShowCountryList(true)}
          />
          <MaterialIcons
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
        </View>

        {showCountryList && (
          <View style={styles.dropdown}>
            {loading ? (
              <ActivityIndicator style={styles.loading} />
            ) : (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleCountrySelect(item)}
                  >
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* City Selection */}
      {selectedCountry !== "" && (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Ciudad</Text>
          <View
            style={[styles.searchContainer, { backgroundColor: colors.card }]}
          >
            <TextInput
              style={[
                styles.inputSearch,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={citySearch}
              onChangeText={(text) => {
                setCitySearch(text);
                setShowCityList(true);
              }}
              placeholder="Buscar ciudad..."
              onFocus={() => setShowCityList(true)}
            />
            <MaterialIcons
              name="location-city"
              size={24}
              color="#666"
              style={styles.searchIcon}
            />
          </View>

          {showCityList && (
            <View style={styles.dropdown}>
              {loading ? (
                <ActivityIndicator style={styles.loading} />
              ) : (
                <FlatList
                  data={filteredCities}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleCitySelect(item)}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        </View>
      )}

      {selectedCountry && selectedCity && (
        <View style={styles.selectedLocation}>
          <Text style={styles.selectedText}>
            Ubicación seleccionada: {selectedCity}, {selectedCountry}
          </Text>
        </View>
      )}
    </View>
  );
};

const DurationStep = ({ duration, setDuration }) => {
  const { colors } = useTheme();
  const options = [1, 2, 3, 5, 7, 10, 14];

  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        ¿Cuántos días durará tu viaje?
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.durationOptions}
      >
        {options.map((days) => (
          <TouchableOpacity
            key={days}
            style={[
              styles.durationOption,
              {
                backgroundColor:
                  duration === days ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setDuration(days)}
          >
            <Text
              style={[
                styles.durationText,
                { color: duration === days ? "#FFFFFF" : colors.text },
              ]}
            >
              {days} {days === 1 ? "día" : "días"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.customDurationContainer}>
        <Text style={[styles.hint, { color: colors.text }]}>
          O introduce un número exacto:
        </Text>
        <TextInput
          style={[
            styles.durationInput,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          keyboardType="number-pad"
          placeholder="Días"
          placeholderTextColor={colors.inactive}
          value={duration ? String(duration) : ""}
          onChangeText={(text) => {
            const numValue = parseInt(text);
            if (!isNaN(numValue) && numValue > 0) {
              setDuration(numValue);
            } else if (text === "") {
              setDuration(0);
            }
          }}
        />
      </View>
    </View>
  );
};

const CategoriesStep = ({ categories, toggleCategory }) => {
  const { colors } = useTheme();

  const categoryOptions = [
    { id: "food", name: "Gastronomía", icon: "food-fork-drink" },
    { id: "culture", name: "Cultura", icon: "theater" },
    { id: "nature", name: "Naturaleza", icon: "pine-tree" },
    { id: "adventure", name: "Aventura", icon: "hiking" },
    { id: "relax", name: "Relax", icon: "spa" },
    { id: "shopping", name: "Compras", icon: "shopping" },
    { id: "nightlife", name: "Vida nocturna", icon: "glass-cocktail" },
    { id: "family", name: "Familia", icon: "human-male-female-child" },
    { id: "history", name: "Historia", icon: "book-open-page-variant" },
    { id: "art", name: "Arte", icon: "palette" },
    { id: "beach", name: "Playa", icon: "beach" },
    { id: "sports", name: "Deportes", icon: "basketball" },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        ¿Qué categorías te interesan?
      </Text>
      <Text style={[styles.hint, { color: colors.inactive }]}>
        Selecciona las categorías para personalizar tu itinerario
      </Text>

      <View style={styles.categoriesGrid}>
        {categoryOptions.map((category) => (
          <CategoryIcon
            key={category.id}
            name={category.name}
            icon={category.icon}
            selected={categories.includes(category.id)}
            onPress={() => toggleCategory(category.id)}
          />
        ))}
      </View>
    </View>
  );
};

const BudgetStep = ({ budget, setBudget }) => {
  const { colors } = useTheme();
  const options = ["Económico", "Moderado", "Lujoso"];

  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        ¿Cuál es tu presupuesto?
      </Text>
      <Text style={[styles.hint, { color: colors.inactive }]}>
        Selecciona el nivel de presupuesto para tu viaje
      </Text>

      <View style={styles.budgetOptionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.budgetOption,
              {
                backgroundColor:
                  budget === option ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setBudget(option)}
          >
            <Text
              style={[
                styles.budgetText,
                { color: budget === option ? "#FFFFFF" : colors.text },
              ]}
            >
              {option}
            </Text>
            <MaterialCommunityIcons
              name={
                option === "Económico"
                  ? "currency-usd"
                  : option === "Moderado"
                  ? "currency-usd"
                  : "currency-usd"
              }
              size={20}
              color={budget === option ? "#FFFFFF" : colors.text}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const ResultStep = ({ itinerary, loading }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Tu itinerario
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Generando tu itinerario personalizado con IA...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={[
            styles.itineraryContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.itineraryText, { color: colors.text }]}>
            {itinerary ||
              "Completa todos los pasos anteriores para generar tu itinerario."}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

// Main component
const ItineraryCreator = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [nameItinerary, setNameItinerary] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [dataCountry, setDataCountry] = useState<any>({});
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [touristAttractions, setTouristAttractions] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const { location } = useLocation();
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  // const getData = async () => {
  //   const responseSeachCountry: any = await fetch(
  //     `https://nominatim.openstreetmap.org/reverse?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&format=json&accept-language=es`
  //   );

  //   if (responseSeachCountry.ok) {
  //     const dataCountry = await responseSeachCountry.json();
  //     // console.log(dataCountry);
  //     setDataCountry(dataCountry);
  //   }

  //   const hotelsData = await useFetchData(
  //     location!.coords!.latitude.toString(),
  //     location!.coords!.longitude.toString(),
  //     "tourism",
  //     "hotel",
  //     "hoteles"
  //   );
  //   const restaurantsData = await useFetchData(
  //     location!.coords!.latitude.toString(),
  //     location!.coords!.longitude.toString(),
  //     "amenity",
  //     "restaurant",
  //     "restaurantes"
  //   );

  //   setRestaurants(restaurantsData);
  //   setHotels(hotelsData);
  // };

  // useEffect(() => {
  //   if (location && restaurants.length === 0) {
  //     getData();
  //   }
  // }, [location]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/positions"
      );
      const data = await response.json();
      if (!data.error) {
        setCountries(data.data);
      } else {
        Toast.show({ text1: "Error loading countries", type: "info" });
      }
    } catch (error) {
      Toast.show({ text1: "Error fetching countries", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://countriesnow.space/api/v0.1/countries/cities/q?country=${selectedCountry}`
      );
      const data = await response.json();
      if (!data.error) {
        setCities(data.data);
      } else {
        Toast.show({ text1: "Error loading cities", type: "info" });
      }
    } catch (error) {
      Toast.show({ text1: "Error fetching cities", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  async function fetchPlaces(
    apiKey: string,
    location: string,
    radius: number,
    type: string
  ) {
    let allResults = [];
    let nextPageToken = null;

    do {
      // let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&rankby=distance&type=${type}&key=${apiKey}`;
      // let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+en+${selectedCountry}+${selectedCity}&key=${apiKey}`;

      //       let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+en+${selectedCountry}+${selectedCity}&
      // location_step_radius=40000&place_type=${type}&geocodePrecision=EXTENDED&max_results=100&key=${apiKey}
      // `;

      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&geocodePrecision=EXTENDED&max_results=100&key=${apiKey}
`;

      if (nextPageToken) {
        url += `&pagetoken=${nextPageToken}`;
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera para que el token sea válido
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        allResults.push(...data.results);
      }

      nextPageToken = data.next_page_token || null; // Si no hay más token, terminamos
    } while (nextPageToken);

    return allResults;
  }

  useEffect(() => {
    if (location && currentStep === 4) {
      fetchPlaces(
        "AIzaSyBY5fqHDVdAiWD6dLVGDLiaW1iqo_WV2qA",
        `${location?.coords.latitude},${location?.coords.longitude}`,
        8000,
        "restaurant"
      )
        .then((data) => {
          console.log("restaurants", data);
          setRestaurants(data);
        })
        .catch((error) => console.error(error));

      fetchPlaces(
        "AIzaSyBY5fqHDVdAiWD6dLVGDLiaW1iqo_WV2qA",
        `${location?.coords.latitude},${location?.coords.longitude}`,
        8000,
        "tourist_attraction"
      )
        .then((data) => {
          console.log(data);
          setTouristAttractions(data);
        })
        .catch((error) => console.error(error));
    }
  }, [location, currentStep]);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchCities();
    }
  }, [selectedCountry]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const steps = [
    "nameItinerary",
    "Destino",
    "Duración",
    "Categorías",
    "Presupuesto",
    "Resultado",
  ];

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const nextStep = () => {
    if (currentStep === 0 && !nameItinerary) {
      Toast.show({
        type: "error", // success | error | info
        text1: "¡Error!",
        text2: "Por favor ingresa un nombre para tu itinerario",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });
      return;
    }
    if (currentStep === 1 && !selectedCountry && !selectedCity) {
      Toast.show({
        type: "error", // success | error | info
        text1: "¡Error!",
        text2: "Por favor ingresa un destino",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });
      return;
    }

    if (currentStep === 2 && !duration) {
      Toast.show({
        type: "error", // success | error | info
        text1: "¡Error!",
        text2: "Por favor, selecciona la duración de tu viaje",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });
      return;
    }

    if (currentStep === 3 && categories.length === 0) {
      Toast.show({
        type: "error", // success | error | info
        text1: "¡Error!",
        text2: "Por favor, selecciona al menos una categoría",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });
      return;
    }

    if (currentStep === 4 && !budget) {
      Toast.show({
        type: "error", // success | error | info
        text1: "¡Error!",
        text2: "Por favor, selecciona un nivel de presupuesto",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });
      return;
    }

    if (currentStep === 4) {
      generateItinerary();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const generateItinerary = async () => {
    setCurrentStep(5);
    setLoading(true);

    try {
      const categoryOptions = {
        food: "gastronomía",
        culture: "cultura",
        nature: "naturaleza",
        adventure: "aventura",
        relax: "relax",
        shopping: "compras",
        nightlife: "vida nocturna",
        family: "actividades familiares",
        history: "historia",
        art: "arte",
        beach: "playa",
        sports: "deportes",
      };

      const selectedCategories = categories
        .map((cat) => categoryOptions[cat] || cat)
        .join(", ");

      const prompt = `Genera un itinerario detallado de viaje para ${duration} días en la ciudad ${selectedCity} de ${selectedCountry}. 
        Presupuesto: ${budget}. 
        Intereses: ${selectedCategories}.

        
        Por favor, estructura el itinerario día por día, incluyendo:
        1. De 3 a 5 lugares a visitar por día, es muy importante que sea resultados de este listado: ${JSON.stringify(
          touristAttractions.slice(0, 50)
        )}.
        2. Una breve descripción de cada lugar (30-40 palabras).
        3. Incluye coordenadas GPS reales para cada lugar.
        4. Sugerencias de horarios aproximados para cada actividad.
        5. Restaurantes reales o zonas gastronómicas es muy importante que sea resultados de este listado: ${JSON.stringify(
          restaurants.slice(0, 50)
        )}
        6. es importante que los restaurantes esten cercanos a los lugares que se van a visitar.
        
        Formato deseado - por cada día:
        {
          "day": número,
          "title": "Título del día",
          "description": "Descripción breve del día",  
          "restaurant": {
          "breakfast": 
            { 
            "name": "Nombre del restaurante", 
             "description": "Descripción breve", 
             "coordinates": {"lat": latitud, "lng": longitud}, 
             "time": "Horario sugerido", 
             "imagePrompt": "Una descripción para generar una imagen real del lugar" 
            },
            "lunch": 
            { 
             "name": "Nombre del restaurante", 
             "description": "Descripción breve", 
             "coordinates": {"lat": latitud, "lng": longitud}, 
             "time": "Horario sugerido", 
             "imagePrompt": "Una descripción para generar una imagen real del lugar" 
            },
            "dinner": 
            { 
             "name": "Nombre del restaurante", 
             "description": "Descripción breve", 
               "coordinates": {"lat": latitud, "lng": longitud},
               "time": "Horario sugerido",
               "imagePrompt": "Una descripción para generar una imagen real del lugar"
             }
          },
          "places": [
            {
              "name": "Nombre del lugar",
              "description": "Descripción breve",
              "coordinates": {"lat": latitud, "lng": longitud},
              "time": "Horario sugerido",
              "imagePrompt": "Una descripción para generar una imagen real del lugar"
            }
          ]
        }
        
        Asegúrate de que sea un JSON válido dentro de un arreglo de días.`;

      // const improvedPrompt = `Genera un itinerario detallado de viaje para ${duration} días en la ciudad ${selectedCity} de ${selectedCountry}.
      //   Presupuesto: ${budget}.
      //   Intereses: ${selectedCategories}.

      //   Por favor, estructura el itinerario día por día, siguiendo estos pasos:
      //   1. Para cada día, elige 3 a 5 lugares a visitar:
      //      - Es muy importante que sea resultados de este listado: ${JSON.stringify(
      //        touristAttractions
      //      )}

      //   2. Describe cada lugar en 30-40 palabras, asegurándote de que sean reales y relevantes.

      //   3. Incluye coordenadas reales para cada ubicación, verificando con Google Maps o otra fuente fiable.

      //   4. Sugerir tiempos aproximados para cada actividad, considerando la proximidad a los Restaurantes cercanos.

      //   5. Selecciona Restaurantes cercanos a los lugares visitados:
      //      - Es muy importante que sea resultados de este listado: ${JSON.stringify(
      //        restaurants
      //      )}

      //   6. Incluye Restaurantes de category according to your interests (p.e., Gastronomía, Hotel nearby, etc.).

      //   Format deseado para cada día:
      //   {
      //     "day": número,
      //     "title": "Título del día",
      //     "description": "Descripción breve del día",
      //     "restaurant": {
      //     "breakfast":
      //       {
      //       "name": "Nombre del restaurante",
      //        "description": "Descripción breve",
      //        "coordinates": {"lat": latitud, "lng": longitud},
      //        "time": "Horario sugerido",
      //        "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       },
      //       "lunch":
      //       {
      //        "name": "Nombre del restaurante",
      //        "description": "Descripción breve",
      //        "coordinates": {"lat": latitud, "lng": longitud},
      //        "time": "Horario sugerido",
      //        "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       },
      //       "dinner":
      //       {
      //        "name": "Nombre del restaurante",
      //        "description": "Descripción breve",
      //          "coordinates": {"lat": latitud, "lng": longitud},
      //          "time": "Horario sugerido",
      //          "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //        }
      //     },
      //     "places": [
      //       {
      //         "name": "Nombre del lugar",
      //         "description": "Descripción breve",
      //         "coordinates": {"lat": latitud, "lng": longitud},
      //         "time": "Horario sugerido",
      //         "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       }
      //     ]
      //   }

      //   Asegúrate de que:
      //   - Sea un JSON válido dentro de un arreglo de días.
      //   - Los Restaurantes tengan coordenadas reales y sean accesibles.
      //   - La distancia entre actividades y Restaurantes sea adecuada.
      //   - Los horarios sean realistas y consideren el tiempo de desplazamiento entre los restaurantes y los lugares visitados.
      //   - Los lugares visitados sean relevantes y atractivos para los intereses del usuario.
      //   - Considera factores como el presupuesto, la distancia, y preferencias alimentarias.`;

      // const improvedPrompt = `Genera un itinerario detallado de viaje para ${duration} días en la ciudad ${selectedCity} de ${selectedCountry}.
      //   Presupuesto: ${budget}.
      //   Intereses: ${selectedCategories}.

      //   Por favor, estructura el itinerario día por día, siguiendo estos pasos:
      //   1. Para cada día, elige 3 a 5 lugares a visitar:
      //      - Debe ser un resultado de esta lista de turismo: ${JSON.stringify(
      //        touristAttractions
      //      )}

      //   2. Describe cada lugar en 30-40 palabras, asegurándote de que sean reales y relevantes.

      //   3. Incluye coordenadas reales para cada ubicación, verificando con Google Maps o otra fuente fiable.

      //   4. Sugerir tiempos aproximados para cada actividad, considerando la proximidad a los Restaurantes cercanos.

      //   5. Selecciona Restaurantes cercanos a los lugares visitados:
      //      - Debe ser un resultado de esta lista de restaurantes: ${JSON.stringify(
      //        restaurants
      //      )}

      //   6. Incluye Restaurantes de category according to your interests (p.e., Gastronomía, Hotel nearby, etc.).

      //   Format deseado para cada día:
      //   {
      //     "day": número,
      //     "title": "Título del día",
      //     "description": "Descripción breve del día",
      //     "restaurant": {
      //     "breakfast":
      //       {
      //       "name": "Nombre del restaurante",
      //        "description": "Descripción breve",
      //        "coordinates": {"lat": latitud, "lng": longitud},
      //        "time": "Horario sugerido",
      //        "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       },
      //       "lunch":
      //       {
      //        "name": "Nombre del restaurante",
      //        "description": "Descripción breve",
      //        "coordinates": {"lat": latitud, "lng": longitud},
      //        "time": "Horario sugerido",
      //        "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       },
      //       "dinner":
      //       {
      //        "name": "Nombre del restaurante",
      //        "description": "Descripción breve",
      //          "coordinates": {"lat": latitud, "lng": longitud},
      //          "time": "Horario sugerido",
      //          "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       }
      //     },
      //     "places": [
      //       {
      //         "name": "Nombre del lugar",
      //         "description": "Descripción breve",
      //         "coordinates": {"lat": latitud, "lng": longitud},
      //         "time": "Horario sugerido",
      //         "imagePrompt": "Una descripción para generar una imagen real del lugar"
      //       }
      //     ]
      //   }

      //   Asegúrate de que:
      //   - El JSON sea válido.
      //   - Los Restaurantes tengan coordenadas reales y sean accesibles.
      //   - La distancia entre actividades y Restaurantes sea adecuada.
      //   - Los horarios sean realistas y consideren el tiempo de desplazamiento entre los restaurantes y los lugares visitados.
      //   - Los lugares visitados sean relevantes y atractivos para los intereses del usuario.
      //   - Considera factores como el presupuesto, la distancia, y preferencias alimentarias.`;

      const improvedPrompt = `Genera un itinerario detallado de viaje para ${duration} días en la ciudad ${selectedCity} de ${selectedCountry}. 
- Presupuesto: ${budget}.
- Intereses: ${selectedCategories}.

Estructura el itinerario día por día siguiendo estos pasos:

1. Para cada día, escoge 3 a 5 lugares a visitar:
   - Deben ser resultados de esta lista de turismo: ${JSON.stringify(
     touristAttractions
   )}.

2. Describe cada lugar en 30-40 palabras relevantes y realistas.

3. Incluye coordenadas reales para cada ubicación verificando con Google Maps o otra fuente fiable.

4. Sugerir tiempos aproximados para cada actividad, considerando laproximidad a los Restaurantes cercanos.

5. Seleccionar Restaurantes cercanos a los lugares visitados:
   - Deben ser resultados de esta lista de restaurantes: ${JSON.stringify(
     restaurants
   )}.

6. Incluir Restaurantes de categories according to tus intereses (p.e., Gastronomía, Hotel cercano, etc.).

Format deseado para cada día:
{
  "day": número,
  "title": "Título del día",
  "description": "Descripción breve del día",
  "restaurant": {
    "breakfast": 
      { 
        "name": "Nombre del restaurante", 
        "description": "Descripción breve", 
        "coordinates": {"lat": latitud, "lng": longitud}, 
        "time": "Horario sugerido", 
        "imagePrompt": "Una descripción para generar una imagen real del lugar" 
      },
      "lunch": 
      { 
       "name": "Nombre del restaurante", 
       "description": "Descripción breve", 
       "coordinates": {"lat": latitud, "lng": longitud}, 
       "time": "Horario sugerido", 
       "imagePrompt": "Una descripción para generar una imagen real del lugar" 
      },
      "dinner": 
      { 
       "name": "Nombre del restaurante", 
       "description": "Descripción breve", 
         "coordinates": {"lat": latitud, "lng": longitud},
         "time": "Horario sugerido",
         "imagePrompt": "Una descripción para generar una imagen real del lugar"
      }
    },
    "places": [
      {
        "name": "Nombre del lugar",
        "description": "Descripción breve",
        "coordinates": {"lat": latitud, "lng": longitud},
        "time": "Horario sugerido",
        "imagePrompt": "Una descripción para generar una imagen real del lugar"
      }
    ]
  }
}

Asegúrate de que:
- El JSON sea válido.
- Los Restaurantes tengan coordenadas reales y sean accesibles.
- La distancia entre actividades y Restaurantes sea adecuada.
- Los horarios sean realistas y consideren el tiempo de desplazamiento entre los restaurantes y los lugares visitados.
- Los lugares visitados sean relevantes y atractivos para tus intereses.
- Considera factores como el presupuesto, la distancia y preferencias alimentarias.`;

      const response = await fetch("https://api.a0.dev/ai/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente de viajes experto que conoce destinos turísticos reales en todo el mundo.",
            },
            { role: "user", content: improvedPrompt },
          ],
        }),
      });

      const data = await response.json();

      Toast.show({
        type: "success", // success | error | info
        text1: "¡Itinerario generado con éxito!",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });

      setItinerary(data.completion);
      //   toast.success("¡Itinerario generado con éxito!");
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary(
        "Lo sentimos, ha ocurrido un error al generar tu itinerario. Por favor, inténtalo de nuevo."
      );
      Toast.show({
        type: "error", // success | error | info
        text1: "¡Error!",
        text2: "Error al generar el itinerario",
        position: "bottom", // top | bottom | center
        bottomOffset: 100, // offset in dp
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <NameItinerary
            nameItinerary={nameItinerary}
            setNameItinerary={setNameItinerary}
          />
        );
      case 1:
        return (
          // <DestinationStep
          //   destination={destination}
          //   setDestination={setDestination}
          // />
          // <RenderLocationStep
          //   selectedCountry={selectedCountry}
          //   setSelectedCountry={setSelectedCountry}
          //   selectedCity={selectedCity}
          //   setSelectedCity={setSelectedCity}
          //   countries={countries}
          //   cities={cities}
          // />
          <RenderLocationStep
            countries={countries}
            cities={cities.slice(0, 50)}
            filteredCountries={filteredCountries}
            countrySearch={countrySearch}
            showCountryList={showCountryList}
            loading={loading}
            filteredCities={filteredCities}
            citySearch={citySearch}
            setCitySearch={setCitySearch}
            setShowCityList={setShowCityList}
            showCityList={showCityList}
            setCountrySearch={setCountrySearch}
            setShowCountryList={setShowCountryList}
            setSelectedCountry={setSelectedCountry}
            setSelectedCity={setSelectedCity}
          />
        );
      case 2:
        return <DurationStep duration={duration} setDuration={setDuration} />;
      case 3:
        return (
          <CategoriesStep
            categories={categories}
            toggleCategory={toggleCategory}
          />
        );
      case 4:
        return <BudgetStep budget={budget} setBudget={setBudget} />;
      case 5:
        return <ResultStep itinerary={itinerary} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Toast config={toastConfig} />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={{ padding: 6 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={"white"} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Creador de Itinerarios
        </Text>
        {/* <View style={styles.themeToggle}>
          <MaterialCommunityIcons
            name="weather-sunny"
            size={20}
            color={colors.text}
          />
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#f4f3f4"}
            style={{ marginHorizontal: 8 }}
          />
          <MaterialCommunityIcons
            name="weather-night"
            size={20}
            color={colors.text}
          />
        </View> */}
      </View>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <Button title="Anterior" onPress={prevStep} type="outline" />
        )}

        {currentStep < steps.length - 1 && (
          <Button
            title="Siguiente"
            onPress={nextStep}
            disabled={
              (restaurants.length === 0 && currentStep === 4) ||
              (touristAttractions.length === 0 && currentStep === 4)
            }
          />
        )}

        {currentStep === steps.length - 1 && (
          <Button
            title="Nuevo Itinerario"
            onPress={() => {
              setCurrentStep(0);
              setItinerary("");
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    // borderColor: "#ddd",
    borderRadius: 8,
    // backgroundColor: "#f8f8f8",
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputSearch: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
    borderRadius: 8,
    paddingLeft: 16,
  },
  searchIcon: {
    padding: 10,
  },
  dropdown: {
    // position: "absolute",
    marginTop: -80,
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 1000,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  loading: {
    padding: 20,
  },
  selectedLocation: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  selectedText: {
    fontSize: 16,
    color: "#0369a1",
    textAlign: "center",
  },

  durationOptions: {
    flexDirection: "row",
    marginVertical: 16,
  },
  durationOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
  },
  durationText: {
    fontSize: 16,
    fontWeight: "500",
  },
  customDurationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  durationInput: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  budgetOptionsContainer: {
    marginTop: 16,
  },
  budgetOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: "500",
  },
  itineraryContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 300,
  },
  itineraryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});

const ItineraryCreationScreen = () => {
  return (
    <ThemeProvider>
      <ItineraryCreator />
    </ThemeProvider>
  );
};

export default ItineraryCreationScreen;
