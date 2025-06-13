import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AddNewPlaceFormProps {
  category: string;
  title: string;
  selectedPoint: {
    longitude: number;
    latitude: number;
  } | null;
  dispatch: React.Dispatch<React.SetStateAction<boolean>>;
  contributions: string;
}

export default function AddNewPlaceForm({
  category,
  selectedPoint,
  title,
  dispatch,
  contributions,
}: AddNewPlaceFormProps) {
  const cardColor = useThemeColor({}, "cardBackground");
  const secondaryTextColor = useThemeColor({}, "subtext");
  const colorText = useThemeColor({}, "text");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  console.log(
    "contributions",
    typeof contributions === "string" ? contributions.split(",") : contributions
  );

  const [images, setImages] = useState<
    { uri: string; mimeType?: string; fileName?: string }[]
  >([]);

  const pickImage = async (source: "gallery" | "camera") => {
    try {
      let result;
      if (source === "gallery") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          console.error("Se necesita permiso para acceder a la cámara");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      }

      if (!result.canceled && result.assets) {
        if (images.length >= 3) {
          console.error("Solo se permiten hasta 3 fotos");
          return;
        }
        const newImages = [...images];
        newImages.push({
          uri: result.assets[0].uri,
          mimeType: result.assets[0].mimeType,
          fileName: result.assets[0].fileName || undefined,
        });
        setImages(newImages);
      }
    } catch (error) {
      console.error("Error al capturar imagen:", error);
    }
  };

  const removeImage = (index: number) => {
    const newImagesSend = [...images];
    newImagesSend.splice(index, 1);
    setImages(newImagesSend);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<
    "success" | "error" | null
  >(null);

  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedPoint || !name || images.length === 0) {
      console.error("Todos los campos son requeridos");
      return;
    }

    setIsLoading(true);

    const user_id = await AsyncStorage.getItem("user_id");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("latitude", selectedPoint.latitude.toString());
      formData.append("longitude", selectedPoint.longitude.toString());
      formData.append("user_id", user_id || "");
      formData.append("category", category);
      formData.append("contributions", contributions);

      images.forEach((image, index) => {
        formData.append("media", {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: image.fileName || `image${index}.jpg`,
        } as any);
      });

      const response = await fetch(
        // "http://192.168.1.2:8080/api/new-place",
        "https://back-new-place.onrender.com/api/new-place",
        {
          method: "POST",
          body: formData,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Error al guardar el lugar");
      }

      const responseData = await response.json();
      setResponseMessage(responseData.message);
      console.log("Respuesta del servidor:", responseData);
      setResponseStatus("success");

      // Limpiar el formulario después de un guardado exitoso
      setName("");
      setDescription("");
      setImages([]);
      //TODO: descomentar para que se cierre la modal sola
      // setTimeout(() => {
      //   dispatch(false);
      // }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setResponseStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={[{ marginVertical: 8, marginHorizontal: 6 }]}>
      <Text style={[{ color: colorText, textAlign: "center", fontSize: 20 }]}>
        {i18n.t(`UI.aqui puedes agregar nuevos lugares`, {
          defaultValue: "Aquí puedes agregar nuevos lugares",
        })}
      </Text>
      <Text
        style={[
          {
            color: colorText,
            textAlign: "center",
            fontSize: 16,
            marginTop: 10,
          },
        ]}
      >
        {i18n.t(`UI.en la categoria`, { defaultValue: "En la categoría" })}{" "}
        <Text
          style={[
            {
              textTransform: "uppercase",
              color: "#FF385C",
              fontWeight: "bold",
            },
          ]}
        >
          {" "}
          {title}
        </Text>
      </Text>
      <Text
        style={[
          {
            color: colorText,
            textAlign: "center",
            fontSize: 16,
            marginTop: 10,
          },
        ]}
      >
        {i18n.t(`UI.si el lugar no pertenece`, {
          defaultValue:
            "si el lugar que quieres agregar no pertenece a esta categoría, puedes volver hacia atrás y seleccionar la categoría correcta",
        })}
      </Text>
      <View>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: cardColor, color: colorText },
          ]}
          placeholder={i18n.t(`UI.nombre del lugar`, {
            defaultValue: "Nombre del lugar",
          })}
          value={name}
          onChangeText={setName}
          placeholderTextColor={secondaryTextColor}
        />
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: cardColor, color: colorText },
          ]}
          placeholder={i18n.t(`UI.descripcion del lugar`, {
            defaultValue: "Descripción del lugar",
          })}
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={secondaryTextColor}
          multiline
          numberOfLines={4}
        />
      </View>
      <View>
        <View>
          {images.length < 3 && (
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity
                style={[styles.addImageButton]}
                onPress={() => pickImage("gallery")}
              >
                <Ionicons name="images" size={30} color="#FF385C" />
                <Text style={styles.buttonText}>
                  {i18n.t("UI.galeria", { defaultValue: "Galería" })}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addImageButton]}
                onPress={() => pickImage("camera")}
              >
                <Ionicons name="camera" size={30} color="#FF385C" />
                <Text style={styles.buttonText}>
                  {i18n.t("UI.camara", { defaultValue: "Cámara" })}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.imagePickerContainer}>
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
          </View>
        </View>
      </View>
      <View style={styles.alertContainer}>
        {isLoading && (
          <View style={[styles.alert, styles.alertLoading]}>
            <ActivityIndicator size="small" color="#FFB74D" />
            <Text style={[styles.alertText, { color: "#FFB74D" }]}>
              {i18n.t("UI.cargando", { defaultValue: "Cargando..." })}
            </Text>
          </View>
        )}
        {!isLoading && responseStatus && (
          <View
            style={[
              styles.alert,
              responseStatus === "success"
                ? styles.alertSuccess
                : styles.alertError,
            ]}
          >
            <Ionicons
              name={
                responseStatus === "success"
                  ? "checkmark-circle"
                  : "alert-circle"
              }
              size={20}
              color={responseStatus === "success" ? "#4CAF50" : "#F44336"}
            />
            <Text
              style={[
                styles.alertText,
                {
                  color: responseStatus === "success" ? "#4CAF50" : "#F44336",
                },
              ]}
            >
              {responseStatus === "success"
                ? i18n.t("UI.lugarGuardado", {
                    defaultValue: responseMessage,
                  })
                : i18n.t("UI.errorGuardar", {
                    defaultValue: "Error al guardar el lugar",
                  })}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.saveButton,
          (isLoading ||
            images.length === 0 ||
            !selectedPoint ||
            name === "") && { backgroundColor: "#808080" },
        ]}
        onPress={handleSave}
        disabled={
          isLoading || images.length === 0 || !selectedPoint || name === ""
        }
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>
            {i18n.t("UI.guardar", { defaultValue: "Guardar" })}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  alert: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  alertLoading: {
    borderColor: "#FFB74D",
    backgroundColor: "#FFF3E0",
  },
  alertSuccess: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  alertError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  alertText: {
    textAlign: "center",
    fontSize: 14,
    marginLeft: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: "#FF385C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FF385C",
    marginTop: 4,
    fontSize: 12,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#FF385C",
  },
  imagePickerContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  selectedImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    position: "relative",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
});
