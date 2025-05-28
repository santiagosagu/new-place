import BottomSheet, {
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { IconClose, IconNavigation } from "./ui/iconsList";

import { TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export const NewModalPlaceActions = ({
  heightInitial,
  heightExpanded,
  dispatch,
  children,
  panDownToClose = true,
}: any) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5";
  const cardColor = theme === "dark" ? "#242424" : "#FFFFFF";
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const secondaryTextColor = theme === "dark" ? "#BBB" : "#666";

  const snapPoints = useMemo(
    () => [heightInitial, heightExpanded],
    [heightInitial, heightExpanded]
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      dispatch(false);
    }
  }, []);

  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
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
      enablePanDownToClose={panDownToClose}
    >
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: cardColor, height: heightExpanded },
        ]}
        onScroll={({ nativeEvent }) => {
          setIsAtTop(nativeEvent.contentOffset.y === 0);
        }}
        // scrollEventThrottle={16} // Mejor rendimiento en el evento de scroll
      >
        {!panDownToClose && (
          <View style={styles.containerButtonClose}>
            <Pressable
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            >
              <IconClose color={textColor} />
            </Pressable>
          </View>
        )}
        {/* <View style={[styles.contentChildren, { height: heightExpanded }]}> */}
        {children}
        {/* </View> */}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 10,
    // paddingHorizontal: 10,
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
