import React, { useEffect, useState } from "react";
import MapboxGL from "@rnmapbox/maps";
import {
  point,
  lineString,
  distance,
  nearestPointOnLine,
  lineSliceAlong,
  length,
} from "@turf/turf";
import { useLocation } from "@/hooks/location/useLocation";
import { usePlaceNavigateContext } from "@/context/placeNavigateContext";

type LatLng = [number, number];

interface RouteLineProps {
  route: LatLng[];
  userLocation: { latitude: number; longitude: number } | null;
}

const esValido = (coords: LatLng[]) =>
  Array.isArray(coords) &&
  coords.length >= 2 &&
  coords.every(
    (p) =>
      Array.isArray(p) &&
      p.length === 2 &&
      typeof p[0] === "number" &&
      typeof p[1] === "number" &&
      !isNaN(p[0]) &&
      !isNaN(p[1])
  );

const isValidCoordinate = (coord: any): coord is [number, number] => {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])
  );
};

const RouteLine: React.FC<RouteLineProps> = ({ route, userLocation }) => {
  const [locationState, setLocationState] = useState(userLocation);
  const [recorrido, setRecorrido] = useState<any>(null);
  const [restante, setRestante] = useState<any>(null);
  const [mostrarProgresoValido, setMostrarProgresoValido] = useState(false);

  const { location } = useLocation();
  const { matchedData } = usePlaceNavigateContext();

  useEffect(() => {
    if (matchedData?.lat && matchedData?.lon) {
      setLocationState({
        latitude: matchedData.lat,
        longitude: matchedData.lon,
      });
    } else if (location) {
      setLocationState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [matchedData, location]);

  useEffect(() => {
    if (
      !locationState ||
      !route ||
      route.length < 2 ||
      !route.every(isValidCoordinate)
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      try {
        const userPt = point([locationState.longitude, locationState.latitude]);
        const line = lineString(route);
        const nearest = nearestPointOnLine(line, userPt, {
          units: "kilometers",
        });
        const distanciaRecorrida = nearest?.properties?.location;
        const longitudTotal = length(line, { units: "kilometers" });
        const nearestCoord = nearest.geometry?.coordinates as LatLng;

        if (
          typeof distanciaRecorrida !== "number" ||
          !nearestCoord ||
          nearestCoord.length !== 2 ||
          nearestCoord.some((c) => typeof c !== "number" || isNaN(c))
        ) {
          setMostrarProgresoValido(false);
          return;
        }

        const userDist = distance(userPt, point(nearestCoord), {
          units: "meters",
        });

        const umbral = 50;
        const mostrarProgreso = userDist <= umbral;

        if (mostrarProgreso) {
          const recorridoCoords = lineSliceAlong(line, 0, distanciaRecorrida, {
            units: "kilometers",
          }).geometry.coordinates;

          const restanteCoords = lineSliceAlong(
            line,
            distanciaRecorrida,
            longitudTotal,
            { units: "kilometers" }
          ).geometry.coordinates;

          const recorridoValido =
            esValido(recorridoCoords as LatLng[]) && recorridoCoords.length >= 2
              ? lineString(recorridoCoords)
              : null;

          const restanteValido =
            esValido(restanteCoords as LatLng[]) && restanteCoords.length >= 2
              ? lineString(restanteCoords)
              : null;

          setRecorrido(recorridoValido);
          setRestante(restanteValido);
          setMostrarProgresoValido(!!(recorridoValido && restanteValido));
        } else {
          setMostrarProgresoValido(false);
        }
      } catch (error) {
        console.warn("Error al calcular segmentos de la ruta:", error);
        setMostrarProgresoValido(false);
        setRecorrido(null);
        setRestante(null);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [locationState, route]);

  if (!route || route.length < 2 || !route.every(isValidCoordinate)) {
    console.error("Ruta inválida o contiene coordenadas inválidas");
    return null;
  }

  const fallbackLineString = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: route,
    },
    properties: {},
  };

  return (
    <>
      {mostrarProgresoValido ? (
        <>
          <MapboxGL.ShapeSource
            id="routeBefore"
            shape={recorrido || fallbackLineString}
          >
            <MapboxGL.LineLayer
              id="routeBeforeLayer"
              layerIndex={10}
              style={{
                lineColor: "#4B5563",
                lineWidth: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  10,
                  2,
                  14,
                  5,
                  19,
                  16,
                  20,
                  12,
                ],
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource
            id="routeAfter"
            shape={restante || fallbackLineString}
          >
            <MapboxGL.LineLayer
              id={`lineIntructionLayerrouteAfter`}
              layerIndex={10}
              style={{
                lineColor: "rgba(0,0,0, 1)", // fuerte
                lineCap: "round",
                lineJoin: "round",
                lineWidth: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  10,
                  4, // más grueso que el interior
                  14,
                  8,
                  19,
                  16,
                  20,
                  20,
                ],
              }}
            />
            <MapboxGL.LineLayer
              id="routeAfterLayer"
              layerIndex={11}
              style={{
                lineColor: "#8000FF",
                lineWidth: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  10,
                  2, // más delgado
                  14,
                  5,
                  20,
                  12,
                ],
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </MapboxGL.ShapeSource>
        </>
      ) : (
        <MapboxGL.ShapeSource
          id="routeFallback"
          lineMetrics
          shape={fallbackLineString}
        >
          <MapboxGL.LineLayer
            id={`lineIntructionLayerrouteFallback`}
            layerIndex={10}
            style={{
              lineColor: "rgba(0,0,0, 1)", // fuerte
              lineCap: "round",
              lineJoin: "round",
              lineWidth: [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                4, // más grueso que el interior
                14,
                8,
                19,
                16,
                20,
                20,
              ],
            }}
          />
          <MapboxGL.LineLayer
            id="routeFallbackLayer"
            style={{
              lineColor: "#8000FF",
              lineCap: "round",
              lineJoin: "round",
              lineWidth: [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                2, // más delgado
                14,
                5,
                20,
                12,
              ],
            }}
          />
        </MapboxGL.ShapeSource>
      )}
    </>
  );
};

export default RouteLine;
