import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type AmenityItem = {
  value: string;
  count: number;
};

type AmenitiesData = {
  accessibility?: {
    disabled: {
      value: boolean;
      count: number;
    };
  };
  wifi?: {
    value: string;
    count: number;
  };
  parking?: AmenityItem[];
  delivery?: null | AmenityItem;
  payment_methods?: AmenityItem[];
  style?: AmenityItem[];
  noise?: {
    value: string;
    count: number;
  };
};

type Props = {
  amenities?: AmenitiesData;
};

const iconMap: Record<string, JSX.Element> = {
  wifi: <MaterialIcons name="wifi" size={20} color="#4CAF50" />,

  parking: <FontAwesome name="car" size={24} color="#3F51B5" />,
  delivery: <FontAwesome5 name="truck" size={20} color="#FF9800" />,
  payment_methods: <FontAwesome name="credit-card" size={20} color="#9C27B0" />,
  accessibility: <MaterialIcons name="accessible" size={20} color="#009688" />,
  style: <MaterialIcons name="style" size={20} color="#E91E63" />,
  noise: <MaterialIcons name="hearing" size={20} color="#607D8B" />,
};

const renderAmenityGroup = (
  title: string,
  data: AmenityItem[] | null | undefined,
  textColor: string,
  cardColor: string
) => {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.group}>
      <View style={styles.separator} />
      <View style={styles.groupHeader}>
        {iconMap[title]}
        <Text style={[styles.groupTitle, { color: textColor }]}>
          {title.replace("_", " ")}
        </Text>
      </View>
      {data.map((item, idx) => (
        <View
          key={idx}
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 4,
            },
          ]}
        >
          <Text style={[styles.itemText, { color: textColor, marginTop: 4 }]}>
            <AntDesign name="check" size={24} color="#FF385C" /> {item.value}
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                gap: 4,
                alignContent: "center",
                backgroundColor: textColor,
                padding: 4,
                borderRadius: 8,
                alignItems: "center",
              },
            ]}
          >
            <FontAwesome5 name="users" size={18} color="#FF385C" />
            <Text style={[{ color: cardColor, fontWeight: "bold" }]}>
              {item.count} voto{item.count !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const AmenitiesDisplay: React.FC<Props> = ({ amenities }) => {
  if (!amenities) return null;

  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "cardBackground");

  const groups = [
    {
      key: "wifi",
      items: amenities.wifi
        ? [{ value: amenities.wifi?.value, count: amenities.wifi.count }]
        : [],
    },
    {
      key: "parking",
      items: amenities.parking?.filter((p) => p.count > 0) ?? [],
    },
    {
      key: "delivery",
      // items: amenities?.delivery?.filter((d) => d.count > 0) ?? [],
      items: amenities.delivery
        ? [{ value: "Envío", count: amenities.delivery.count }]
        : [],
    },
    {
      key: "payment_methods",
      items: amenities.payment_methods?.filter((p) => p.count > 0) ?? [],
    },
    {
      key: "accessibility",
      items: amenities.accessibility?.disabled
        ? [
            {
              value: "Accesibilidad",
              count: amenities.accessibility.disabled.count,
            },
          ]
        : [],
    },
    {
      key: "style",
      items: amenities.style?.filter((s) => s.count > 0) ?? [],
    },
    {
      key: "noise",
      items: amenities.noise
        ? [{ value: amenities.noise.value, count: amenities.noise.count }]
        : [],
    },
  ];

  return (
    <View style={styles.container}>
      {/* <Text style={[styles.header, { color: textColor }]}>Características</Text> */}
      <FlatList
        data={groups}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) =>
          renderAmenityGroup(item.key, item.items, textColor, cardColor)
        }
        // ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default AmenitiesDisplay;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  group: {
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  groupTitle: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    textTransform: "capitalize",
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
    marginBottom: 16,
  },
});
