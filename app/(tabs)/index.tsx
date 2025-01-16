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
  ScrollView,
} from "react-native";
// import Carousel from "react-native-reanimated-carousel";
import * as RNLocalize from "react-native-localize";
import data from "../../data.json";
import Rive, { RiveRef } from "rive-react-native";
import { useEffect, useRef, useState } from "react";
import { Link, Stack } from "expo-router";
import { useLocation } from "@/hooks/location/useLocation";
//@ts-ignore
import newsImage from "@/assets/images/world-news.png";
//@ts-ignore
import restaurantIcon from "@/assets/images/restaurant.png";
//@ts-ignore
import coffeeIcon from "@/assets/images/iconsIndex/coffee.png";
//@ts-ignore
import hotelIcon from "@/assets/images/iconsIndex/bed.png";
//@ts-ignore
import mallIcon from "@/assets/images/iconsIndex/shopping-bag.png";
//@ts-ignore
import supermarketIcon from "@/assets/images/iconsIndex/shopping-cart.png";
//@ts-ignore
import fitnessIcon from "@/assets/images/iconsIndex/stationary-bicycle.png";
//@ts-ignore
import iglesiaIcon from "@/assets/images/iconsIndex/church.png";
//@ts-ignore
import gasolineraIcon from "@/assets/images/iconsIndex/filling.png";
//@ts-ignore
import hospitalIcon from "@/assets/images/iconsIndex/hospital.png";

import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";

