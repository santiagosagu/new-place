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

  //TODO: se hizo una modificacion que no quedo en la build verificar si todo funciona bien
  const checkoutStatusSesionWithToken = async () => {
    try {
      // Verificamos si ya hay un usuario autenticado en Firebase
      const checkFirebaseAuth = new Promise((resolve) => {
        const currentUser = auth.currentUser;

        if (currentUser) {
          setUser(currentUser);
          resolve(currentUser);
        } else {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            setUser(user);
            resolve(user);
          });
        }
      });

      const user = await checkFirebaseAuth;

      if (!user) {
        console.log("No hay usuario autenticado en Firebase.");
        await AsyncStorage.removeItem("jwt");
        return router.push("/login");
      }

      // Función para verificar si ya se almacenó el token JWT
      const verifyToken = async (
        retries = 3,
        delay = 1000
      ): Promise<string | null> => {
        for (let i = 0; i < retries; i++) {
          const token = await AsyncStorage.getItem("jwt");
          if (token) return token;

          if (i < retries - 1) {
            console.log(`Intento ${i + 1}: Esperando token...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
        return null;
      };

      const token = await verifyToken();

      if (!token) {
        console.log("No se encontró el token después de los intentos.");
        await auth.signOut();
        return router.push("/login");
      }

      // Verificamos el token con el backend
      try {
        const response = await fetch(
          "https://back-new-place.onrender.com/api/status-token",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Token inválido");

        console.log("Sesión verificada correctamente.");
        return true;
      } catch (error) {
        console.error("Error al verificar el token:", error);
        await AsyncStorage.removeItem("jwt");
        await auth.signOut();
        return router.push("/login");
      }
    } catch (error) {
      console.error("Error en la verificación de sesión:", error);
      await AsyncStorage.removeItem("jwt");
      await auth.signOut();
      return router.push("/login");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("jwt");
    await auth.signOut();
    router.push("/login");
  };

  return {
    user,
    checkoutStatusSesionWithToken,
    logout,
  };
}
