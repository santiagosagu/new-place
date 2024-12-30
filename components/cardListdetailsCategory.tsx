import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconArrow } from "./ui/iconsList";
import { Link } from "expo-router";
import i18n from "@/i18n";

interface IProps {
  title: string;
  color?: string;
  categoryMap?: string;
  valueCategoryMap?: string;
  query?: string;
}

export default function CardListDetailsCategory({
  title,
  color,
  categoryMap,
  valueCategoryMap,
  query,
}: IProps) {
  return (
    <Link
      href={{
        pathname: "/view-maps-category/[title]",
        params: {
          title,
          categoryMap,
          valueCategoryMap,
          query,
        },
      }}
      asChild
    >
      <Pressable>
        <View style={[styles.containerBackground, { backgroundColor: color }]}>
          <View style={[styles.container]}>
            <Text style={styles.title}>
              {i18n.t(`categoriasInternas.${title}`, { defaultValue: title })}
            </Text>
            <Text>
              <IconArrow />
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  containerBackground: {
    height: 80,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  container: {
    width: "100%",
    // backgroundColor: "#efef",
    backgroundColor: "white",

    flex: 1,
    borderRadius: 10,
    borderBottomLeftRadius: 100,
    borderTopRightRadius: 100,
    opacity: 0.9,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingLeft: 20,
  },
  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
