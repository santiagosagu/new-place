import AccordionItem from "@/components/accordionItinerario";
import { IconAccordion } from "@/components/ui/iconsList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ItinerarioDetails() {
  const { itinerarioDetails } = useLocalSearchParams();

  const item = JSON.parse(itinerarioDetails as string);
  const colorText = useThemeColor({}, "text");
  const backgroundHeader = useThemeColor({}, "backgroundHeader");

  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleItem = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderAccordionItem = ({ item: itineraryItem, index }: any) => {
    return (
      <View style={[styles.content, { backgroundColor: backgroundHeader }]}>
        <Pressable onPress={() => toggleItem(index)}>
          <View style={styles.buttonContainer}>
            <Text
              style={{ fontSize: 16, color: colorText, fontWeight: "bold" }}
            >
              Día {itineraryItem.day}
            </Text>
            <IconAccordion
              name={expandedItems[index] ? "upcircle" : "downcircle"}
              color={colorText}
            />
          </View>
        </Pressable>
        {expandedItems[index] && (
          <View style={styles.details}>
            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <Text
                style={[styles.dayText, { width: "23%", fontWeight: "bold" }]}
              >
                Desayuno:
              </Text>
              <View style={{}}>
                <Text style={styles.dayText}>
                  {itineraryItem.breakfast.name}
                </Text>
                <Text style={styles.dayText}>
                  {itineraryItem.breakfast.cuisine}
                </Text>

                {itineraryItem.breakfast.descripcion && (
                  <Text style={styles.dayText}>
                    {itineraryItem.breakfast.descripcion}
                  </Text>
                )}

                <Pressable>
                  <View
                    style={{
                      backgroundColor: "rgba(245, 222, 179, 1)",
                      padding: 10,
                      width: 150,
                      marginVertical: 10,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#000",
                    }}
                  >
                    <Text style={{ color: "black", textAlign: "center" }}>
                      Viajar al lugar
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <Text
                style={[styles.dayText, { width: "23%", fontWeight: "bold" }]}
              >
                Almuerzo:
              </Text>
              <View style={{}}>
                <Text style={styles.dayText}>{itineraryItem.lunch.name}</Text>
                <Text style={styles.dayText}>
                  {itineraryItem.lunch.cuisine}
                </Text>
                {itineraryItem.lunch.descripcion && (
                  <Text style={styles.dayText}>
                    {itineraryItem.lunch.descripcion}
                  </Text>
                )}

                <Pressable>
                  <View
                    style={{
                      backgroundColor: "rgba(245, 222, 179, 1)",
                      padding: 10,
                      width: 150,
                      marginVertical: 10,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#000",
                    }}
                  >
                    <Text style={{ color: "black", textAlign: "center" }}>
                      Viajar al lugar
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <Text
                style={[styles.dayText, { width: "23%", fontWeight: "bold" }]}
              >
                Cena:
              </Text>
              <View style={{}}>
                <Text style={styles.dayText}>{itineraryItem.dinner.name}</Text>
                <Text style={styles.dayText}>
                  {itineraryItem.dinner.cuisine}
                </Text>

                {itineraryItem.dinner.descripcion && (
                  <Text style={styles.dayText}>
                    {itineraryItem.dinner.descripcion}
                  </Text>
                )}

                <Pressable>
                  <View
                    style={{
                      backgroundColor: "rgba(245, 222, 179, 1)",
                      padding: 10,
                      width: 150,
                      marginVertical: 10,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#000",
                    }}
                  >
                    <Text style={{ color: "black", textAlign: "center" }}>
                      Viajar al lugar
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `${item.name} - ${new Date(
            item.createdAt
          ).toLocaleDateString()}`,
        }}
      />
      <View>
        <View
          style={{
            justifyContent: "center",
            marginVertical: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: colorText }}>
            <Text style={{ fontWeight: "bold" }}>Ciudad: </Text>

            {item.ciudad}
          </Text>
          <Text style={{ fontSize: 16, color: colorText }}>
            <Text style={{ fontWeight: "bold" }}>Pais: </Text>
            {item.pais}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "rgba(245, 222, 179, 1)",
          padding: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#000",
        }}
      >
        <Text style={{ fontSize: 18, color: "black", fontWeight: "bold" }}>
          Hotel: {item.hotel.name}
        </Text>
        <Text style={{ fontSize: 16, color: "black" }}>
          {item.hotel.descripcion}
        </Text>
        <Pressable>
          <View
            style={{
              backgroundColor: "#049CE4",
              padding: 10,
              width: 150,
              marginVertical: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#000",
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Viajar al lugar
            </Text>
          </View>
        </Pressable>
      </View>
      <Text
        style={{
          fontSize: 16,
          color: colorText,
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        Tu itinerario para estos {item.itinerary.length} dias
      </Text>
      <FlatList
        data={item.itinerary}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderAccordionItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  buttonContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  content: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
  },
  details: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
    marginTop: 8,
  },
  dayText: {
    fontSize: 14,
    marginVertical: 4,
    width: 200,
    flexWrap: "wrap",
  },
});
