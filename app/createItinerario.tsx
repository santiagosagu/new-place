import { useLocation } from "@/hooks/location/useLocation";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFetchData } from "@/hooks/maps/usemaps";
import CalendarIA from "@/components/calendar";
import { useItinerariosContext } from "@/context/itinerariosContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import Rive, { RiveRef } from "rive-react-native";

export default function CreateItinerario() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [colorVIew, setColorView] = useState("transparent");
  const [itinerarioName, setItinerarioName] = useState("");
  const [itinerarioDias, setItinerarioDias] = useState<number>(0);
  const [dataCountry, setDataCountry] = useState<any>({});

  const riveRefLoadingIA = useRef<RiveRef>(null);
  const riveRefErrorIA = useRef<RiveRef>(null);

  const { itinerarios, setItinerarios, isLoading, setIsLoading } =
    useItinerariosContext();
  const colorText = useThemeColor({}, "text");
  const backgroundHeader = useThemeColor({}, "backgroundHeader");

  const [selectedRange, setSelectedRange] = useState<{
    startDate: string;
    endDate: string | null;
  }>({
    startDate: "",
    endDate: null,
  });

  const { location } = useLocation();

  useEffect(() => {
    if (riveRefLoadingIA.current) {
      if (isLoading) {
        riveRefLoadingIA.current.play();
        setColorView("#049CE4");
      } else {
        riveRefLoadingIA.current.stop();
        setColorView("transparent");
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (riveRefErrorIA.current) {
      if (error) {
        riveRefErrorIA.current.play();

        setColorView("#FC4040");
      } else {
        riveRefErrorIA.current.stop();

        setColorView("transparent");
      }
    }
  }, [error]);

  useEffect(() => {
    if (location) {
      getData();
    }
  }, [location]);

  const getData = async () => {
    const responseSeachCountry: any = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&format=json&accept-language=es`
    );

    if (responseSeachCountry.ok) {
      const dataCountry = await responseSeachCountry.json();
      // console.log(dataCountry);
      setDataCountry(dataCountry);
    }

    const hotelsData = await useFetchData(
      location!.coords!.latitude.toString(),
      location!.coords!.longitude.toString(),
      "tourism",
      "hotel",
      "hoteles"
    );
    const restaurantsData = await useFetchData(
      location!.coords!.latitude.toString(),
      location!.coords!.longitude.toString(),
      "amenity",
      "restaurant",
      "restaurantes"
    );

    if (hotelsData.length > 0 && restaurantsData.length > 0) {
      setHotels(hotelsData);
      setRestaurants(restaurantsData);
    }
  };

  const ejemploJson = {
    hotel: {
      name: "string",
      latitude: "string",
      longitude: "string",
      descripcion: "string",
    },
    itinerary: [
      {
        day: 1,
        breakfast: {
          name: "string",
          cuisine: "string",
          latitude: "string",
          longitude: "string",
          descripcion: "string",
        },
        lunch: {
          name: "string",
          cuisine: "string",
          latitude: "string",
          longitude: "string",
          descripcion: "string",
        },
        dinner: {
          name: "string",
          cuisine: "string",
          latitude: "string",
          longitude: "string",
          descripcion: "string",
        },
      },
    ],
  };

  let conversationHistory: any = [];

  const getItinerario = async () => {
    setIsLoading(true);
    const chatIA = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 4tm4bUg4XjjOfjwO6jxuRrxQI8aLSpmh",
      },
      body: JSON.stringify({
        model: "codestral-latest",
        messages: [
          {
            role: "user",
            content:
              "Como experto en turismo, te proporcionaré una lista de hoteles y una lista de restaurantes. A partir de estos datos, te encargo la tarea de seleccionar la mejor opción para mi estancia y crear un itinerario detallado. Aquí te explico el proceso:Primero, te enviaré la lista de hoteles y te pediré que me recomiendes la mejor opción. Una vez que hayas hecho la selección, confirma que has recibido esta información respondiendo simplemente con 'Recibido'. Luego, te enviaré la lista de restaurantes. Nuevamente, confirma que has recibido esta información respondiendo 'Recibido los datos'. A continuación, te informaré sobre la duración de mi estancia en días. En base a este número, crearás un itinerario que incluya el hotel seleccionado, así como los mejores lugares para desayunar, almorzar y cenar en todos los días que te paso, es importante que no omitas ninguno de los dias. Es importante que el itinerario se enfoca en comida variada y que no se repitan los lugares. La respuesta debe estar en formato JSON, y debe incluir la latitud y longitud del lugar, el nombre del lugar, una breve descripción (si es posible según los datos disponibles),agrega tambien el tipo de comida que se ofrece, el idioma te lo dare con los dias del itinerario, responderás (solo los valores, no las claves).",
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        conversationHistory.push({
          role: "user",
          content:
            "Como experto en turismo, te proporcionaré una lista de hoteles y una lista de restaurantes. A partir de estos datos, te encargo la tarea de seleccionar la mejor opción para mi estancia y crear un itinerario detallado. Aquí te explico el proceso:Primero, te enviaré la lista de hoteles y te pediré que me recomiendes la mejor opción. Una vez que hayas hecho la selección, confirma que has recibido esta información respondiendo simplemente con 'Recibido'. Luego, te enviaré la lista de restaurantes. Nuevamente, confirma que has recibido esta información respondiendo 'Recibido los datos'. A continuación, te informaré sobre la duración de mi estancia en días. En base a este número, crearás un itinerario que incluya el hotel seleccionado, así como los mejores lugares para desayunar, almorzar y cenar en todos los días que te paso, es importante que no omitas ninguno de los dias. Es importante que el itinerario se enfoca en comida variada y que no se repitan los lugares. La respuesta debe estar en formato JSON, y debe incluir la latitud y longitud del lugar, el nombre del lugar, una breve descripción (si es posible según los datos disponibles),agrega tambien el tipo de comida que se ofrece, el idioma te lo dare con los dias del itinerario, responderás (solo los valores, no las claves).",
        });

        conversationHistory.push({
          role: "assistant",
          content: data.choices[0].message.content,
        });
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setIsLoading(false);
      });

    const chatIAPaso2 = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 4tm4bUg4XjjOfjwO6jxuRrxQI8aLSpmh",
        },
        body: JSON.stringify({
          model: "codestral-latest",
          messages: [
            ...conversationHistory,
            {
              role: "user",
              content: JSON.stringify(hotels.slice(0, 50)),
            },
          ],
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        conversationHistory.push({
          role: "user",
          content: JSON.stringify(hotels.slice(0, 50)),
        });

        conversationHistory.push({
          role: "assistant",
          content: data.choices[0].message.content,
        });
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setIsLoading(false);
      });

    const chatIAPaso3 = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 4tm4bUg4XjjOfjwO6jxuRrxQI8aLSpmh",
        },
        body: JSON.stringify({
          model: "codestral-latest",
          messages: [
            ...conversationHistory,
            {
              role: "user",
              content: JSON.stringify(restaurants.slice(0, 50)),
            },
          ],
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        conversationHistory.push({
          role: "user",
          content: JSON.stringify(restaurants.slice(0, 50)),
        });

        conversationHistory.push({
          role: "assistant",
          content: data.choices[0].message.content,
        });
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });

    const chatIAPaso4 = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 4tm4bUg4XjjOfjwO6jxuRrxQI8aLSpmh",
        },
        body: JSON.stringify({
          model: "codestral-latest",
          messages: [
            ...conversationHistory,
            {
              role: "user",
              content: `Por favor, genera un itinerario para ${itinerarioDias} dias en el formato del ejemplo JSON que te he proporcionado: ${JSON.stringify(
                ejemploJson
              )}. Asegúrate de que la respuesta sea únicamente el JSON generado y no incluyas ninguna explicación adicional, el ejemplo es solo para que revises la estructura del JSON. es importante que los lugares para comer no sean del listado de hoteles por eso te los paso por separado.`,
            },
          ],
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("data", data);
        // console.log(data.choices[0].message.content);
        const dataTransform = JSON.parse(data.choices[0].message.content);
        setItinerarios([
          ...itinerarios,
          {
            ...dataTransform,
            name: itinerarioName,
            createdAt: new Date().toISOString(),
            ciudad: dataCountry.address.city,
            pais: dataCountry.address.country,
          },
        ]);
        setIsLoading(false);
        setItinerarioName("");
        setItinerarioDias(0);
        setRestaurants([]);
        setHotels([]);
        setDataCountry({});
        router.push("/(tabs)/itinerarioIA");
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorVIew,
          padding: 50,
        }}
      >
        <Rive
          autoplay
          ref={riveRefLoadingIA}
          url="https://public.rive.app/community/runtime-files/12696-24250-reruled-loading-screen.riv"
          artboardName="Artboard"
          stateMachineName="State Machine 1"
          style={{ width: 500, height: 500, borderRadius: 20 }}
        />
        <View
          style={{
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 25,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Estamos creando tu itinerario...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorVIew,
          padding: 50,
        }}
      >
        <Rive
          autoplay
          ref={riveRefErrorIA}
          url="https://public.rive.app/community/runtime-files/11856-22839-error.riv"
          artboardName="Error"
          stateMachineName="Error State"
          style={{ width: 300, height: 300, borderRadius: 20 }}
        />
        <View
          style={{
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Ha ocurrido un error al crear tu itinerario. Por favor, inténtalo de
            nuevo más tarde.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-around",
          marginHorizontal: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "#049CE4",
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            En esta vista te recomendaremos segun tu ubicacion actual el hotel y
            los restaurantes a los que puedes ir segun los dias de estadia que
            estes, este itinerario te traera diferentes restaurantes en los
            cuales puedes desayunar, almorzar y cenar
          </Text>
        </View>
        <View
          style={{
            backgroundColor: backgroundHeader,
            padding: 10,
            borderRadius: 10,
            flex: 1,
            alignContent: "space-between",
            justifyContent: "space-around",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                backgroundColor: "rgba(245, 222, 179, 1)",
                justifyContent: "center",
                alignItems: "center",
                borderColor: colorText,
                borderWidth: 1,
              }}
            >
              <Image
                source={require("@/assets/images/map.png")}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>

          <Text
            style={{
              color: colorText,
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Comencemos tu proximo itinerario
          </Text>

          <View>
            <Text
              style={{ color: colorText, fontSize: 16, textAlign: "center" }}
            >
              Agrega el nombre para tu itinerario:
            </Text>
            <View style={{ alignItems: "center" }}>
              <TextInput
                onChange={(e) => setItinerarioName(e.nativeEvent.text)}
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  marginHorizontal: 10,
                  width: "80%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  margin: 10,
                  padding: 10,
                }}
                placeholder="Nombre del itinerario"
                // Aquí puedes manejar el cambio del input
              />
            </View>
            <Text
              style={{ color: colorText, fontSize: 16, textAlign: "center" }}
            >
              Selecciona los dias de tu estadia:
            </Text>
            <View style={{ alignItems: "center" }}>
              <TextInput
                keyboardType="numeric"
                onChangeText={(text) =>
                  setItinerarioDias(Number(text.replaceAll(",", "")))
                }
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  marginHorizontal: 10,
                  width: "80%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  margin: 10,
                  padding: 10,
                }}
                placeholder="Días de estadía"
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 40 }}>
            <Button
              title="Get Itinerario"
              onPress={() => getItinerario()}
              disabled={
                isLoading ||
                restaurants.length === 0 ||
                hotels.length === 0 ||
                itinerarioName === ""
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
