import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { IconClose, IconNavigation } from "./ui/iconsList";
import { ScrollView } from "react-native-gesture-handler";

export const NewModalPlaceActions = ({
  heightInitial,
  heightExpanded,
  dispatch,
  children,
}: any) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5";
  const cardColor = theme === "dark" ? "#242424" : "#FFFFFF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const secondaryTextColor = theme === "dark" ? "#BBB" : "#666";

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      dispatch(false);
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={[heightInitial, heightExpanded]}
      backgroundStyle={{
        backgroundColor: cardColor,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#FF385C",
      }}
      style={{
        flex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          { backgroundColor: cardColor, height: heightExpanded },
        ]}
      >
        <View style={styles.containerButtonClose}>
          <Pressable
            onPress={() => {
              bottomSheetRef.current?.close();
            }}
          >
            <IconClose color={textColor} />
          </Pressable>
        </View>
        <ScrollView style={styles.contentChildren}>{children}</ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  containerButtonClose: {
    width: "auto",
    borderRadius: 20,
    position: "absolute",
    top: 2,
    right: 10,
    zIndex: 100,
  },
  contentChildren: {
    // marginRight: 30,
  },
});
