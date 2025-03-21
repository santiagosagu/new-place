import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

interface User {
  uid: string;
  email: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkoutStatusSesionWithToken = async () => {
    const MAX_ATTEMPTS = 2;
    let attempts = 0;

    const getToken = async (): Promise<string | null> => {
      const token = await AsyncStorage.getItem("jwt");
      return token ? token : null;
    };

    const getUser = (): Promise<null | any> => {
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe(); // Importante: desuscribirse para evitar memory leaks
          resolve(user);
        });
      });
    };

    let token: string | null = null;
    while (!token && attempts < MAX_ATTEMPTS) {
      console.log("Intentando obtener el token...", attempts + 1);
      token = await getToken();
      if (!token) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!token) {
      console.log("No se pudo obtener el token después de varios intentos.");
      await AsyncStorage.removeItem("jwt");
      await auth.signOut();
      return router.push("/login");
    }

    console.log("Esperando a que Firebase cargue el usuario...");
    const user = await getUser();

    if (!user) {
      console.log("No hay usuario autenticado en Firebase.");
      await AsyncStorage.removeItem("jwt");
      await auth.signOut();
      return router.push("/login");
    }

    console.log("Usuario autenticado en Firebase:", user.email, token);

    const response = await fetch(
      // "http://192.168.1.6:8080/api/status-token",
      "https://back-new-place-production.up.railway.app/api/status-token",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Token no válido");
      await AsyncStorage.removeItem("jwt");
      await auth.signOut();
      return router.push("/login");
    }

    console.log("Token válido. Usuario autenticado.");
  };

  return { user, checkoutStatusSesionWithToken };
}
