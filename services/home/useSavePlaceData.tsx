import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export const useSavePlaceData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");

      if (!token) {
        console.warn("Token no encontrado");
        setData(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          //   "http://192.168.1.2:8080/api/user-saved-places",
          `https://back-new-place.onrender.com/api/user-saved-places`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener lugares guardados");
        }

        const json = await response.json();
        setData(json);
      } catch (err: Error | any) {
        console.error("Error al obtener lugares guardados:", err);
        setError(err);
        setData(null);
        Toast.show({
          type: "error",
          text1: "Error",
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
    };

    fetchData();
  }, [refreshing]);

  return { data, loading, error, setRefreshing };
};
