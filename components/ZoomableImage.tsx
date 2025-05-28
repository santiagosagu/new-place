// import React from "react";
// import { StyleSheet, Dimensions } from "react-native";
// import {
//   GestureHandlerRootView,
//   GestureDetector,
//   Gesture,
// } from "react-native-gesture-handler";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";

// const { width, height } = Dimensions.get("window");

// const ZoomableImage = ({ uri }: { uri: string }) => {
//   const scale = useSharedValue(1);
//   const savedScale = useSharedValue(1);

//   // Pinch gesture
//   const pinchGesture = Gesture.Pinch()
//     .onUpdate((e) => {
//       scale.value = Math.max(1, savedScale.value * e.scale); // No reduce menos de 1
//     })
//     .onEnd(() => {
//       savedScale.value = scale.value;
//     });

//   // Double tap gesture
//   const doubleTapGesture = Gesture.Tap()
//     .numberOfTaps(2)
//     .onEnd(() => {
//       const newScale = scale.value > 1 ? 1 : 2;
//       scale.value = withTiming(newScale, { duration: 200 });
//       savedScale.value = newScale;
//     });

//   const composedGesture = Gesture.Simultaneous(pinchGesture, doubleTapGesture);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: scale.value }],
//     };
//   });

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <GestureDetector gesture={composedGesture}>
//         <Animated.Image
//           source={{ uri }}
//           style={[styles.image, animatedStyle]}
//           resizeMode="contain"
//         />
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// export default ZoomableImage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   image: {
//     width,
//     height,
//   },
// });

import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const ZoomableImage = ({ uri }: { uri: string }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = savedScale.value * e.scale;
      scale.value = Math.max(1, newScale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      if (scale.value === 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value <= 1) return;

      const scaledWidth = width * scale.value;
      const scaledHeight = height * scale.value;

      const maxX = (scaledWidth - width) / 2;
      const maxY = (scaledHeight - height) / 2;

      const nextX = lastTranslateX.value + e.translationX;
      const nextY = lastTranslateY.value + e.translationY;

      translateX.value = Math.max(-maxX, Math.min(maxX, nextX));
      translateY.value = Math.max(-maxY, Math.min(maxY, nextY));
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      const isZoomed = scale.value > 1;
      const newScale = isZoomed ? 1 : 2;

      if (isZoomed) {
        // Reset to default
        scale.value = withTiming(1);
        savedScale.value = 1;

        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
      } else {
        // Zoom desde el punto tocado
        const tapX = e.x - width / 2;
        const tapY = e.y - height / 2;

        const zoomFactor = newScale;

        translateX.value = withTiming(-tapX * (zoomFactor - 1));
        translateY.value = withTiming(-tapY * (zoomFactor - 1));
        lastTranslateX.value = -tapX * (zoomFactor - 1);
        lastTranslateY.value = -tapY * (zoomFactor - 1);

        scale.value = withTiming(zoomFactor);
        savedScale.value = zoomFactor;
      }
    });

  const composed = Gesture.Simultaneous(
    Gesture.Simultaneous(pinchGesture, panGesture),
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: scale.value > 1 ? translateX.value : 0 },
        { translateY: scale.value > 1 ? translateY.value : 0 },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.Image
          source={{ uri }}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ZoomableImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width,
    height,
  },
});