export default function HomeScreen() {
  const width = Dimensions.get("window").width;
  const riveRefPaisaje = useRef<RiveRef>(null);
  const [time, setTime] = useState("");
  const [colorTextDark, setColorTextDark] = useState(false);
  const [night, setNight] = useState(false);
  const [tiempo, setTiempo] = useState<any>(null);
  const colorText = useThemeColor({}, "text");

  let date = new Date();
  let month = date.toLocaleString("en-ES", { month: "long" });
  let day = date.getDate();
  let year = date.getFullYear();
  let dateStr = `${day} ${month} ${year}`;

  const { location } = useLocation();

  const dataSectionIcon = [
    {
      id: "1",
      title: data.DATA[0].category[0].title,
      icon: <Image source={restaurantIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[0].category[0].categoryMap,
      valueCategoryMap: data.DATA[0].category[0].valueCategoryMap,
      query: data.DATA[0].category[0].query,
    },
    {
      id: "2",
      title: data.DATA[0].category[1].title,
      icon: <Image source={coffeeIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[0].category[1].categoryMap,
      valueCategoryMap: data.DATA[0].category[1].valueCategoryMap,
      query: data.DATA[0].category[1].query,
    },
    {
      id: "3",
      title: data.DATA[1].category[0].title,
      icon: <Image source={hotelIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[1].category[0].categoryMap,
      valueCategoryMap: data.DATA[1].category[0].valueCategoryMap,
      query: data.DATA[1].category[0].query,
    },
    {
      id: "4",
      title: data.DATA[0].category[7].title,
      icon: <Image source={gasolineraIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[0].category[7].categoryMap,
      valueCategoryMap: data.DATA[0].category[7].valueCategoryMap,
      query: data.DATA[0].category[7].query,
    },
    {
      id: "5",
      title: data.DATA[2].category[0].title,
      icon: <Image source={mallIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[2].category[0].categoryMap,
      valueCategoryMap: data.DATA[2].category[0].valueCategoryMap,
      query: data.DATA[2].category[0].query,
    },
    {
      id: "6",
      title: data.DATA[2].category[1].title,
      icon: (
        <Image source={supermarketIcon} style={{ width: 40, height: 40 }} />
      ),
      categoryMap: data.DATA[2].category[1].categoryMap,
      valueCategoryMap: data.DATA[2].category[1].valueCategoryMap,
      query: data.DATA[2].category[1].query,
    },
    {
      id: "7",
      title: data.DATA[5].category[0].title,
      icon: <Image source={hospitalIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[5].category[0].categoryMap,
      valueCategoryMap: data.DATA[5].category[0].valueCategoryMap,
      query: data.DATA[5].category[0].query,
    },
    {
      id: "8",
      title: data.DATA[3].category[3].title,
      icon: <Image source={fitnessIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[3].category[3].categoryMap,
      valueCategoryMap: data.DATA[3].category[3].valueCategoryMap,
      query: data.DATA[3].category[3].query,
    },
    {
      id: "9",
      title: data.DATA[7].category[0].title,
      icon: <Image source={iglesiaIcon} style={{ width: 40, height: 40 }} />,
      categoryMap: data.DATA[7].category[0].categoryMap,
      valueCategoryMap: data.DATA[7].category[0].valueCategoryMap,
      query: data.DATA[7].category[0].query,
    },
  ];

  useEffect(() => {
    if (riveRefPaisaje.current) {
      handlePlay();
    }
  }, []);

  const handlePlay = () => {
    riveRefPaisaje.current?.play();
  };

  useEffect(() => {
    riveRefPaisaje.current?.setInputState(
      "State Machine 1",
      "Theme toggled",
      night
    );
  }, [night]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      setTime(currentTime.toTimeString().split(" ")[0].slice(0, 5));

      if (hours >= 18) {
        setNight(true);
        setColorTextDark(true);
      } else {
        setNight(false);
        setColorTextDark(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchClima = async () => {
    if (location) {
      const idiomaUser = RNLocalize.getLocales()[0].languageCode;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&units=metric&lang=${idiomaUser}&appid=0742652bbd26704d89c7dde84fd1417f&units=standard`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTiempo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    if (location) {
      fetchClima();
    }
  }, [location]);

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 100,
          borderRadius: 20,
          marginTop: 10,
          backgroundColor: "transparent",

          // backgroundColor: "white",
        }}
      >
        <Rive
          autoplay
          ref={riveRefPaisaje}
          url="https://public.rive.app/community/runtime-files/9568-18867-darklight-theme.riv"
          artboardName="New Artboard"
          stateMachineName="New Artboard"
          style={{
            width: "100%",
            borderRadius: 20,
          }}
        />
      </View>
      {tiempo && (
        <View
          style={{
            marginTop: -100,
            height: 100,
            // marginBottom: 50,
            flexDirection: "row",
            width: "97%",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            // backgroundColor: "rgba(128, 128, 128, 0.3)",
            marginHorizontal: 6,
            marginRight: 6,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              paddingVertical: 2,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${tiempo?.weather[0].icon}@2x.png`,
                }}
                style={{ width: 50, height: 50, borderRadius: 10 }}
              />

              <Text
                style={{
                  color: colorTextDark ? "white" : "black",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {tiempo.weather[0].main}
              </Text>
            </View>
            <Text
              style={{
                color: colorTextDark ? "white" : "black",
                fontWeight: "bold",
                fontSize: 40,
              }}
            >
              {`${Math.round(tiempo.main.temp)}°C`}
            </Text>
          </View>
          <View style={{ justifyContent: "space-between", paddingVertical: 2 }}>
            <Text
              style={{
                color: colorTextDark ? "white" : "black",
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {time}
            </Text>
            <Text
              style={{
                color: colorTextDark ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {dateStr}
            </Text>
            <Text
              style={{
                color: colorTextDark ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {tiempo.name}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.containerSectionIcons}>
        {dataSectionIcon.map((item, index) => (
          <Link
            key={index}
            href={{
              pathname: "/view-maps-category/[title]",
              params: {
                title: item.title,
                categoryMap: item.categoryMap,
                valueCategoryMap: item.valueCategoryMap,
                query: item.query,
              },
            }}
            asChild
          >
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
              // onPress={() => console.log("press", item.title)}
            >
              <View style={styles.iconCustom}>
                <View
                  style={{
                    margin: 8,
                    // backgroundColor: "#F5F5F5",
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
              </View>
              {/* <Text>{item.title}</Text> */}
            </Pressable>
          </Link>
        ))}
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#049CE4",
          marginTop: 10,
          flexDirection: "row",
          width: "97%",
          height: 150,
          padding: 10,
          borderRadius: 10,
          marginLeft: 10,
          borderColor: "#efefef",
          borderWidth: 1,
          shadowColor: "white",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image source={newsImage} style={{ width: 100, height: 100 }} />
        <View style={{ marginLeft: 10, flex: 1, gap: 10 }}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
            Ver noticias del pais que te encuentras?
          </Text>
          <Link href="/newsScreenList" asChild>
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  padding: 5,
                  borderRadius: 10,
                  width: 50,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Ver
                </Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 18,
          fontWeight: "bold",
          color: colorText,
        }}
      >
        Principales categorias
      </Text>
      {data.DATA.slice(0, 2).map((item) => (
        <CardListCategory
          key={item.id}
          id={item.id}
          title={item.title}
          imageSource={item.image}
          dataCategoryPlaces={item.category}
        />
      ))}
    </ScrollView>
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
    // borderColor: "#5C4033",
    borderColor: "white",
    backgroundColor: "rgba(245, 222, 179, 1)", // color piel with 60% transparency
    margin: 5,
    marginTop: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  iconCustom: {
    width: 55,
    height: 55,
    // borderRadius: 15,
    // backgroundColor: "#000",
    marginVertical: 10,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#50A9F1",
  },
});
