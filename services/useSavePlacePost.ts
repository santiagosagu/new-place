import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export const useSavePlaceDataPost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (placeId: string) => {
    setLoading(true);
    setError(null);

    const token = await AsyncStorage.getItem("jwt");

    if (!token) {
      console.warn("Token no encontrado");
      setData(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        // "http://192.168.1.2:8080/api/saved-place-for-user",
        `https://back-new-place.onrender.com/api/saved-place-for-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ place_id: placeId }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener lugares guardados");
      }

      const json = await response.json();
      setData(json);
      Toast.show({
        type: "success",
        text1: `Place `,
        text2: "Modificado Correctamente",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1Style: {
          fontSize: 18,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
      });
    } catch (err: any) {
      console.error("Error al obtener lugares guardados:", err);
      setError(err);
      setData(null);
      Toast.show({
        type: "error",
        text1: "Error al guardar el lugar",
        text2: `${(err as Error).message}`,
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        text1Style: {
          fontSize: 18,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
