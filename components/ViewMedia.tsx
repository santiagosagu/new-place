import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Easing,
} from "react-native";
import { Video } from "expo-av";
import { VideoView, useVideoPlayer } from "expo-video";
import { NewModalPlaceActions } from "./newModalPlaceActions";
import { ScrollView } from "react-native-gesture-handler";
import ImageViewer from "react-native-image-zoom-viewer";
import { ResumableZoom, SnapbackZoom } from "react-native-zoom-toolkit";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ImageZoom from "react-native-image-pan-zoom";
import ZoomableImage from "./ZoomableImage";
import { Post } from "@/app/(tabs)/socialNetwork";

const { width, height } = Dimensions.get("window");

export default function ViewMedia({
  post,
  dispatch,
  initialIndex = 0,
}: {
  post: Post;
  dispatch: (visible: boolean) => void;
  initialIndex: number;
}) {
  const [viewerVisible] = useState(true);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    // Scroll al índice inicial cuando se abre la modal
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          x: width * initialIndex,
          animated: false,
        });
      }, 90); // Delay pequeño para asegurar que el ScrollView esté montado
    }
  }, [viewerVisible]);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderItem = (item: { type: string; url: string }) => {
    if (item.type === "image") {
      return <ZoomableImage uri={item.url} />;
    } else if (item.type === "video") {
      const player = useVideoPlayer(item.url);
      return (
        <VideoView
          player={player}
          style={{ width, height }}
          allowsFullscreen={false}
          allowsPictureInPicture
        />
      );
    }
  };

  return (
    <Modal visible={viewerVisible} transparent={false}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {post!.media.map(
          (item: { type: string; url: string }, index: number) => (
            <View key={index} style={{ width, height }}>
              {renderItem(item)}
            </View>
          )
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => dispatch(false)} style={styles.closeBtn}>
        <Text style={{ color: "white", fontSize: 18 }}>Cerrar</Text>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  postImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  videoThumb: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 10,
  },
});
