import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
// @ts-ignore
import notImage from "@/assets/images/notImage.png";

export default function NewsItem({ item }: any) {
  const backgroundColor = useThemeColor({}, "backgroundCard");
  const colorText = useThemeColor({}, "text");

  return (
    <Link
      href={{ pathname: "/news-details/[news]", params: { news: item.url } }}
      style={[styles.itemContainer, { backgroundColor }]}
      asChild
    >
      <Pressable

      //   onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 80, height: 80 }}
          />
        ) : (
          <Image source={notImage} style={{ width: 80, height: 80 }} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colorText }]}>{item.title}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    minHeight: 150,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
