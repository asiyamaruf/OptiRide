import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Success() {
  const router = useRouter();
  const { pickup, drop } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Ride Requested!</Text>

      <Text style={styles.subtitle}>Pickup: {pickup}</Text>
      <Text style={styles.subtitle}>Drop: {drop}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/")}
      >
        <Text style={styles.btnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 25,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555"
  },
  btn: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
  },
  btnText: {
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600"
  }
});
