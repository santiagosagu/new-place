import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const imageBackground = require("../assets/images/fondo-card-destails.jpg");
import i18n from "@/i18n";
import { useThemeColor } from "@/hooks/useThemeColor";

type CardListCategoryProps = {
  title: string;
  imageSource: any;
  dataCategoryPlaces: any;
  id: string;
};

export default function CardListCategory({
  title,
  imageSource,
  id,
}: CardListCategoryProps) {
  const backgroundColor = useThemeColor({}, "backgroundCard");
  const backgroundColorTransparent = useThemeColor(
    {},
    "backgroundCardTransparent"
  );

  return (
    <Link
      href={{
        pathname: "/[id]",
        params: { id: id },
      }}
      asChild
      style={[styles.container, { backgroundColor: backgroundColor }]}
    >
      <Pressable>
        {/* <ImageBackground
          source={{
            uri: imageSource.toString(),
          }}
          style={styles.containerImage}
          borderRadius={20}
        > */}
        <View
          style={[
            styles.containerFlex,
            { backgroundColor: backgroundColorTransparent },
          ]}
        >
          <View style={styles.containerImage}>
            <Image
              source={{ uri: imageSource }}
              style={{
                width: 100,
                height: 100,
                borderBottomLeftRadius: 90,
                borderRadius: 10,
              }}
            />
          </View>
          <View style={styles.containerText}>
            <Text style={styles.title}>
              {i18n.t(`categorias.${title}`, { defaultValue: title })}
            </Text>
          </View>
        </View>
        {/* </ImageBackground> */}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    height: 150,
    marginVertical: 8,
    borderColor: "#efefef",
    borderWidth: 1,
    // borderBottomLeftRadius: 90,
  },
  containerFlex: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 90,
    borderRadius: 20,
  },
  containerImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#049CE4",
  },
  containerText: {
    backgroundColor: "#049CE4",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    opacity: 0.9,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
