import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PassengerHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger</Text>
      <Text style={styles.subtitle}>Book your ride</Text>

      <Link href="/passenger/ride" asChild>
        <TouchableOpacity style={styles.smallBtnGreen}>
          <Text style={styles.smallBtnText}>Enter Pickup and Drop</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#777",
  },

  // SMALL GREEN BUTTON
  smallBtnGreen: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#5CB85C",
    borderRadius: 20,
  },
  smallBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
