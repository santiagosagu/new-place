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

const imageBackground = require("../assets/images/image.png");

export default function ModalPlaceDetail({
  setModalVisible,
  modalVisible,
  navigatePlace,
  setSeeInCards,
}: any) {
  const { setIsNavigating, place } = usePlaceNavigateContext();

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
              <IconClose />
            </Pressable>
          </View>
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
                navigatePlace();
                setModalVisible(!modalVisible);
                setSeeInCards(false);
                setIsNavigating(true);
              }}
            >
              <Text style={styles.textStyle}>Navegar</Text>
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
    minHeight: "30%",
    // justifyContent: "space-around",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    borderBottomLeftRadius: 140,

    shadowColor: "#000",
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
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",

    // height: 150,
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
    // padding: 10,
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
  },
});
