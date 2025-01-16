import { Image, Pressable, Text, View } from "react-native";
import { IconArrow } from "./ui/iconsList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";

export default function CardDetailsItinerary({ item }: any) {
  const colorText = useThemeColor({}, "text");

  console.log(item);

  return (
    <Link
      href={{
        pathname: "/itinerario/[itinerarioDetails]",
        params: {
          itinerarioDetails: JSON.stringify(item),
        },
      }}
      asChild
    >
      <Pressable>
        <View
          style={{
            height: 150,
            alignItems: "center",
            backgroundColor: "rgba(245, 222, 179, 1)",
            borderRadius: 10,
            flexDirection: "row",
            paddingHorizontal: 10,
            marginBottom: 10,
            borderColor: colorText,
            borderWidth: 1,
          }}
        >
          <Image
            source={require("../assets/images/itinerary.png")}
            style={{ width: 80, height: 80 }}
          />
          <View style={{ marginLeft: 10, flex: 1, gap: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>
              {item.name}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Creado el:
              </Text>
              <Text style={{ color: "grey" }}>
                {" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold", color: "black" }}>Pais:</Text>
              <Text style={{ color: "grey" }}> {item.pais}</Text>
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Ciudad:
              </Text>
              <Text style={{ color: "grey" }}> {item.ciudad}</Text>
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Total de dias:
              </Text>
              <Text style={{ color: "grey" }}> {item.itinerary.length}</Text>
            </Text>
          </View>
          <Text style={{ marginRight: 10 }}>
            <IconArrow color="black" />
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
