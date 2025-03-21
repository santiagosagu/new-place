import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/hooks/useAuth";
import { router, Stack, useFocusEffect } from "expo-router";

export default function Login() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { user } = useAuth();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const styles = getStyles(isDark);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      console.log("idToken", idToken);

      const response = await fetch("http://192.168.1.6:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log(data);
      console.log("response", response);
      if (response.ok) {
        console.log("Token status:", data.token);
        await AsyncStorage.setItem("jwt", data.token);
        // router.push("/");
      }
    } catch (error) {
      console.error("Error de autenticación", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        return router.push("/");
      }
      return () => {};
    }, [user])
  );

  return (
    <LinearGradient
      colors={isDark ? ["#1a1a1a", "#2d2d2d"] : ["#ffffff", "#f8f8f8"]}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://api.a0.dev/assets/image?text=minimalist%20travel%20and%20places%20discovery%20app%20logo%20with%20red%20accent%20modern%20design&aspect=1:1",
            }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Descubre lugares increíbles</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color={isDark ? "#ffffff80" : "#00000080"}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={isDark ? "#ffffff50" : "#00000050"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={20}
            color={isDark ? "#ffffff80" : "#00000080"}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={isDark ? "#ffffff50" : "#00000050"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <Text style={styles.orText}>O continúa con</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialCommunityIcons
                name="google"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialCommunityIcons
                name="apple"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialCommunityIcons
                name="facebook"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    content: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? "#ffffff80" : "#00000080",
      textAlign: "center",
      marginBottom: 40,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#ffffff15" : "#00000008",
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      color: isDark ? "#fff" : "#000",
      fontSize: 16,
    },
    loginButton: {
      backgroundColor: "#FF385C",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    socialContainer: {
      marginTop: 32,
      alignItems: "center",
    },
    orText: {
      color: isDark ? "#ffffff60" : "#00000060",
      marginBottom: 16,
    },
    socialButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },
    socialButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDark ? "#ffffff15" : "#00000008",
      justifyContent: "center",
      alignItems: "center",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 32,
    },
    footerText: {
      color: isDark ? "#ffffff80" : "#00000080",
    },
    footerLink: {
      color: "#FF385C",
      fontWeight: "600",
    },
  });
