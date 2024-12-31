import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconClose } from "./ui/iconsList";
import { Linking, Platform } from "react-native";
import { useRef } from "react";
import Rive, { RiveRef } from "rive-react-native";

const imageBackground = require("../assets/images/image.png");

export default function ModalPlaceDetail({
  setModalVisible,
  modalVisible,
  navigatePlace,
  setSeeInCards,
}: any) {
  const { setIsNavigating, place } = usePlaceNavigateContext();

  const riveRefModal = useRef<RiveRef>(null);

  const openNativeNavigation = (lat: number, lon: number) => {
    setModalVisible(false);
    const mapUrl = Platform.select({
      ios: `http://maps.apple.com/?q=${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}`,
    });

    Linking.openURL(mapUrl!);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              width: "99%",
              justifyContent: "flex-end",
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingTop: 10,
            }}
          >
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <IconClose color="white" />
            </Pressable>
          </View>
          <Rive
            autoplay
            ref={riveRefModal}
            url="https://public.rive.app/community/runtime-files/4154-8679-vehicle-loader.riv"
            artboardName="Car"
            stateMachineName="State Machine 1"
            style={{ width: 270, height: 80, borderRadius: 20 }}
          />
          <View style={styles.containerImage}>
            <Text style={styles.modalText}>{place?.name}</Text>
            {/* {place?.cuisine !== "No disponible" && (
              <Text style={{ fontSize: 15, textTransform: "uppercase" }}>
                {place.cuisine}
              </Text>
            )} */}

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                riveRefModal.current?.setInputState(
                  "State Machine 1",
                  "LoadFinished",
                  true
                );
                setTimeout(() => {
                  navigatePlace();
                  setModalVisible(!modalVisible);
                  setSeeInCards(false);
                  setIsNavigating(true);
                }, 700);
              }}
            >
              <Text style={styles.textStyle}>Navegar</Text>
            </Pressable>
            <Pressable
              onPress={() => openNativeNavigation(place.lat, place.lon)}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: "#2196F3", fontWeight: "bold" }}>
                Abrir en app external
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white ",
  },
  modalView: {
    width: "70%",
    minHeight: "60%",
    margin: 20,
    backgroundColor: "#2C2A29",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2196F3",

    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  containerImage: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 20,
    backgroundColor: "#2C2A29",
    marginBottom: 5,
    marginTop: -20,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    marginTop: 10,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    textTransform: "capitalize",
  },
  modalText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "white",
  },
});
