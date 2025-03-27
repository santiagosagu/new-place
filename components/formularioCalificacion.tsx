import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Rating } from "react-native-ratings";

export default function HomeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState({
    wifi: "",
    accessibility: "",
    ambiente: [],
    musica: "",
    calificacionPersonal: 0,
    calidadPrecio: "",
    accesibilidad: "",
    seguridad: "",
    comentario: "",
    calificacionGeneral: 0,
  });

  const OptionButton = ({ title, selected, onPress, width = "48%" }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        { width },
        selected && styles.selectedButton,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>Abrir Evaluación</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={styles.modal}
        propagateSwipe
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.indicator} />
            <Text style={styles.modalTitle}>Evaluar Lugar</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* WiFi Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>¿Hay WiFi disponible?</Text>
              <View style={styles.optionsContainer}>
                <OptionButton
                  title="Sí"
                  selected={review.wifi === "si"}
                  onPress={() => setReview({ ...review, wifi: "si" })}
                />
                <OptionButton
                  title="No"
                  selected={review.wifi === "no"}
                  onPress={() => setReview({ ...review, wifi: "no" })}
                />
              </View>
            </View>

            {/* Accessibility Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accesibilidad</Text>
              <View style={styles.optionsContainer}>
                <OptionButton
                  title="Entrada y Baño"
                  selected={review.accessibility === "completa"}
                  onPress={() =>
                    setReview({ ...review, accessibility: "completa" })
                  }
                  width="48%"
                />
                <OptionButton
                  title="Solo Entrada"
                  selected={review.accessibility === "entrada"}
                  onPress={() =>
                    setReview({ ...review, accessibility: "entrada" })
                  }
                  width="48%"
                />
                <OptionButton
                  title="Solo Baño"
                  selected={review.accessibility === "baño"}
                  onPress={() =>
                    setReview({ ...review, accessibility: "baño" })
                  }
                  width="48%"
                />
                <OptionButton
                  title="No Accesible"
                  selected={review.accessibility === "no"}
                  onPress={() => setReview({ ...review, accessibility: "no" })}
                  width="48%"
                />
              </View>
            </View>

            {/* Ambiente Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                ¿Cómo describes el ambiente?
              </Text>
              <View style={styles.optionsContainer}>
                {["Tranquilo", "Ruidoso", "Familiar", "Sofisticado"].map(
                  (tipo) => (
                    <OptionButton
                      key={tipo}
                      title={tipo}
                      selected={review.ambiente.includes(tipo)}
                      onPress={() => {
                        const newAmbiente = review.ambiente.includes(tipo)
                          ? review.ambiente.filter((item) => item !== tipo)
                          : [...review.ambiente, tipo];
                        setReview({ ...review, ambiente: newAmbiente });
                      }}
                      width="48%"
                    />
                  )
                )}
              </View>
            </View>

            {/* Music Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Música</Text>
              <View style={styles.optionsContainer}>
                <OptionButton
                  title="Agradable"
                  selected={review.musica === "agradable"}
                  onPress={() => setReview({ ...review, musica: "agradable" })}
                />
                <OptionButton
                  title="Desagradable"
                  selected={review.musica === "desagradable"}
                  onPress={() =>
                    setReview({ ...review, musica: "desagradable" })
                  }
                />
                <OptionButton
                  title="Sin Música"
                  selected={review.musica === "sin"}
                  onPress={() => setReview({ ...review, musica: "sin" })}
                />
              </View>
            </View>

            {/* Staff Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Calificación del Personal</Text>
              <Rating
                type="custom"
                ratingCount={5}
                imageSize={40}
                startingValue={review.calificacionPersonal}
                onFinishRating={(rating) =>
                  setReview({ ...review, calificacionPersonal: rating })
                }
                style={styles.rating}
              />
            </View>

            {/* Price-Quality Ratio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Relación Calidad-Precio</Text>
              <View style={styles.optionsContainer}>
                <OptionButton
                  title="Precios Justos"
                  selected={review.calidadPrecio === "justo"}
                  onPress={() =>
                    setReview({ ...review, calidadPrecio: "justo" })
                  }
                />
                <OptionButton
                  title="Precios Elevados"
                  selected={review.calidadPrecio === "elevado"}
                  onPress={() =>
                    setReview({ ...review, calidadPrecio: "elevado" })
                  }
                />
              </View>
            </View>

            {/* Transportation */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accesibilidad al Lugar</Text>
              <View style={styles.optionsContainer}>
                <OptionButton
                  title="Transporte Público"
                  selected={review.accesibilidad === "transporte"}
                  onPress={() =>
                    setReview({ ...review, accesibilidad: "transporte" })
                  }
                />
                <OptionButton
                  title="Estacionamiento"
                  selected={review.accesibilidad === "estacionamiento"}
                  onPress={() =>
                    setReview({ ...review, accesibilidad: "estacionamiento" })
                  }
                />
              </View>
            </View>

            {/* Security */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seguridad del Área</Text>
              <View style={styles.optionsContainer}>
                <OptionButton
                  title="Segura"
                  selected={review.seguridad === "segura"}
                  onPress={() => setReview({ ...review, seguridad: "segura" })}
                />
                <OptionButton
                  title="Insegura"
                  selected={review.seguridad === "insegura"}
                  onPress={() =>
                    setReview({ ...review, seguridad: "insegura" })
                  }
                />
              </View>
            </View>

            {/* Comments */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comentarios Adicionales</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={review.comentario}
                onChangeText={(text) =>
                  setReview({ ...review, comentario: text })
                }
                placeholder="Comparte tu experiencia..."
              />
            </View>

            {/* Overall Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Calificación General</Text>
              <Rating
                type="custom"
                ratingCount={5}
                imageSize={40}
                startingValue={review.calificacionGeneral}
                onFinishRating={(rating) =>
                  setReview({ ...review, calificacionGeneral: rating })
                }
                style={styles.rating}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log(review);
                setModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>Enviar Evaluación</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  openButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    alignItems: "center",
    paddingVertical: 15,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: "#DEDEDE",
    borderRadius: 2,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: "85%",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#2196F3",
  },
  optionText: {
    color: "#333",
    fontSize: 14,
  },
  selectedText: {
    color: "white",
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
  },
  rating: {
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
