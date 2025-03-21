import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  TextInput,
  Linking,
  Platform,
  Animated,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useFetchData } from "@/hooks/maps/usemaps";
import { useLocation } from "@/hooks/location/useLocation";

const { width } = Dimensions.get("window");

// Componente principal
const TravelPlannerApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  // Datos de formulario
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("Medio");
  const [travelStyle, setTravelStyle] = useState("Aventura");
  const [travelInterests, setTravelInterests] = useState([]);
  const [dataCountry, setDataCountry] = useState<any>({});
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);

  const { location } = useLocation();

  // Referencias para animaciones
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Opciones para intereses
  const interestOptions = [
    "Naturaleza",
    "Historia",
    "Gastronomía",
    "Arte",
    "Aventura",
    "Playa",
    "Montaña",
    "Compras",
    "Fotografía",
    "Vida nocturna",
  ];

  // Opciones para presupuesto
  const budgetOptions = ["Bajo", "Medio", "Alto", "Lujo"];

  // Opciones para estilos de viaje
  const travelStyleOptions = [
    "Aventura",
    "Relax",
    "Cultural",
    "Familiar",
    "Romántico",
  ];

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    // Validación
    if (currentStep === 0 && !destination.trim()) {
      alert("Por favor ingresa un destino");
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(currentStep + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Función para retroceder al paso anterior
  const prevStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(currentStep - 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Toggle para expandir/colapsar días
  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Función para seleccionar/deseleccionar intereses
  const toggleInterest = (interest) => {
    if (travelInterests.includes(interest)) {
      setTravelInterests(travelInterests.filter((item) => item !== interest));
    } else {
      setTravelInterests([...travelInterests, interest]);
    }
  };

  const getData = async () => {
    const responseSeachCountry: any = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&format=json&accept-language=es`
    );

    if (responseSeachCountry.ok) {
      const dataCountry = await responseSeachCountry.json();
      // console.log(dataCountry);
      setDataCountry(dataCountry);
    }

    const hotelsData = await useFetchData(
      location!.coords!.latitude.toString(),
      location!.coords!.longitude.toString(),
      "tourism",
      "hotel",
      "hoteles"
    );
    const restaurantsData = await useFetchData(
      location!.coords!.latitude.toString(),
      location!.coords!.longitude.toString(),
      "amenity",
      "restaurant",
      "restaurantes"
    );

    if (hotelsData.length > 0 && restaurantsData.length > 0) {
      setHotels(hotelsData);
      setRestaurants(restaurantsData);
    }
  };

  // Función para generar itinerario con IA
  const generateItinerary = async () => {
    setLoading(true);

    try {
      const prompt = `Genera un itinerario detallado de viaje para ${days} días en ${destination}. 
        Presupuesto: ${budget}. 
        Estilo de viaje: ${travelStyle}. 
        Intereses: ${travelInterests.join(", ")}.
        hoteles para los resultados: ${JSON.stringify(hotels.slice(0, 50))}
        restaurantes para los resultados: ${JSON.stringify(
          restaurants.slice(0, 50)
        )}
        
        Por favor, estructura el itinerario día por día, incluyendo:
        1. De 3 a 5 lugares a visitar por día con nombres reales.
        2. Una breve descripción de cada lugar (30-40 palabras).
        3. Incluye coordenadas GPS reales para cada lugar.
        4. Sugerencias de horarios aproximados para cada actividad.
        5. Restaurantes reales o zonas gastronómicas para comer.
        
        Formato deseado - por cada día:
        {
          "day": número,
          "title": "Título del día",
          "description": "Descripción breve del día",  
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
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await response.json();

      // Extraer el JSON del texto generado
      let jsonStr = data.completion;

      console.log("Respuesta del modelo:", jsonStr);

      // Buscar el primer [ y el último ]
      const startIndex = jsonStr.indexOf("[");
      const endIndex = jsonStr.lastIndexOf("]") + 1;

      if (startIndex >= 0 && endIndex > startIndex) {
        jsonStr = jsonStr.substring(startIndex, endIndex);
      }

      // Parsear el JSON
      try {
        const parsedData = JSON.parse(jsonStr);
        setItinerary(parsedData);
        setCurrentStep(5); // Avanzar al paso de visualización
      } catch (e) {
        console.error("Error al parsear el JSON:", e);
        alert(
          "Hubo un error al generar el itinerario. Por favor intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al generar itinerario:", error);
      alert(
        "Hubo un error al comunicarse con el servicio. Por favor intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir mapa con la ubicación
  const openMap = (lat, lng, name) => {
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url =
      Platform.OS === "ios"
        ? `${scheme}?q=${lat},${lng}&z=16`
        : `${scheme}${lat},${lng}?q=${lat},${lng}(${name})`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback para web
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        );
      }
    });
  };

  // Renderizado de los pasos del formulario
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Text style={styles.stepTitle}>¿A dónde te gustaría viajar?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Ciudad de México, París, Tokio..."
              value={destination}
              onChangeText={setDestination}
            />
            <Text style={styles.stepDescription}>
              Ingresa la ciudad o país que deseas visitar para generar un
              itinerario personalizado.
            </Text>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Text style={styles.stepTitle}>¿Cuántos días durará tu viaje?</Text>
            <View style={styles.daysSelector}>
              {[1, 2, 3, 5, 7, 10, 14].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    days === day.toString() && styles.selectedDayButton,
                  ]}
                  onPress={() => setDays(day.toString())}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      days === day.toString() && styles.selectedDayButtonText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="O ingresa un número personalizado"
              value={days}
              onChangeText={(text) => {
                // Permitir solo números
                if (/^\d*$/.test(text)) {
                  setDays(text);
                }
              }}
              keyboardType="numeric"
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Text style={styles.stepTitle}>¿Cuál es tu presupuesto?</Text>
            <View style={styles.optionsContainer}>
              {budgetOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    budget === option && styles.selectedOptionButton,
                  ]}
                  onPress={() => setBudget(option)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      budget === option && styles.selectedOptionButtonText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.stepDescription}>
              Selecciona el nivel de presupuesto para personalizar las
              recomendaciones de lugares y actividades.
            </Text>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Text style={styles.stepTitle}>
              ¿Qué estilo de viaje prefieres?
            </Text>
            <View style={styles.optionsContainer}>
              {travelStyleOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    travelStyle === option && styles.selectedOptionButton,
                  ]}
                  onPress={() => setTravelStyle(option)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      travelStyle === option && styles.selectedOptionButtonText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.stepDescription}>
              Tu estilo de viaje nos ayuda a recomendar lugares y actividades
              que se alineen con tus preferencias.
            </Text>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
            <Text style={styles.stepTitle}>¿Qué te interesa visitar?</Text>
            <Text style={styles.stepSubtitle}>
              Selecciona todas las que apliquen
            </Text>
            <View style={styles.interestsContainer}>
              {interestOptions.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestButton,
                    travelInterests.includes(interest) &&
                      styles.selectedInterestButton,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestButtonText,
                      travelInterests.includes(interest) &&
                        styles.selectedInterestButtonText,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateItinerary}
              disabled={loading}
            >
              <LinearGradient
                colors={["#4F6CEF", "#5B42F3"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Feather
                      name="map"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.generateButtonText}>
                      Generar Itinerario
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View
            style={[styles.resultContainer, { opacity: fadeAnim }]}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                Tu Itinerario para {destination}
              </Text>
              <Text style={styles.resultSubtitle}>
                {days} días • {budget} • {travelStyle}
              </Text>
              <View style={styles.interestTagsContainer}>
                {travelInterests.map((interest) => (
                  <View key={interest} style={styles.interestTag}>
                    <Text style={styles.interestTagText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5B42F3" />
                <Text style={styles.loadingText}>
                  Generando tu itinerario perfecto...
                </Text>
                <Text style={styles.loadingSubtext}>
                  Esto puede tomar unos momentos
                </Text>
              </View>
            ) : itinerary ? (
              <ScrollView style={styles.itineraryContainer}>
                {itinerary.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <TouchableOpacity
                      style={styles.dayHeader}
                      onPress={() => toggleDay(index)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={["#4F6CEF", "#5B42F3"]}
                        style={styles.gradientDayHeader}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.dayTitle}>Día {day.day}</Text>
                        <MaterialIcons
                          name={
                            expandedDay === index
                              ? "keyboard-arrow-up"
                              : "keyboard-arrow-down"
                          }
                          size={24}
                          color="#fff"
                        />
                      </LinearGradient>
                    </TouchableOpacity>

                    {expandedDay === index && (
                      <View style={styles.dayContent}>
                        {day.places.map((place, placeIndex) => (
                          <View key={placeIndex} style={styles.placeCard}>
                            <Image
                              source={{
                                uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(
                                  place.imagePrompt ||
                                    place.name + " en " + destination
                                )}&aspect=16:9&seed=${
                                  index * 100 + placeIndex
                                }`,
                              }}
                              style={styles.placeImage}
                              resizeMode="cover"
                            />
                            <View style={styles.placeInfo}>
                              <View style={styles.placeTimeRow}>
                                <Ionicons
                                  name="time-outline"
                                  size={16}
                                  color="#5B42F3"
                                />
                                <Text style={styles.placeTime}>
                                  {place.time}
                                </Text>
                              </View>
                              <Text style={styles.placeName}>{place.name}</Text>
                              <Text style={styles.placeDescription}>
                                {place.description}
                              </Text>
                              <TouchableOpacity
                                style={styles.directionButton}
                                onPress={() =>
                                  openMap(
                                    place.coordinates.lat,
                                    place.coordinates.lng,
                                    place.name
                                  )
                                }
                              >
                                <Ionicons
                                  name="navigate"
                                  size={18}
                                  color="#5B42F3"
                                />
                                <Text style={styles.directionButtonText}>
                                  Cómo llegar
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>
                  No se ha generado ningún itinerario
                </Text>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => setCurrentStep(0)}
                >
                  <LinearGradient
                    colors={["#4F6CEF", "#5B42F3"]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.generateButtonText}>
                      Comenzar de nuevo
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentStep < 5 && (
        <View style={styles.header}>
          <LinearGradient
            colors={["#4F6CEF", "#5B42F3"]}
            style={styles.gradientHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.headerTitle}>TravelPlanner IA</Text>
            <Text style={styles.headerSubtitle}>
              Tu asistente personal de viajes
            </Text>
          </LinearGradient>

          <View style={styles.stepsContainer}>
            {[0, 1, 2, 3, 4].map((step) => (
              <View key={step} style={styles.stepIndicatorContainer}>
                <View
                  style={[
                    styles.stepIndicator,
                    currentStep === step
                      ? styles.currentStepIndicator
                      : currentStep > step
                      ? styles.completedStepIndicator
                      : null,
                  ]}
                >
                  {currentStep > step ? (
                    <MaterialIcons name="check" size={14} color="#fff" />
                  ) : (
                    <Text
                      style={[
                        styles.stepIndicatorText,
                        currentStep === step && styles.currentStepIndicatorText,
                      ]}
                    >
                      {step + 1}
                    </Text>
                  )}
                </View>
                {step < 4 && (
                  <View
                    style={[
                      styles.stepConnector,
                      currentStep > step && styles.completedStepConnector,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      {currentStep < 5 && (
        <View style={styles.navigationButtonsContainer}>
          {currentStep > 0 && currentStep < 5 && (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={prevStep}
            >
              <MaterialIcons name="arrow-back" size={24} color="#4F6CEF" />
              <Text style={styles.navigationButtonText}>Atrás</Text>
            </TouchableOpacity>
          )}

          {currentStep < 4 && (
            <TouchableOpacity
              style={[styles.navigationButton, styles.nextButton]}
              onPress={nextStep}
            >
              <Text
                style={[styles.navigationButtonText, styles.nextButtonText]}
              >
                Siguiente
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {currentStep === 5 && (
        <TouchableOpacity
          style={styles.floatingBackButton}
          onPress={() => setCurrentStep(0)}
        >
          <MaterialIcons name="replay" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fd",
  },
  header: {
    width: "100%",
  },
  gradientHeader: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  currentStepIndicator: {
    backgroundColor: "#5B42F3",
  },
  completedStepIndicator: {
    backgroundColor: "#4CAF50",
  },
  stepIndicatorText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#757575",
  },
  currentStepIndicatorText: {
    color: "#fff",
  },
  stepConnector: {
    width: (width - 32 - 26 * 5) / 4,
    height: 2,
    backgroundColor: "#e0e0e0",
  },
  completedStepConnector: {
    backgroundColor: "#4CAF50",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  stepSubtitle: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 14,
    color: "#757575",
    marginTop: 16,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  daysSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#f0f3f8",
    margin: 5,
  },
  selectedDayButton: {
    backgroundColor: "#5B42F3",
  },
  dayButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDayButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#f0f3f8",
    margin: 5,
  },
  selectedOptionButton: {
    backgroundColor: "#5B42F3",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  interestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f3f8",
    margin: 5,
  },
  selectedInterestButton: {
    backgroundColor: "#5B42F3",
  },
  interestButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedInterestButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: "#5B42F3",
  },
  navigationButtonText: {
    fontSize: 16,
    color: "#5B42F3",
    marginHorizontal: 8,
  },
  nextButtonText: {
    color: "#fff",
  },
  generateButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  resultHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  resultSubtitle: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  interestTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  interestTag: {
    backgroundColor: "#f0f3f8",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  interestTagText: {
    fontSize: 12,
    color: "#5B42F3",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#757575",
    marginTop: 6,
    textAlign: "center",
  },
  itineraryContainer: {
    flex: 1,
    padding: 12,
  },
  dayContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  dayHeader: {
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  dayContent: {
    padding: 12,
  },
  placeCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#efefef",
  },
  placeImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#f0f0f0",
  },
  placeInfo: {
    padding: 12,
  },
  placeTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  placeTime: {
    fontSize: 12,
    color: "#5B42F3",
    marginLeft: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  placeDescription: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
    marginBottom: 12,
  },
  directionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#5B42F3",
    borderRadius: 20,
  },
  directionButtonText: {
    color: "#5B42F3",
    fontSize: 14,
    marginLeft: 4,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  noResultText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  floatingBackButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5B42F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TravelPlannerApp;
