import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const router = useRouter();

  // Bengaluru sample locations
  const pickup = { latitude: 12.9716, longitude: 77.5946 }; // MG Road
  const drop = { latitude: 12.9352, longitude: 77.6245 };   // Koramangala

  const [driver, setDriver] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  // Simulated driver movement (demo live tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setDriver((prev) => ({
        latitude: prev.latitude - 0.0003,
        longitude: prev.longitude + 0.0003,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>OptiRide – Live Tracking</Text>

      <MapView
  style={styles.map}
  initialRegion={{
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  }}
  provider={null} // 👈 IMPORTANT for OSM
  mapType="none"
>
  {/* OpenStreetMap Tiles */}
  <MapView.UrlTile
    urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    maximumZ={19}
  />

  <Marker coordinate={pickup} title="Pickup" />
  <Marker coordinate={drop} title="Drop" />
  <Marker coordinate={driver} title="Driver" pinColor="blue" />
</MapView>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/passenger/success")}
      >
        <Text style={styles.buttonText}>Ride Completed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
