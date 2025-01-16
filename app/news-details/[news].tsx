// NewsDetailScreen.js
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function NewsDetailScreen() {
  const { news } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalles de la noticia",
        }}
      />
      <WebView source={{ uri: news.toString() }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
