import MapView, { Marker, UrlTile } from "react-native-maps";
import { ActivityIndicator, View } from "react-native";
import { IconLocationPoint } from "./ui/iconsList";

interface itemMarker {
  id: string;
  name: string;
  cuisine: string;
  lat: number;
  lon: number;
  horario: string;
  phone: string;
  website: string;
}

export default function ViewMap({ data }: any) {
  return (
    (data && (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.23317, // Cambia con las coordenadas obtenidas
          longitude: -75.60418,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile urlTemplate="https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiczRndSIsImEiOiJjbTR4anJqYTMwOGRpMnNwem1xMDdmdHBlIn0.WG9L6JV0AdYTkqc6f-U0ZQ" />
        {/* {data.map((item: itemMarker, index: number) => (
          <Marker
            key={index}
            coordinate={{
              latitude: item.lat,
              longitude: item.lon,
            }}
            title={item.name}
          />
        ))} */}
        <Marker
          coordinate={{
            latitude: 6.23317,
            longitude: -75.60418,
          }}
        >
          <IconLocationPoint />
        </Marker>
      </MapView>
    )) || <ActivityIndicator />
  );
}
