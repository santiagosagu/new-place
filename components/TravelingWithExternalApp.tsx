import React from "react";
import { Button, View, Modal, Text, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import Toast from "react-native-toast-message";

interface Props {
  modalVisibleTraveling: boolean;
  setModalVisibleTraveling: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TravelingWithExternalApp({
  modalVisibleTraveling,
  setModalVisibleTraveling,
}: Props) {
  const backgroundColor = useThemeColor({}, "backgroundCard");
  const colorText = useThemeColor({}, "text");

  const { place, setPlace } = usePlaceNavigateContext();

  const coordsString = `${place?.lat},${place?.lon}`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(coordsString);
    Toast.show({
      type: "info",
      text1: i18n.t(`UI.coordenadas copiadas al portapapeles`, {
        defaultValue: "Coordenadas copiadas al portapapeles",
      }),
      visibilityTime: 4000,
      position: "top",
    });
  };

  return (
    <Modal
      visible={modalVisibleTraveling}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisibleTraveling(false)}
    >
      <View style={styles.modalOverlay}>
        <Toast />
        <View style={[styles.modalContent, { backgroundColor }]}>
          <Text style={[styles.modalTitle, { color: colorText }]}>
            {i18n.t(`modalUsarAppExternal.titulo`, {
              defaultValue: "¡Dirígete a Uber, Indrive, etc.!",
            })}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              marginTop: 20,
              paddingHorizontal: 10,
            }}
          >
            <Text style={[styles.modalText, { color: colorText }]}>
              <Text style={{ fontWeight: "bold", marginRight: 10 }}>1.</Text>
              {i18n.t(`modalUsarAppExternal.paso1`, {
                defaultValue: "Abre la aplicación de tu preferencia.",
              })}
            </Text>
            <Text style={[styles.modalText, { color: colorText }]}>
              <Text style={{ fontWeight: "bold", marginRight: 10 }}>2.</Text>
              {i18n.t(`modalUsarAppExternal.paso2`, {
                defaultValue:
                  "Pega la siguiente ubicacion en el campo de destino.",
              })}
            </Text>
            <Text style={[styles.modalText, { color: colorText }]}>
              <Text style={{ fontWeight: "bold", marginRight: 10 }}>3.</Text>
              {i18n.t(`modalUsarAppExternal.paso3`, {
                defaultValue:
                  "Selecciona el primer resultado que te ofrece la app.",
              })}
            </Text>
          </View>
          <Text style={[styles.coordsText, { color: colorText }]}>
            {coordsString}
          </Text>
          <Button
            title={i18n.t(`modalUsarAppExternal.botonCopiar`, {
              defaultValue: "Copiar coordenadas",
            })}
            onPress={copyToClipboard}
          />
          <View style={{ marginTop: 20 }}>
            <Button
              title={i18n.t(`UI.cerrar`, { defaultValue: "Cerrar" })}
              onPress={() => {
                setModalVisibleTraveling(false), setPlace(null);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    // textAlign: "center",
  },
  coordsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});
