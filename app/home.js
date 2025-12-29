import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RoleSelection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OptiRide</Text>
      <Text style={styles.subtitle}>Choose your role</Text>

      <Link href="/passenger/home" asChild>
        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Passenger</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/grocery/home" asChild>
        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Grocery Customer</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/driver/login" asChild>
        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Driver</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F9FAFB"
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
    color: "#777",
  },

  // SMALL COMPACT BUTTON
  smallBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    marginVertical: 8,
  },
  smallBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  }
});




