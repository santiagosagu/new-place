import { useEffect, useState } from "react";
import { useLocation } from "../location/useLocation";
import * as turf from "@turf/turf";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const useFetchData = async (
//   latitude: string,
//   longitude: string,
//   categoryMap: string,
//   valueCategoryMap: string,
//   query: string = "noquery"
// ) => {
//   const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node[${categoryMap}="${valueCategoryMap}"](around:4000,${latitude},${longitude}););out;`;
//   // const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${query}+cerca+de+${latitude},${longitude}&format=json`;

//   const nominatimUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&type=restaurant&geocodePrecision=EXTENDED&key=AIzaSyBY5fqHDVdAiWD6dLVGDLiaW1iqo_WV2qA`;

//   try {
//     const overpassResponse = await fetch(overpassUrl);
//     const nominatimResponse = await fetch(nominatimUrl);

//     const overpassData = await overpassResponse.json();
//     const nominatimData = await nominatimResponse.json();

//     console.log(nominatimData);

//     const overpassTransform = overpassData.elements.map((item: any) => ({
//       id: item.id,
//       name: item.tags.name || "No disponible",
//       cuisine: item.tags.cuisine || "No disponible",
//       lat: item.lat.toString(),
//       lon: item.lon.toString(),
//       horario: item.tags.opening_hours || "No disponible",
//       phone: item.tags.phone || "No disponible",
//       website: item.tags.website || "No disponible",
//     }));

//     const nominatimTransform = nominatimData.results.map((item: any) => ({
//       id: item.place_id,
//       name: item.name,
//       lat: item.lat,
//       lon: item.lon,
//     }));

//     const mergedData = [...overpassTransform, ...nominatimTransform];
//     const uniqueData = mergedData.filter(
//       (value, index, self) =>
//         index ===
//         self.findIndex((t) => t.lat === value.lat && t.lon === value.lon)
//     );

//     return uniqueData || [];
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return [];
//   }
// };

// export async function useFetchData(
//   latitude: string,
//   longitude: string,
//   categoryMap: string,
//   valueCategoryMap: string,
//   query: string = "noquery"
// ) {
//   let allResults = [];
//   let nextPageToken = null;

//   do {
//     // let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&rankby=distance&type=${type}&key=${apiKey}`;
//     // let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+en+${selectedCountry}+${selectedCity}&key=${apiKey}`;

//     //       let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+en+${selectedCountry}+${selectedCity}&
//     // location_step_radius=40000&place_type=${type}&geocodePrecision=EXTENDED&max_results=100&key=${apiKey}
//     // `;

//     const valueArray = Array.isArray(valueCategoryMap)
//       ? valueCategoryMap
//       : [valueCategoryMap];

//     let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&types=${valueCategoryMap}&geocodePrecision=EXTENDED&key=AIzaSyBY5fqHDVdAiWD6dLVGDLiaW1iqo_WV2qA`;

//     if (nextPageToken) {
//       url += `&pagetoken=${nextPageToken}`;
//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera para que el token sea válido
//     }

//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.results) {
//       allResults.push(...data.results);
//     }

//     nextPageToken = data.next_page_token || null; // Si no hay más token, terminamos
//   } while (nextPageToken);

//   const dataTransform = allResults.map((item: any) => ({
//     id: item.place_id,
//     name: item.name,
//     lat: item.geometry.location.lat,
//     lon: item.geometry.location.lng,
//     types: item.types,
//     vicinity: item.vicinity,
//     rating: item.rating,
//     userRatingTotal: item.user_ratings_total,
//     photos: item.photos,
//     businessStatus: item.business_status,
//     openingHours: item.opening_hours,
//   }));

//   console.log(dataTransform);

//   return dataTransform;
// }

export const useFetchData = async (
  latitude: string,
  longitude: string,
  radius: string,
  type: string,
  keyword: string = ""
) => {
  const token = await AsyncStorage.getItem("jwt");

  console.log("radius", radius);
  console.log("type", type);
  console.log("keyword", keyword);

  const response = await fetch(
    `https://back-new-place-production.up.railway.app/api/places?lat=${latitude}&lng=${longitude}&type=${type}&keyword=${keyword}&radius=${radius}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al verificar el token");
  }

  return response.json();
};

// export const usePlaceNavigate = () => {
//   const { location } = useLocation();

//   const {
//     route,
//     instructions,
//     setRoute,
//     setInstructions,
//     setInstructionStep,
//     setCurrentInstruction,
//     setCurrentStep,
//     setIsNavigating,
//     setPlace,
//     setInOnRoute,
//   } = usePlaceNavigateContext();

//   const navigatePlace = async (from: number[], to: number[]) => {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${
//       from[0]
//     }%2C${from[1]}%3B${to[0]}%2C${
//       to[1]
//     }?alternatives=true&annotations=distance%2Cduration&geometries=geojson&language=${
//       RNLocalize.getLocales()[0].languageCode
//     }&overview=full&steps=true&access_token=pk.eyJ1IjoiczRndSIsImEiOiJjbDhwZHE2NDIxa2k4M3B0b3FsaXZydm02In0.plTbzb5jQBHgNvkiWE4h9w`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data) {
//         setInstructions(data.routes[0].legs[0].steps);
//         setRoute(data.routes[0].geometry.coordinates);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const checkingRoute = () => {
//     if (location && route.length > 0 && instructions) {
//       // const userLocation = turf.point([
//       //   location.coords.longitude,
//       //   location.coords.latitude,
//       // ]);

//       // const userLocation = turf.point([-75.601843, 6.202858]);
//       // const userLocation = turf.point([-75.598214, 6.20328]);
//       // const userLocation = turf.point([-75.599137, 6.204616]);
//       // const userLocation = turf.point([-75.601476, 6.210273]);

//       const userLocation = turf.point([-75.599083, 6.204571]);

//       let minDistance = Infinity;
//       let closestStep = 0;

//       instructions.forEach((step: any, index: number) => {
//         const stepLocation = turf.point(step.geometry.coordinates[0]);
//         const distance = turf.distance(userLocation, stepLocation);

//         if (distance < minDistance) {
//           // console.log(instructions[index]);
//           // console.log("array", instructions);
//           minDistance = distance;
//           closestStep = index;
//           if (distance < 50) {
//             console.log(distance);
//             // you can adjust this value according to your needs
//             setInOnRoute(true);
//           } else {
//             setInOnRoute(false);
//           }
//         }
//       });

//       const closestInstruction = instructions[closestStep];
//       const instructionText = closestInstruction
//         ? closestInstruction.maneuver.instruction
//         : "No hay una instrucción disponible en este momento";

//       const currentInstruction = closestInstruction
//         ? closestInstruction.geometry.coordinates
//         : [];

//       setCurrentStep(closestStep);
//       setCurrentInstruction(currentInstruction);
//       setInstructionStep(instructionText);
//     }
//   };

//   const cancelNavigation = () => {
//     setIsNavigating(false);
//     setPlace(null);
//     setRoute([]);
//   };

//   return { navigatePlace, checkingRoute, cancelNavigation };
// };

export const usePlaceNavigate = () => {
  const { location } = useLocation();

  const {
    route,
    instructions,
    setRoute,
    setInstructions,
    setInstructionStep,
    setCurrentInstruction,
    setCurrentStep,
    setIsNavigating,
    setPlace,
    setInOnRoute,
    matchedData,
    setTraficData,
  } = usePlaceNavigateContext();

  const THRESHOLD_DISTANCE = 5; // Distancia en metros para considerar al usuario "en la ruta"

  const navigatePlace = async (from: number[], to: number[]) => {
    console.log("me ejecute");

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${
      from[0]
    }%2C${from[1]}%3B${to[0]}%2C${
      to[1]
    }?alternatives=true&annotations=distance%2Cduration&geometries=geojson&language=${
      RNLocalize.getLocales()[0].languageCode
    }&overview=full&steps=true&access_token=pk.eyJ1IjoiczRndSIsImEiOiJjbDhwZHE2NDIxa2k4M3B0b3FsaXZydm02In0.plTbzb5jQBHgNvkiWE4h9w`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setInstructions(data.routes[0].legs[0].steps);
        setRoute(data.routes[0].geometry.coordinates);
        getTraficData(from[0], from[1]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTraficData = async (longitude: number, latitude: number) => {
    const url = `https://api.mapbox.com/v4/mapbox.mapbox-traffic-v1/tilequery/${longitude},${latitude}.json?access_token=pk.eyJ1IjoiczRndSIsImEiOiJjbDhwZHE2NDIxa2k4M3B0b3FsaXZydm02In0.plTbzb5jQBHgNvkiWE4h9w`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setTraficData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkingRoute = () => {
    if (location && route.length > 0 && instructions.length > 0) {
      const userLocation = turf.point([
        location.coords.longitude,
        location.coords.latitude,
      ]);

      // Simular la ubicación del usuario
      // setTimeout(() => {
      // const userLocation = turf.point([-75.609289, 6.205643]); // fuera de la casa
      // const userLocation = turf.point([-75.606303, 6.203676]); // mas adelante para probar
      // }, 5000); // Simular un cambio de ubicación después de 5 segundos

      // Crear una línea completa a partir de los puntos de la ruta
      const routeLine = turf.lineString(route);

      // Obtener el punto más cercano en la línea
      const nearestPoint = turf.nearestPointOnLine(routeLine, userLocation);

      // Calcular la distancia entre la ubicación del usuario y la ruta
      const distanceToRoute =
        turf.distance(userLocation, nearestPoint, { units: "kilometers" }) *
        1000; // Convertir a metros

      // Definir un umbral para estar en la ruta (ejemplo: 100 metros)

      const speed = location.coords.speed;
      let routeThreshold = 50;

      if (speed) {
        if (speed < 10) {
          routeThreshold = 15; // caminar
        } else if (speed < 30) {
          routeThreshold = 25; // bicicleta
        } else {
          routeThreshold = 50; // auto
        }
      }

      if (distanceToRoute > routeThreshold) {
        console.log("fuera de la ruta");

        // Usuario fuera de la ruta
        setInOnRoute(false);
        return;
      }

      console.log("dentro de la ruta");

      // Usuario dentro de la ruta, calcular el paso más cercano
      let minDistance = Infinity;
      let closestStep = 0;
      const userInstruction = turf.point(nearestPoint.geometry.coordinates);

      instructions.forEach((step: any, index: number) => {
        const stepLocation = turf.point(step.geometry.coordinates[0]);
        const distance = turf.distance(userInstruction, stepLocation);

        if (distance < minDistance) {
          minDistance = distance;
          closestStep = index;
        }
      });

      const closestInstruction = instructions[closestStep];
      const instructionText = closestInstruction
        ? closestInstruction.maneuver.instruction
        : "No hay una instrucción disponible en este momento";

      const currentInstruction = closestInstruction
        ? closestInstruction.geometry.coordinates
        : [];

      setInOnRoute(true);
      setCurrentStep(closestStep);
      setCurrentInstruction(currentInstruction);
      setInstructionStep(instructionText);
    }
  };

  const cancelNavigation = () => {
    setIsNavigating(false);
    setPlace(null);
    setRoute([]);
  };

  return { navigatePlace, checkingRoute, cancelNavigation, getTraficData };
};

export const useHeadingFromRoute = () => {
  const getHeadingFromRoute = (route: number[][], index: number) => {
    if (index === route.length - 1) return 0; // Si es el último punto, no hay dirección.
    const [lon1, lat1] = route[index];
    const [lon2, lat2] = route[index + 1];
    const deltaLon = lon2 - lon1;
    const deltaLat = lat2 - lat1;

    // Calcular el ángulo en radianes.
    let heading = (Math.atan2(deltaLon, deltaLat) * 180) / Math.PI;

    // Asegurar que el ángulo esté entre 0 y 360 grados.
    heading = (heading + 360) % 360;

    return heading;
  };

  const findClosestPointIndex = (route: number[][], location: number[]) => {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let minIndex = 0;
    for (let i = 0; i < route.length; i++) {
      const distance = calculateDistance(route[i], location);
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }
    return minIndex;
  };

  const calculateDistance = (
    [lon1, lat1]: number[],
    [lon2, lat2]: number[]
  ) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return { getHeadingFromRoute, findClosestPointIndex };
};

export const useMapMatching = () => {
  const { location } = useLocation();
  const { setMatchedData, route } = usePlaceNavigateContext(); // `route` ya contiene las coordenadas de la ruta

  // Función para calcular la distancia entre dos puntos usando el método de Haversine
  const haversine = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371000; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  };

  // Función para encontrar el punto más cercano en la ruta
  const findClosestPointOnRoute = (
    userLocation: { lat: number; lon: number },
    route: number[][]
  ) => {
    let minDistance = Infinity;
    let closestPoint = { lat: userLocation.lat, lon: userLocation.lon };

    route.forEach((point) => {
      const [routeLon, routeLat] = point; // Suponiendo que la ruta es un array de [lon, lat]
      const distance = haversine(
        userLocation.lat,
        userLocation.lon,
        routeLat,
        routeLon
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { lat: routeLat, lon: routeLon };
      }
    });

    return closestPoint;
  };

  // Obtener la ubicación más cercana a la ruta
  const getMapMatchedLocation = async () => {
    try {
      if (!location) return; // Si no hay ubicación, no hacer nada

      // Llamamos a la función para encontrar el punto más cercano en la ruta
      const matchedLocation = findClosestPointOnRoute(
        { lat: location.coords.latitude, lon: location.coords.longitude },
        route // La ruta con las coordenadas de la carretera
      );

      // Actualizamos el estado con el punto más cercano
      setMatchedData(matchedLocation);
    } catch (error) {
      console.error("Error al obtener el map matching:", error);
    }
  };

  // Ejecutar la función cuando cambie la ubicación
  useEffect(() => {
    if (location) {
      getMapMatchedLocation();
    }
  }, [location, route]); // Ejecutar cada vez que la ubicación cambie

  return { getMapMatchedLocation };
};
