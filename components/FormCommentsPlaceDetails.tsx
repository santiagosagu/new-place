import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AirbnbRating, Rating } from "react-native-ratings";
import Toast from "react-native-toast-message";

export default function FormCommentsPlaceDetails({
  placeId,
  setModalVisible,
  setRelounding,
}: {
  placeId: string;
  setModalVisible: (visible: boolean) => void;
  setRelounding: (reloading: boolean) => void;
}) {
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const secondaryTextColor = useThemeColor({}, "subtext");

  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  console.log(review);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const user_id = await AsyncStorage.getItem("user_id");

    console.log("user_id", user_id);

    try {
      const response = await fetch(
        // `http://192.168.1.2:8080/api/place-add-comment`,
        `https://back-new-place.onrender.com/api/place-add-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            place_id: placeId,
            user_id: user_id,
            rating: review.rating,
            comment: review.comment,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRelounding(true);
        Toast.show({
          type: "success", // o "success", "info"
          text1: "Comentario agregado",
          text2: `${data.message}`,
          position: "top",
          visibilityTime: 8000, // duración en milisegundos (6 segundos)
          text1Style: {
            fontSize: 18,
            fontWeight: "bold",
          },
          text2Style: {
            fontSize: 14,
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: "error", // o "success", "info"
        text1: "Error al navegar",
        text2: `${(error as Error).message}`,
        position: "top",
        visibilityTime: 8000, // duración en milisegundos (6 segundos)
        text1Style: {
          fontSize: 18,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
      });
    }
  };

  return (
    <View style={styles.content}>
      <AirbnbRating
        count={5}
        reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
        defaultRating={0}
        onFinishRating={(rating: number) =>
          setReview({ ...review, rating: rating })
        }
      />
      <Text
        style={[styles.sectionTitle, { color: textColor, marginBottom: 15 }]}
      >
        Tu comentario
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: cardColor, color: textColor }]}
        multiline
        numberOfLines={8}
        value={review.comment}
        onChangeText={(text) => setReview({ ...review, comment: text })}
        placeholder="Comparte tu experiencia..."
        placeholderTextColor={secondaryTextColor}
      />
      <View>
        <View style={styles.sectionButton}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              handleSubmit();
              setModalVisible(false);
            }}
          >
            <Text style={styles.submitButtonText}>Enviar Comentario</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    maxHeight: "100%",
    paddingBottom: 50,
  },
  sectionTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  rating: {
    paddingVertical: 10,
  },
  input: {
    // backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    height: 150,
    textAlignVertical: "top",
  },
  sectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#FF385C",
    padding: 15,
    borderRadius: 10,
    width: "50%",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
