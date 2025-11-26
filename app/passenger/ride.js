import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Ride() {
  const router = useRouter();

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  // ⭐ Updated submitRide with your IPv4 address
  const submitRide = async () => {
  console.log("🚖 Button clicked");

  if (!pickup || !drop) {
    alert("Enter both locations");
    return;
  }

  try {
    console.log("📡 Sending request...");

    const response = await fetch("http://127.0.0.1:8000/request-ride", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        pickup,
        drop,
      }),
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.log("❌ Backend error response:", errText);
      alert("Backend error, try again.");
      return;
    }

    const data = await response.json();
    console.log("✅ Response JSON:", data);

    alert("Ride Requested!");

    router.replace("/passenger/home");

  } catch (error) {
    console.log("🌐 NETWORK ERROR:", error);
    alert("Cannot reach backend.");
  }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Your Ride</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Pickup Location"
          value={pickup}
          onChangeText={setPickup}
          style={styles.input}
        />

        <TextInput
          placeholder="Drop Location"
          value={drop}
          onChangeText={setDrop}
          style={styles.input}
        />
      </View>

      {/* Press Request Ride */}
      <TouchableOpacity style={styles.requestBtn} onPress={submitRide}>
        <Text style={styles.requestBtnText}>Request Ride</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 25, 
    backgroundColor: "#F9FAFB",
    justifyContent: "center"
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 15,
  },
  requestBtn: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
  },
  requestBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});