import CardListCategory from "@/components/cardListCategory";
import {
  IconCafe,
  IconFitness,
  IconHotel,
  IconMall,
  IconOfficeTuristic,
  IconPlaceOfWorship,
  IconRestaurant,
  IconSports,
  IconSupermarket,
} from "@/components/ui/iconsList";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import data from "../../data.json";

export default function HomeScreen() {
  const width = Dimensions.get("window").width;

  const DATA = [
    {
      id: "1",
      title: "Servicios",
      image:
        "https://i.pinimg.com/236x/c6/95/09/c6950930dccac1f4b00a4bd0f3b36931.jpg",
    },
    {
      id: "2",
      title: "Productos",
      image:
        "https://i.pinimg.com/736x/89/5d/2c/895d2c2ec10b67f3a05a2689a1d897d2.jpg",
    },
    {
      id: "3",
      title: "Contacto",
      image:
        "https://i.pinimg.com/236x/41/84/51/418451090eae29c05f99caf1383ce77b.jpg",
    },
    {
      id: "4",
      title: "Nosotros",
      image:
        "https://i.pinimg.com/236x/e1/f5/3d/e1f53dd4504e9ecd20f0a9ca06f25849.jpg",
    },
    {
      id: "5",
      title: "Blog",
      image:
        "https://i.pinimg.com/236x/db/b7/4d/dbb74dfbb72c448a460c8bf60d1aca73.jpg",
    },
    {
      id: "6",
      title: "Cotizaciones",
      image:
        "https://i.pinimg.com/236x/85/1c/3b/851c3b8a595772d693c74b733b41a46a.jpg",
    },
  ];

  const dataSectionIcon = [
    {
      id: "1",
      title: "Restaurantes",
      icon: <IconRestaurant />,
    },
    {
      id: "2",
      title: "cafeterias",
      icon: <IconCafe />,
    },
    {
      id: "3",
      title: "Hoteles",
      icon: <IconHotel />,
    },
    {
      id: "4",
      title: "oficinas turisticas",
      icon: <IconOfficeTuristic />,
    },
    {
      id: "5",
      title: "Mall",
      icon: <IconMall />,
    },
    {
      id: "6",
      title: "Supermercados",
      icon: <IconSupermarket />,
    },
    {
      id: "7",
      title: "Centros deportivos",
      icon: <IconSports />,
    },
    {
      id: "8",
      title: "Gimnasios",
      icon: <IconFitness />,
    },
    {
      id: "9",
      title: "Iglesias",
      icon: <IconPlaceOfWorship />,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: width / 1.5 }}>
        <Carousel
          loop
          width={width}
          height={width / 1.5}
          autoPlay={true}
          data={DATA}
          scrollAnimationDuration={5000}
          // onSnapToItem={(index) => console.log("current index:", index)}
          renderItem={({ item, index }) => (
            <View style={styles.containerCardCarousel} key={index}>
              <Image style={styles.image} source={{ uri: item.image }} />
            </View>
          )}
        />
      </View>
      <View style={styles.containerSectionIcons}>
        {dataSectionIcon.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
              },
            ]}
            onPress={() => console.log("press", item.title)}
          >
            <View style={styles.iconCustom}>
              <View
                style={{
                  margin: 8,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 3,
                  }}
                >
                  {item.icon}
                </View>
              </View>
              {/* <Text>{item.title}</Text> */}
            </View>
          </Pressable>
        ))}
      </View>
      <FlatList
        style={{
          padding: 0,
          flex: 1,
          margin: 0,
          marginTop: 10,
        }}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    flexDirection: "column",
  },
  containerCardCarousel: {
    // flex: 1,
    borderWidth: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0000",
    marginLeft: 25,
    marginTop: 25,
    borderRadius: 20,
    width: "80%",
    // shadowColor: "red",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    borderRadius: 20,
  },
  containerSectionIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderColor: "white",
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    margin: 5,
    marginTop: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCustom: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#000",
    marginVertical: 10,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
