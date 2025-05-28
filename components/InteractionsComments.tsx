import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  name: string;
  picture: string;
}

interface Comment {
  _id: string;
  post_id: string;
  parent_comment_id?: string | null;
  content: string;
  replies_count: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies: Comment[];
  relative_time_description: string;
  __v: number;
}

const CommentItem = ({
  comment,
  isReply = false,
  setParentComment,
  setUserIdState,
}: {
  comment: Comment;
  isReply?: boolean;
  setParentComment: (
    parentCommentId: {
      user: User;
      commentId: string;
    } | null
  ) => void;
  setUserIdState: (userId: string | null) => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const secondaryTextColor = useThemeColor({}, "subtext");

  const handleReplyComment = async () => {
    setParentComment({ user: comment.user, commentId: comment._id });
  };

  const handlePress = () => {
    setIsPressed(!isPressed);
  };

  return (
    <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
      <View style={styles.userInfo}>
        <TouchableOpacity
          style={styles.repliesInfo}
          onLongPress={() => console.log("Eliminar comentario")}
        >
          <Image source={{ uri: comment.user.picture }} style={styles.avatar} />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={[styles.userName, { color: textColor }]}>
                {comment.user.name}
              </Text>
              <Text style={[styles.timeAgo, { color: secondaryTextColor }]}>
                {comment.relative_time_description}
              </Text>
            </View>

            <Text style={[styles.commentText, { color: secondaryTextColor }]}>
              {comment.content}
            </Text>
            <TouchableOpacity
              onPress={handleReplyComment}
              style={[
                styles.repliesInfo,
                { justifyContent: "center", marginBottom: 8 },
              ]}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={16}
                color="#666"
              />
              <Text style={[styles.repliesCount, { color: "#666" }]}>
                Responder
              </Text>
            </TouchableOpacity>

            <View style={styles.repliesInfoContainer}>
              {comment.replies_count > 0 && (
                <TouchableOpacity
                  onPress={handlePress}
                  style={styles.repliesInfo}
                >
                  <Text style={[styles.repliesCount, { color: "#FF385C" }]}>
                    Ver {comment.replies_count} respuestas mas...
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {isPressed && comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              isReply={true}
              setParentComment={setParentComment}
              setUserIdState={setUserIdState}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default function InteractionsComments({
  postId,
}: {
  postId: string | null;
}) {
  // const comments: Comment[] = [
  //   {
  //     _id: "67eec54f251e6aaa244aff49",
  //     post_id: "67eddf9229f0ed44cda4ddd8",
  //     parent_comment_id: null,
  //     content: "cada que me pagan ahi estoy",
  //     replies_count: 2,
  //     createdAt: "2025-04-03T17:28:47.421Z",
  //     updatedAt: "2025-04-03T22:12:33.068Z",
  //     __v: 0,
  //     user: {
  //       _id: "67e42e0b0f3cc88cc6896290",
  //       name: "User",
  //       picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //     },
  //     relative_time_description: "hace alrededor de 5 horas",
  //     replies: [
  //       {
  //         _id: "67ef07d07c79ed5f563a313e",
  //         post_id: "67eddf9229f0ed44cda4ddd8",
  //         parent_comment_id: "67eec54f251e6aaa244aff49",
  //         content: "🤣🤣🤣",
  //         replies_count: 0,
  //         createdAt: "2025-04-03T22:12:32.849Z",
  //         updatedAt: "2025-04-03T22:12:32.849Z",
  //         __v: 0,
  //         user: {
  //           _id: "67e42e0b0f3cc88cc6896290",
  //           name: "User",
  //           picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //         },
  //         relative_time_description: "hace 6 minutos",
  //         replies: [],
  //       },
  //       {
  //         _id: "67eec574251e6aaa244aff4e",
  //         post_id: "67eddf9229f0ed44cda4ddd8",
  //         parent_comment_id: "67eec54f251e6aaa244aff49",
  //         content: "invite 😁😁😁",
  //         replies_count: 0,
  //         createdAt: "2025-04-03T17:29:24.337Z",
  //         updatedAt: "2025-04-03T17:29:24.337Z",
  //         __v: 0,
  //         user: {
  //           _id: "67e42e0b0f3cc88cc6896290",
  //           name: "User",
  //           picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //         },
  //         relative_time_description: "hace alrededor de 5 horas",
  //         replies: [],
  //       },
  //     ],
  //   },
  //   {
  //     _id: "67ee9796798cc51aecc0fc54",
  //     post_id: "67eddf9229f0ed44cda4ddd8",
  //     parent_comment_id: null,
  //     content: "¡Este lugar se ve increíble! ❤️",
  //     replies_count: 0,
  //     createdAt: "2025-04-03T14:13:42.316Z",
  //     updatedAt: "2025-04-03T14:13:42.316Z",
  //     __v: 0,
  //     user: {
  //       _id: "67e42e0b0f3cc88cc6896290",
  //       name: "User",
  //       picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //     },
  //     relative_time_description: "hace alrededor de 8 horas",
  //     replies: [],
  //   },
  //   {
  //     _id: "67ee976c798cc51aecc0fc4f",
  //     post_id: "67eddf9229f0ed44cda4ddd8",
  //     parent_comment_id: null,
  //     content: "¡Este lugar se ve increíble! 🌟",
  //     replies_count: 3,
  //     createdAt: "2025-04-03T14:13:00.400Z",
  //     updatedAt: "2025-04-03T22:17:40.473Z",
  //     __v: 0,
  //     user: {
  //       _id: "67e42e0b0f3cc88cc6896290",
  //       name: "User",
  //       picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //     },
  //     relative_time_description: "hace alrededor de 8 horas",
  //     replies: [
  //       {
  //         _id: "67ef09047c79ed5f563a3151",
  //         post_id: "67eddf9229f0ed44cda4ddd8",
  //         parent_comment_id: "67ee976c798cc51aecc0fc4f",
  //         content: "🤣🤣🤣",
  //         replies_count: 0,
  //         createdAt: "2025-04-03T22:17:40.270Z",
  //         updatedAt: "2025-04-03T22:17:40.270Z",
  //         __v: 0,
  //         user: {
  //           _id: "67e42e0b0f3cc88cc6896290",
  //           name: "User",
  //           picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //         },
  //         relative_time_description: "hace 1 minuto",
  //         replies: [],
  //       },
  //       {
  //         _id: "67ee992dd492822350f1d65f",
  //         post_id: "67eddf9229f0ed44cda4ddd8",
  //         parent_comment_id: "67ee976c798cc51aecc0fc4f",
  //         content: "te recomiendo el pollo asado en BBQ",
  //         replies_count: 0,
  //         createdAt: "2025-04-03T14:20:29.700Z",
  //         updatedAt: "2025-04-03T14:20:29.700Z",
  //         __v: 0,
  //         user: {
  //           _id: "67e42e0b0f3cc88cc6896290",
  //           name: "User",
  //           picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //         },
  //         relative_time_description: "hace alrededor de 8 horas",
  //         replies: [],
  //       },
  //       {
  //         _id: "67ee97cb798cc51aecc0fc59",
  //         post_id: "67eddf9229f0ed44cda4ddd8",
  //         parent_comment_id: "67ee976c798cc51aecc0fc4f",
  //         content: "Lo es recomendadisimo 👌👌👌",
  //         replies_count: 2,
  //         createdAt: "2025-04-03T14:14:35.068Z",
  //         updatedAt: "2025-04-03T14:18:57.536Z",
  //         __v: 0,
  //         user: {
  //           _id: "67e42e0b0f3cc88cc6896290",
  //           name: "User",
  //           picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //         },
  //         relative_time_description: "hace alrededor de 8 horas",
  //         replies: [
  //           {
  //             _id: "67ee98d1d492822350f1d657",
  //             post_id: "67eddf9229f0ed44cda4ddd8",
  //             parent_comment_id: "67ee97cb798cc51aecc0fc59",
  //             content: "lo negativo es que su parqueadero es muy pequeño",
  //             replies_count: 0,
  //             createdAt: "2025-04-03T14:18:57.361Z",
  //             updatedAt: "2025-04-03T14:18:57.361Z",
  //             __v: 0,
  //             user: {
  //               _id: "67e42e0b0f3cc88cc6896290",
  //               name: "User",
  //               picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //             },
  //             relative_time_description: "hace alrededor de 8 horas",
  //             replies: [],
  //           },
  //           {
  //             _id: "67ee9880d492822350f1d64f",
  //             post_id: "67eddf9229f0ed44cda4ddd8",
  //             parent_comment_id: "67ee97cb798cc51aecc0fc59",
  //             content: "vas seguido?",
  //             replies_count: 0,
  //             createdAt: "2025-04-03T14:17:36.726Z",
  //             updatedAt: "2025-04-03T14:17:36.726Z",
  //             __v: 0,
  //             user: {
  //               _id: "67e42e0b0f3cc88cc6896290",
  //               name: "User",
  //               picture: "https://randomuser.me/api/portraits/men/32.jpg",
  //             },
  //             relative_time_description: "hace alrededor de 8 horas",
  //             replies: [],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [parentComment, setParentComment] = useState<{
    user: User;
    commentId: string;
  } | null>(null);

  const [userIdState, setUserIdState] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      setUserIdState(user_id);
    };

    getUserId();
  }, []);

  const getComments = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const user_id = await AsyncStorage.getItem("user_id");

      const response = await fetch(
        // `http://192.168.1.8:8080/api/comments?post_id=${postId}&all=true`,
        `https://back-new-place-production.up.railway.app/api/comments?post_id=${postId}&all=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setComments(data);
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleRemoveParentComment = () => {
    setParentComment(null);
  };

  const handleSendComment = async () => {
    if (text.trim() === "") {
      console.log("No se puede enviar un comentario vacío.");
    }
    console.log({
      user_id: userIdState,
      post_id: postId,
      content: text,
      parent_comment_id: parentComment?.commentId
        ? parentComment.commentId
        : null,
    });
    console.log("Enviar comentario:", text);
    setText("");

    try {
      const token = await AsyncStorage.getItem("jwt");

      const response = await fetch(
        // "http://192.168.1.8:8080/api/new-comment",
        "https://back-new-place-production.up.railway.app/api/new-comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userIdState,
            post_id: postId,
            content: text,
            parent_comment_id: parentComment?.commentId
              ? parentComment.commentId
              : null,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        getComments();
        setText("");
        setParentComment(null);
      } else {
        console.log("Error al enviar comentario");
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");

  console.log("parentComment", parentComment);

  return (
    <View style={styles.modal}>
      <ScrollView style={styles.commentsContainer}>
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            setParentComment={setParentComment}
            setUserIdState={setUserIdState}
          />
        ))}
      </ScrollView>
      {parentComment && (
        <View style={styles.parentComment}>
          <View style={styles.tag}>
            <Image
              source={{ uri: parentComment?.user?.picture }}
              style={[styles.avatar, { width: 24, height: 24, marginTop: 0 }]}
            />
            <Text style={styles.tagText}>{parentComment?.user?.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveParentComment()}>
              <AntDesign
                name="closecircleo"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: cardColor, marginBottom: isFocused ? 100 : 70 },
        ]}
      >
        <TextInput
          ref={inputRef}
          placeholder="Escribe un comentario"
          placeholderTextColor={textColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: textColor }]}
          onChangeText={setText}
          value={text}
        />
        <TouchableOpacity onPress={() => handleSendComment()}>
          <Ionicons name="send" size={24} color="#FF385C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#FF385C",
    borderRadius: 2,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    // color: "#333",
  },
  commentsContainer: {
    flex: 1,
    // marginBottom: 100,
    // height: 300,
  },
  commentContainer: {
    marginBottom: 5,
  },
  replyContainer: {
    marginLeft: 16,
    marginTop: 8,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: "#FF385C",
    borderBottomLeftRadius: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: "#666",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  repliesInfo: {
    flexDirection: "row",
    // alignItems: "center",
    marginTop: 8,
  },
  repliesCount: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 8,
  },
  repliesInfoContainer: {
    flexDirection: "row",
    gap: 10,
  },

  inputContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#FF385C",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  input: {
    flex: 1,
  },
  parentComment: {
    flexDirection: "row", // si quieres varias tags horizontalmente
    gap: 8,
    // padding: 16,
    paddingBottom: 3,
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#FF385C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start", // hace que no se estire
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    color: "white",
    fontSize: 14,
  },
});
