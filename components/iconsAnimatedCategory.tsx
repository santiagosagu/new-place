import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Rive, { RiveRef } from "rive-react-native";

export const IconsAnimatedCategory = () => {
  const riveRefCar = useRef<RiveRef>(null);
  const riveRefCoffee = useRef<RiveRef>(null);
  const riveRefFood = useRef<RiveRef>(null);
  const riveRefGas = useRef<RiveRef>(null);
  const riveRefMap = useRef<RiveRef>(null);

  const backgroundColorTransparent = useThemeColor(
    {},
    "backgroundCardTransparent"
  );

  useEffect(() => {
    if (riveRefCar.current) {
      riveRefCar.current?.play();
      riveRefCar.current?.setInputState("car_interactivity", "active", true);
    }
    if (riveRefCoffee.current) {
      riveRefCoffee.current?.play();
      riveRefCoffee.current?.setInputState(
        "coffee_interactivity",
        "active",
        true
      );
    }
    if (riveRefFood.current) {
      riveRefFood.current?.play();
      riveRefFood.current?.setInputState("food_interactivity", "active", true);
    }

    if (riveRefGas.current) {
      riveRefGas.current?.play();
      riveRefGas.current?.setInputState("gas_interactivity", "active", true);
    }

    if (riveRefMap.current) {
      riveRefMap.current?.play;
      riveRefMap.current?.setInputState("map_interactivity", "active", true);
    }
  }, []);
  return (
    <View
      style={{
        width: "100%",
        borderRadius: 20,
        height: 100,
        flexDirection: "row",
        backgroundColor: backgroundColorTransparent,
      }}
    >
      <Rive
        autoplay
        ref={riveRefCar}
        url="https://public.rive.app/community/runtime-files/1411-2755-travel-icons-pack.riv"
        artboardName="car"
        stateMachineName="car_interactivity"
        style={{ width: 10, borderRadius: 20 }}
      />
      <Rive
        autoplay
        ref={riveRefCoffee}
        url="https://public.rive.app/community/runtime-files/1411-2755-travel-icons-pack.riv"
        artboardName="coffee"
        stateMachineName="coffee_interactivity"
        style={{ width: 10, borderRadius: 20 }}
      />
      <Rive
        autoplay
        ref={riveRefFood}
        url="https://public.rive.app/community/runtime-files/1411-2755-travel-icons-pack.riv"
        artboardName="food"
        stateMachineName="food_interactivity"
        style={{ width: 10, borderRadius: 20 }}
      />
      <Rive
        autoplay
        ref={riveRefGas}
        url="https://public.rive.app/community/runtime-files/1411-2755-travel-icons-pack.riv"
        artboardName="gas"
        stateMachineName="gas_interactivity"
        style={{ width: 10, borderRadius: 20 }}
      />
      <Rive
        autoplay
        ref={riveRefMap}
        url="https://public.rive.app/community/runtime-files/1411-2755-travel-icons-pack.riv"
        artboardName="map"
        stateMachineName="map_interactivity"
        style={{ width: 10, borderRadius: 20 }}
      />
    </View>
  );
};
