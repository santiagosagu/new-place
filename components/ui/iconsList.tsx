import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export const IconArrow = ({ color = "black" }: any) => {
  return <Ionicons name="arrow-forward-outline" size={24} color={color} />;
};

export const IconLocationPoint = () => {
  return <Ionicons name="location-sharp" size={30} color="#000" />;
};

export const IconClose = ({ color }: any) => {
  return <AntDesign name="closecircle" size={30} color={color} />;
};

export const IconNavigation = () => {
  return <Ionicons name="navigate" size={35} color="white" />;
};

export const IconNavigateCurrent = () => {
  return (
    <MaterialIcons
      name="navigation"
      size={40}
      color="#2196F3"
      style={{ transform: [{ rotateX: "10deg" }] }}
    />
  );
};

export const IconRestaurant = () => {
  return <Ionicons name="restaurant" size={24} color="black" />;
};

export const IconCafe = () => {
  return <FontAwesome name="coffee" size={24} color="black" />;
};

export const IconHotel = () => {
  return <FontAwesome name="hotel" size={24} color="black" />;
};

export const IconOfficeTuristic = () => {
  return (
    <MaterialCommunityIcons
      name="office-building-marker"
      size={24}
      color="black"
    />
  );
};

export const IconMall = () => {
  return <MaterialIcons name="local-mall" size={24} color="black" />;
};

export const IconSupermarket = () => {
  return <MaterialIcons name="store-mall-directory" size={24} color="black" />;
};

export const IconSports = () => {
  return <MaterialIcons name="sports-basketball" size={24} color="black" />;
};

export const IconFitness = () => {
  return <MaterialIcons name="fitness-center" size={24} color="black" />;
};

export const IconPlaceOfWorship = () => {
  return <FontAwesome6 name="place-of-worship" size={24} color="black" />;
};

export const IconStar = () => {
  return <AntDesign name="star" size={24} color="#e48826" />;
};

export const IconStarFilled = () => {
  return <AntDesign name="staro" size={24} color="grey" />;
};

export const IconNews = ({ color }: any) => {
  return <FontAwesome5 name="newspaper" size={28} color={color} />;
};

export const IconItinerary = ({ color }: any) => {
  return (
    <MaterialCommunityIcons name="map-clock-outline" size={24} color={color} />
  );
};

export const IconAccordion = ({ name, color }: any) => {
  return <AntDesign name={name} size={24} color={color} />;
};
