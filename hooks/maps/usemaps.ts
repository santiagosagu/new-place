import { useEffect, useState } from "react";
import { useLocation } from "../location/useLocation";
import * as turf from "@turf/turf";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";
import * as RNLocalize from "react-native-localize";

export const useFetchData = async (
  latitude: string,
  longitude: string,
  categoryMap: string,
  valueCategoryMap: string,
  query: string = "noquery"
) => {
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node[${categoryMap}="${valueCategoryMap}"](around:4000,${latitude},${longitude}););out;`;
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${query}+cerca+de+${latitude},${longitude}&format=json`;

  try {
    const overpassResponse = await fetch(overpassUrl);
    const nominatimResponse = await fetch(nominatimUrl);

    const overpassData = await overpassResponse.json();
    const nominatimData = await nominatimResponse.json();

    const overpassTransform = overpassData.elements.map((item: any) => ({
      id: item.id,
      name: item.tags.name || "No disponible",
      cuisine: item.tags.cuisine || "No disponible",
      lat: item.lat.toString(),
      lon: item.lon.toString(),
      horario: item.tags.opening_hours || "No disponible",
      phone: item.tags.phone || "No disponible",
      website: item.tags.website || "No disponible",
    }));

    const nominatimTransform = nominatimData.map((item: any) => ({
      id: item.place_id,
      name: item.name,
      lat: item.lat,
      lon: item.lon,
    }));

    const mergedData = [...overpassTransform, ...nominatimTransform];
    const uniqueData = mergedData.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.lat === value.lat && t.lon === value.lon)
    );

    return uniqueData || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const usePlaceNavigate = () => {
  const { location } = useLocation();

  const {
    route,
    instructions,
    setRoute,
    setInstructions,
    setInstructionStep,
    currentStep,
    setCurrentStep,
    setIsNavigating,
    setPlace,
  } = usePlaceNavigateContext();

  const navigatePlace = async (from: number[], to: number[]) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${
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
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkingRoute = () => {
    if (location && route.length > 0 && instructions) {
      const userLocation = turf.point([
        location.coords.longitude,
        location.coords.latitude,
      ]);

      // const userLocation = turf.point([-75.601843, 6.202858]);
      // const userLocation = turf.point([-75.598214, 6.20328]);
      // const userLocation = turf.point([-75.599137, 6.204616]);
      // const userLocation = turf.point([-75.601476, 6.210273]);

      let minDistance = Infinity;
      let closestStep = 0;

      instructions.forEach((step: any, index: number) => {
        const stepLocation = turf.point(step.geometry.coordinates[0]);
        const distance = turf.distance(userLocation, stepLocation);

        if (distance < minDistance) {
          // console.log(instructions[index]);
          // console.log("array", instructions);
          minDistance = distance;
          closestStep = index;
        }
      });

      const closestInstruction = instructions[closestStep];
      const instructionText = closestInstruction
        ? closestInstruction.maneuver.instruction
        : "No hay una instrucción disponible en este momento";

      setCurrentStep(closestStep);
      setInstructionStep(instructionText);
    }
  };

  const cancelNavigation = () => {
    setIsNavigating(false);
    setPlace(null);
    setRoute([]);
  };

  return { navigatePlace, checkingRoute, cancelNavigation };
};

export const useHeadingFromRoute = () => {
  const getHeadingFromRoute = (route: number[][], index: number) => {
    if (index === route.length - 1) return 0;
    const [lon1, lat1] = route[index];
    const [lon2, lat2] = route[index + 1];
    const deltaLon = lon2 - lon1;
    const deltaLat = lat2 - lat1;
    const heading = (Math.atan2(deltaLat, deltaLon) * 180) / Math.PI;
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
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // Initial latitude in radians
    const φ2 = (lat2 * Math.PI) / 180; // Final latitude in radians
    const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Difference in latitude in radians
    const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Difference in longitude in radians

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  return { getHeadingFromRoute, findClosestPointIndex };
};
