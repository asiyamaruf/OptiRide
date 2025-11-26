import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Address() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract products safely
  const products = params.products || "";  
  const [address, setAddress] = useState("");

  // Debug console print
  useEffect(() => {
    console.log("Incoming products:", products);
  }, [products]);

  const submitDelivery = async () => {
    if (!address) {
      Alert.alert("Error", "Please enter a delivery address.");
      return;
    }

    if (!products) {
      Alert.alert("Error", "Product selection missing.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/request-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,  
          products: String(products),   // ensures no undefined
          address: address,
        }),
      });

      const data = await response.json();

      alert("Success", data.message || "Delivery Submitted!")
      Alert.alert("Success", data.message || "Delivery Submitted!");
      router.push("/grocery/home");

    } catch (error) {
      console.log("Delivery Error:", error);
      Alert.alert("Error", "Backend connection failed.");
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Address</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Products:</Text>
        <Text style={styles.productsText}>{products}</Text>

        <TextInput
          placeholder="Enter Delivery Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={submitDelivery}>
        <Text style={styles.buttonText}>Submit Delivery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  productsText: {
    marginBottom: 12,
    fontSize: 15,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  button: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
