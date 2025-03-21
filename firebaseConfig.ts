import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBaQOjWhx50nSKw2aco-sgZ0Pl3KpNeOsM",
  authDomain: "newplace-3256f.firebaseapp.com",
  projectId: "newplace-3256f",
  storageBucket: "newplace-3256f.firebasestorage.app",
  messagingSenderId: "687742350430",
  appId: "1:687742350430:web:abbec8bc5e58d2d111f0cf",
  measurementId: "G-5XKHF7QLPE",
};

// Inicializar Firebase App
// const app = initializeApp(firebaseConfig);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);

// Inicializar Auth con AsyncStorage para Expo
// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
