import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import data from "../data.json";
import CardListCategory from "@/components/cardListCategory";
import CardListDetailsCategory from "@/components/cardListdetailsCategory";
import i18n from "@/i18n";

export default function DetailsCategory() {
  const { id } = useLocalSearchParams();
  const category = data.DATA.find((item) => item.id === id);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: i18n.t(`categorias.${category!.title}`, {
            defaultValue: category!.title,
          }),
        }}
      />

      {/* <View style={styles.container}> */}
      <FlatList
        data={category?.category}
        renderItem={({ item }) => (
          <CardListDetailsCategory
            title={item.title}
            color={item.color}
            categoryMap={item.categoryMap}
            valueCategoryMap={item.valueCategoryMap}
            query={item.query}
          />
        )}
        keyExtractor={(item) => item.title}
      />
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: 50,
    paddingHorizontal: 15,
  },
});
