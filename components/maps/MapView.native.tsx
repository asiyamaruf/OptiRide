import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";

export default function NativeMap() {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: 12.9716,
        longitude: 77.5946,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{ latitude: 12.9716, longitude: 77.5946 }}
        title="Pickup Location"
      />
    </MapView>
  );
}
