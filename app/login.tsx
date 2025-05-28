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
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/hooks/useAuth";
import { router, Stack, useFocusEffect } from "expo-router";

export default function Login() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    // Validación del nombre (solo para registro)
    if (!isLogin && !name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    // Validación del email
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "El email no es válido";
      isValid = false;
    }

    // Validación de la contraseña
    if (!password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    // Validación adicional de contraseña para registro
    if (!isLogin) {
      if (!/[A-Z]/.test(password)) {
        newErrors.password =
          "La contraseña debe contener al menos una mayúscula";
        isValid = false;
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "La contraseña debe contener al menos un número";
        isValid = false;
      } else if (!/[!@#$%^&*]/.test(password)) {
        newErrors.password =
          "La contraseña debe contener al menos un carácter especial (!@#$%^&*)";
        isValid = false;
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const { user } = useAuth();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const styles = getStyles(isDark);

  const handleForgotPassword = async () => {
    try {
      if (!email.trim()) {
        setErrors((prev) => ({
          ...prev,
          email: "Ingresa tu email para recuperar la contraseña",
        }));
        return;
      }

      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setErrors((prev) => ({
        ...prev,
        general: "Se ha enviado un enlace de recuperación a tu email",
        email: "",
      }));
    } catch (error) {
      let errorMessage = "Error al enviar el email de recuperación";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El email no es válido";
      }
      setErrors((prev) => ({ ...prev, email: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setErrors((prev) => ({ ...prev, general: "" }));
      setLoading(true);

      const userCredential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      console.log("idToken", idToken);

      const response = await fetch(
        `https://back-new-place.onrender.com/api/${
          isLogin ? "login" : "create-user"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            name: !isLogin && name && name,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Token status:", data.token);
        await AsyncStorage.setItem("jwt", data.token);
        await AsyncStorage.setItem("user_id", data.user_id);
      }
    } catch (error) {
      console.error("Error de autenticación", error);
      let errorMessage = "Error al procesar la solicitud";

      // Manejar errores específicos de Firebase
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este email ya está registrado";
          break;
        case "auth/invalid-email":
          errorMessage = "El email no es válido";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Operación no permitida";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es demasiado débil";
          break;
        case "auth/user-disabled":
          errorMessage = "Esta cuenta ha sido deshabilitada";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este email";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Demasiados intentos fallidos. Por favor, intente más tarde";
          break;
      }

      setErrors((prev) => ({ ...prev, general: errorMessage }));
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

        {!isLogin && !isForgotPassword && (
          <View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={isDark ? "#ffffff80" : "#00000080"}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor={isDark ? "#ffffff50" : "#00000050"}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
        )}

        <View>
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
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {!isForgotPassword && (
          <View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={isDark ? "#ffffff80" : "#00000080"}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor={isDark ? "#ffffff50" : "#00000050"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 10 }}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={isDark ? "#ffffff80" : "#00000080"}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            {!isLogin && (
              <Text
                style={[
                  styles.passwordHint,
                  { color: isDark ? "#ffffff80" : "#00000080" },
                ]}
              >
                La contraseña debe contener al menos:\n• 6 caracteres\n• Una
                mayúscula\n• Un número\n• Un carácter especial (!@#$%^&*)
              </Text>
            )}
          </View>
        )}

        {!isLogin && (
          <View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={isDark ? "#ffffff80" : "#00000080"}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirmar Contraseña"
                placeholderTextColor={isDark ? "#ffffff50" : "#00000050"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ padding: 10 }}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color={isDark ? "#ffffff80" : "#00000080"}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>
        )}

        {errors.general ? (
          <Text style={[styles.errorText, styles.generalError]}>
            {errors.general}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.loginButton, { marginTop: errors.general ? 0 : 16 }]}
          onPress={isForgotPassword ? handleForgotPassword : handleAuth}
          // disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {isForgotPassword
              ? "Restablecer Contraseña"
              : isLogin
              ? "Iniciar Sesión"
              : "Registrarse"}
          </Text>
        </TouchableOpacity>

        {isLogin && !isForgotPassword && (
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => {
              setIsForgotPassword(true);
              setPassword("");
              setErrors({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                general: "",
              });
            }}
            // disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        )}

        {isForgotPassword && (
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => {
              setIsForgotPassword(false);
              setErrors({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                general: "",
              });
            }}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>
              Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        )}

        {/* <View style={styles.socialContainer}>
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
        </View> */}

        {!isForgotPassword && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setErrors({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  general: "",
                });
              }}
            >
              <Text style={styles.footerLink}>
                {isLogin ? "Regístrate" : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    errorText: {
      color: "#ff4444",
      fontSize: 12,
      marginTop: 4,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    generalError: {
      textAlign: "center",
      marginBottom: 16,
      fontSize: 14,
    },
    passwordHint: {
      color: isDark ? "#ffffff80" : "#00000080",
      fontSize: 12,
      marginTop: 4,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
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
    forgotPasswordButton: {
      alignSelf: "center",
      marginTop: 16,
      padding: 8,
    },
    forgotPasswordText: {
      color: "#FF385C",
      fontSize: 14,
      textDecorationLine: "underline",
    },
    footerText: {
      color: isDark ? "#ffffff80" : "#00000080",
    },
    footerLink: {
      color: "#FF385C",
      fontWeight: "600",
    },
  });
