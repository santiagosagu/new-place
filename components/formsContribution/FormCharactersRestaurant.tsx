import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

enum Wifi {
  FREE = "free",
  PAID = "paid",
  NO = "no",
}

enum YesNo {
  YES = "yes",
  NO = "no",
}

enum Noise {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
}

enum Parking {
  OWN = "own",
  VALET = "valet",
  STREET = "street",
  NO = "no",
}

interface IParking {
  own: string;
  valet: string;
  street: string;
  no: string;
}

interface IPaymentMethods {
  cash: string;
  credit_card: string;
  debit_card: string;
  mobile_payment: string;
  crypto_currency: string;
}

interface IStyle {
  familiar: number;
  casual: number;
  formal: number;
  romantic: number;
  modern: number;
  traditional: number;
}

interface IReview {
  attributes: {
    wifi: Wifi.FREE | Wifi.PAID | Wifi.NO | "";
    parking: string[];
    delivery: YesNo.YES | YesNo.NO | "";
    payment_methods: string[];
  };
  accessibility: YesNo.YES | YesNo.NO | "";
  atmosphere_and_experience: {
    style: string[];
    noise: Noise.LOW | Noise.MODERATE | Noise.HIGH | "";
  };
}

export default function FormCharactersRestaurant({
  placeId,
  contributions,
  userDataContributions,
  setModalVisible,
  setRelounding,
}: {
  placeId: string;
  contributions: string[] | [];
  userDataContributions: any;
  setModalVisible: (visible: boolean) => void;
  setRelounding: (reloading: boolean) => void;
}) {
  const textColor = useThemeColor({}, "text");

  const [review, setReview] = useState<IReview>({
    attributes: {
      wifi: "",
      parking: [],
      delivery: "",
      payment_methods: [],
    },
    accessibility: "",
    atmosphere_and_experience: {
      style: [],
      noise: "",
    },
  });

  useEffect(() => {
    if (userDataContributions) {
      console.log("userDataContributions", userDataContributions);
      setReview({
        attributes: {
          wifi: userDataContributions.attributes.wifi || "",
          parking: userDataContributions.attributes.parking || [],
          delivery: userDataContributions.attributes.delivery || "",
          payment_methods:
            userDataContributions.attributes.payment_methods || [],
        },
        accessibility: userDataContributions.accessibility || "",
        atmosphere_and_experience: {
          style: userDataContributions.atmosphere_and_experience.style || [],
          noise: userDataContributions.atmosphere_and_experience.noise || "",
        },
      });
    }
  }, [userDataContributions]);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const user_id = await AsyncStorage.getItem("user_id");

    try {
      const response = await fetch(
        // `http://192.168.1.2:8080/api/place-add-contribution`,
        `https://back-new-place.onrender.com/api/place-add-contribution`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            place_id: placeId,
            user_id: user_id,
            type: "establishment",
            place_extra_details: review,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRelounding(true);
        Toast.show({
          type: "success", // o "success", "info"
          text1: "Contribucion agregada",
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

  const OptionButton = ({ title, selected, onPress, width = "48%" }: any) => (
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
    <ScrollView style={styles.content}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: textColor,
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 15,
          },
        ]}
      >
        Atributos:
      </Text>
      {(contributions as string[]).includes("wifi") && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Hay WiFi disponible?
          </Text>
          <View style={styles.optionsContainer}>
            <OptionButton
              title="Gratis"
              selected={review.attributes.wifi === Wifi.FREE}
              onPress={() =>
                setReview({
                  ...review,
                  attributes: { ...review.attributes, wifi: Wifi.FREE },
                })
              }
            />
            <OptionButton
              title="Pago"
              selected={review.attributes.wifi === Wifi.PAID}
              onPress={() =>
                setReview({
                  ...review,
                  attributes: { ...review.attributes, wifi: Wifi.PAID },
                })
              }
            />
            <OptionButton
              title="No"
              selected={review.attributes.wifi === Wifi.NO}
              onPress={() =>
                setReview({
                  ...review,
                  attributes: { ...review.attributes, wifi: Wifi.NO },
                })
              }
            />
          </View>
        </View>
      )}
      {(contributions as string[]).includes("parking") && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Cuenta con parking disponible?
          </Text>
          <View style={styles.optionsContainer}>
            {[Parking.OWN, Parking.VALET, Parking.STREET, Parking.NO].map(
              (tipo: string) => (
                <OptionButton
                  key={tipo}
                  title={tipo}
                  selected={review.attributes.parking.includes(tipo)}
                  onPress={() => {
                    const newParking = review.attributes.parking.includes(tipo)
                      ? review.attributes.parking.filter(
                          (item) => item !== tipo
                        )
                      : [...review.attributes.parking, tipo];
                    setReview({
                      ...review,
                      attributes: { ...review.attributes, parking: newParking },
                    });
                  }}
                  width="48%"
                />
              )
            )}
          </View>
        </View>
      )}
      {(contributions as string[]).includes("delivery") && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Cuenta con servicio de entrega?
          </Text>
          <View style={styles.optionsContainer}>
            <OptionButton
              title="Sí"
              selected={review.attributes.delivery === YesNo.YES}
              onPress={() =>
                setReview({
                  ...review,
                  attributes: { ...review.attributes, delivery: YesNo.YES },
                })
              }
            />
            <OptionButton
              title="No"
              selected={review.attributes.delivery === YesNo.NO}
              onPress={() =>
                setReview({
                  ...review,
                  attributes: { ...review.attributes, delivery: YesNo.NO },
                })
              }
            />
          </View>
        </View>
      )}
      {(contributions as string[]).includes("payment_methods") && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              ¿Medios de pago disponibles?
            </Text>
            <View style={styles.optionsContainer}>
              {[
                "cash",
                "credit_card",
                "debit_card",
                "mobile_payment",
                "crypto_currency",
              ].map((tipo) => (
                <OptionButton
                  key={tipo}
                  title={tipo}
                  selected={review.attributes.payment_methods.includes(tipo)}
                  onPress={() => {
                    const newPaymentMethods =
                      review.attributes.payment_methods.includes(tipo)
                        ? review.attributes.payment_methods.filter(
                            (item) => item !== tipo
                          )
                        : [...review.attributes.payment_methods, tipo];
                    setReview({
                      ...review,
                      attributes: {
                        ...review.attributes,
                        payment_methods: newPaymentMethods,
                      },
                    });
                  }}
                  width="48%"
                />
              ))}
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}
      {(contributions as string[]).includes("accessibility") && (
        <>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: textColor,
                fontSize: 22,
                fontWeight: "bold",
                marginVertical: 15,
              },
            ]}
          >
            Accesibilidad:
          </Text>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              ¿Accesibilidad para personas con discapacidad?
            </Text>
            <View style={styles.optionsContainer}>
              <OptionButton
                title="Sí"
                selected={review.accessibility === YesNo.YES}
                onPress={() =>
                  setReview({
                    ...review,
                    accessibility: YesNo.YES,
                  })
                }
              />
              <OptionButton
                title="No"
                selected={review.accessibility === YesNo.NO}
                onPress={() =>
                  setReview({
                    ...review,
                    accessibility: YesNo.NO,
                  })
                }
              />
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}
      {(contributions as string[]).includes("atmosphere_and_experience") && (
        <>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: textColor,
                fontSize: 22,
                fontWeight: "bold",
                marginVertical: 15,
              },
            ]}
          >
            Ambiente y experiencia:
          </Text>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              ¿Estilo del lugar?
            </Text>
            <View style={styles.optionsContainer}>
              {[
                "familiar",
                "casual",
                "formal",
                "romantic",
                "modern",
                "traditional",
              ].map((tipo) => (
                <OptionButton
                  key={tipo}
                  title={tipo}
                  selected={review.atmosphere_and_experience.style.includes(
                    tipo
                  )}
                  onPress={() => {
                    const newStyle =
                      review.atmosphere_and_experience.style.includes(tipo)
                        ? review.atmosphere_and_experience.style.filter(
                            (item) => item !== tipo
                          )
                        : [...review.atmosphere_and_experience.style, tipo];
                    setReview({
                      ...review,
                      atmosphere_and_experience: {
                        ...review.atmosphere_and_experience,
                        style: newStyle,
                      },
                    });
                  }}
                  width="48%"
                />
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              ¿Que tal el ruido?
            </Text>
            <View style={styles.optionsContainer}>
              <OptionButton
                title="Low"
                selected={review.atmosphere_and_experience.noise === Noise.LOW}
                onPress={() =>
                  setReview({
                    ...review,
                    atmosphere_and_experience: {
                      ...review.atmosphere_and_experience,
                      noise: Noise.LOW,
                    },
                  })
                }
              />
              <OptionButton
                title="Moderate"
                selected={
                  review.atmosphere_and_experience.noise === Noise.MODERATE
                }
                onPress={() =>
                  setReview({
                    ...review,
                    atmosphere_and_experience: {
                      ...review.atmosphere_and_experience,
                      noise: Noise.MODERATE,
                    },
                  })
                }
              />
              <OptionButton
                title="High"
                selected={review.atmosphere_and_experience.noise === Noise.HIGH}
                onPress={() =>
                  setReview({
                    ...review,
                    atmosphere_and_experience: {
                      ...review.atmosphere_and_experience,
                      noise: Noise.HIGH,
                    },
                  })
                }
              />
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}
      <View style={styles.sectionButton}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            console.log(review);
            handleSubmit();
            setModalVisible(false);
          }}
        >
          <Text style={styles.submitButtonText}>Enviar Evaluación</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    maxHeight: "100%",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
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
    backgroundColor: "#FF385C",
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
  sectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    width: "50%",
    marginBottom: 50,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#FF385C",
    marginVertical: 16,
  },
});
