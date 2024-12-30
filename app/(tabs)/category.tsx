import {
  Image,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
  View,
  FlatList,
  StatusBar,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardListCategory from "@/components/cardListCategory";
import React from "react";
import data from "../../data.json";

export default function CategoryScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data.DATA}
          renderItem={({ item }) => (
            <CardListCategory
              id={item.id}
              title={item.title}
              imageSource={item.image}
              dataCategoryPlaces={item.category}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
    marginHorizontal: 16,
  },
  containerSection: {
    marginVertical: 8,
  },

  titleCategory: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0a7ea4",
  },
});
