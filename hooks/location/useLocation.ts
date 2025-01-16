import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permiso denegado");
          return;
        }

        const initialLocation = await Location.getCurrentPositionAsync({});
        setLocation(initialLocation);

        const watchId = await Location.watchPositionAsync(
          {
            distanceInterval: 5,
            timeInterval: 1000,
            accuracy: Location.Accuracy.BestForNavigation,
          },
          (newLocation) => setLocation(newLocation)
        );

        return () => {
          if (watchId) {
            watchId.remove();
          }
        };
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getLocation();
  }, []);

  return { location };
};
