import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import data from "@/data.json";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");
const QuickAccess = ({ theme }: { theme: any }) => {
  const quickAccessOptions = [
    {
      id: 1,
      title: "Restaurantes",
      icon: "utensils",
      color: "#F72585",
      radius: data.DATA[0].category[0].radius,
      keyword: data.DATA[0].category[0].keyword,
      type: data.DATA[0].category[0].type,
    },
    {
      id: 2,
      title: "Hoteles",
      icon: "hotel",
      color: "#7209B7",
      radius: data.DATA[1].category[0].radius,
      keyword: data.DATA[1].category[0].keyword,
      type: data.DATA[1].category[0].type,
    },
    {
      id: 3,
      title: "Gasolineras",
      icon: "gas-pump",
      color: "#3A0CA3",
      radius: data.DATA[7].category[0].radius,
      keyword: data.DATA[7].category[0].keyword,
      type: data.DATA[7].category[0].type,
    },
    {
      id: 4,
      title: "Atracciones",
      icon: "map-marker-alt",
      color: "#4361EE",
      radius: data.DATA[3].category[10].radius,
      keyword: data.DATA[3].category[10].keyword,
      type: data.DATA[3].category[10].type,
    },
    {
      id: 5,
      title: "Tiendas",
      icon: "shopping-bag",
      color: "#4CC9F0",
      radius: data.DATA[2].category[0].radius,
      keyword: data.DATA[2].category[0].keyword,
      type: data.DATA[2].category[0].type,
    },
    {
      id: 6,
      title: "Hospitales",
      icon: "hospital",
      color: "#F94144",
      radius: data.DATA[5].category[0].radius,
      keyword: data.DATA[5].category[0].keyword,
      type: data.DATA[5].category[0].type,
    },
    {
      id: 7,
      title: "pet store",
      icon: "prescription-bottle-alt",
      color: "#F3722C",
      radius: data.DATA[2].category[2].radius,
      keyword: data.DATA[2].category[2].keyword,
      type: data.DATA[2].category[2].type,
    },
    {
      id: 8,
      title: "Bancos",
      icon: "university",
      color: "#F8961E",
      radius: data.DATA[7].category[1].radius,
      keyword: data.DATA[7].category[1].keyword,
      type: data.DATA[7].category[1].type,
    },
  ];

  return (
    <View style={styles.quickAccessContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Accesos Rápidos
        </Text>
      </View>
      <View style={styles.quickAccessGrid}>
        {quickAccessOptions.map((item) => (
          <Link
            key={item.id}
            style={[
              styles.quickAccessItem,
              { backgroundColor: theme.cardBackground },
            ]}
            href={{
              pathname: "/view-maps-category/[title]",
              params: {
                title: item.title.toLowerCase(),
                radius: item.radius,
                keyword: item.keyword,
                type: item.type,
              },
            }}
            asChild
          >
            <Pressable>
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <FontAwesome5 name={item.icon} size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.quickAccessText, { color: theme.text }]}>
                {item.title}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickAccessContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAccessItem: {
    width: (width - 32 - 16) / 4, // 4 elementos por fila con padding
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default QuickAccess;
