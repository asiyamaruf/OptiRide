import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // TODO: Add actual signup API call here
    // You can add API call like:
    // fetch("http://localhost:8000/signup", { 
    //   method: "POST", 
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email, phone, password }) 
    // })
    //   .then(res => res.json())
    //   .then(data => { 
    //     if (data.success) {
    //       Alert.alert("Success", "Account created! Please login.");
    //       router.back();
    //     } else {
    //       Alert.alert("Error", data.message || "Signup failed");
    //     }
    //   })
    //   .catch(err => Alert.alert("Error", "Signup failed"));

    // Temporary: show success and go back to login
    Alert.alert("Success", "Account created! Please login.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up for OptiRide</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
        <Text style={styles.signupBtnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 35,
    color: "#777",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  signupBtn: {
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  signupBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 20,
    alignSelf: "center",
  },
  loginText: {
    color: "#4A90E2",
    fontSize: 14,
  },
});




