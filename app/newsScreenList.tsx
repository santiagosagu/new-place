import NewsItem from "@/components/newsItem";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import dataNews from "../dataNews.json";
import { useEffect, useRef, useState } from "react";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Rive, { RiveRef } from "rive-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Stack } from "expo-router";
import { useLocation } from "@/hooks/location/useLocation";

export default function NewScreenList() {
  const [newsData, setNewsData] = useState<any>([]);
  const [textProccess, setTextProccess] = useState<string>("");

  const riveRef = useRef<RiveRef>(null);
  const colorText = useThemeColor({}, "text");

  const { location } = useLocation();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const date = `${yyyy}-${mm}-${dd}`;
  const idiomaUser = RNLocalize.getLocales()[0].languageCode;

  const apiKey = "49be24cb86252cd19f4bbaf10c0c1b36";

  const fetchDataNews = async () => {
    setTextProccess("entre a fetchDataNews");
    try {
      const responseSeachCountry: any = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${
          location!.coords!.latitude
        }&lon=${location!.coords!.longitude}&format=json&accept-language=es`
      ).then((response) => response.json());
      if (responseSeachCountry.ok) {
        const dataCountry = await responseSeachCountry.json();

        await fetch(
          `http://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${dataCountry.address.country_code}&date=${date},${date}&languages=${idiomaUser}`
        )
          .then((response) => response.json())
          .then((data) => {
            setNewsData(data.data);
            // Guardar datos en AsyncStorage
            AsyncStorage.setItem("newsData", JSON.stringify(data.data));
          })
          .catch((error) => {
            console.error("Error:", error);
            Alert.alert("Error al obtener datos de la API de noticias");
          });
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error al obtener datos de la API de la ubicacion");
    }
  };

  const loadDataFromAsyncStorage = async () => {
    setTextProccess("entre a loadData");
    try {
      const storedData = await AsyncStorage.getItem("newsData");

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);

        setNewsData(parsedData);
      }
    } catch (error) {
      console.error("Error al cargar datos de AsyncStorage:", error);
      Alert.alert("Error al cargar datos de AsyncStorage");
    }
  };
  const verifyHours = async () => {
    const storedData = await AsyncStorage.getItem("newsData");
    const storedTime = await AsyncStorage.getItem("newsDataTime");

    const currentTime = new Date().getTime();
    let diffHours = 0;

    setTextProccess("entre a verificar horas");

    if (storedTime !== null) {
      diffHours = Math.abs(currentTime - new Date(storedTime).getTime()) / 36e5;
    }

    if (storedData === null || diffHours > 8) {
      if (location) {
        await fetchDataNews();
        AsyncStorage.setItem("newsDataTime", new Date().toString());
      }
    }
  };

  useEffect(() => {
    if (location) {
      const initializeData = async () => {
        await loadDataFromAsyncStorage();
        await verifyHours();
      };
      initializeData();
    }
  }, [location]);

  // console.log(newsData);

  // useEffect(() => {
  //   // Cargar datos al iniciar la aplicación
  //   setTimeout(() => {
  //     loadDataFromAsyncStorage();
  //   }, 3000);
  // }, []);

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          title: "Noticias",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
        }}
      />
      {newsData.length > 0 ? (
        <SafeAreaView style={styles.container}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 10,
                color: "#2196F3",
                textAlign: "center",
              }}
            >
              Noticias del pais en tu ubicacion.
            </Text>
          </View>
          <FlatList
            data={newsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <NewsItem item={item} />}
          />
        </SafeAreaView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#313131",
          }}
        >
          <View
            style={{
              width: 300,
              height: 300,
              borderRadius: 20,
              // backgroundColor: "white",
              zIndex: 1000,
            }}
          >
            <Rive
              autoplay
              ref={riveRef}
              url="https://public.rive.app/community/runtime-files/3331-6993-loading-earth.riv"
              artboardName="Loading Final"
              stateMachineName="State Machine 1"
              style={{ width: 300, height: 300, borderRadius: 20 }}
            />
            <Text
              style={{
                color: colorText,
                fontSize: 20,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Loading News...
            </Text>
            <Text style={{ color: "white" }}>{textProccess}</Text>
          </View>
        </View>
      )}
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
