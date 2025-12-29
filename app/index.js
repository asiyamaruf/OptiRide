import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(email,password);
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    // TODO: Add actual authentication API call here
    // For now, we'll just redirect to role selection
    // You can add API call like:
    // fetch("http://localhost:8000/login", { method: "POST", body: JSON.stringify({ email, password }) })
    //   .then(res => res.json())
    //   .then(data => { if (data.success) router.push("/(tabs)"); })
    //   .catch(err => Alert.alert("Error", "Login failed"));

    // Temporary: redirect to role selection after login
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OptiRide</Text>
      <Text style={styles.subtitle}>Welcome back! Please login</Text>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupLink} onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
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
  loginBtn: {
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupLink: {
    marginTop: 20,
    alignSelf: "center",
  },
  signupText: {
    color: "#4A90E2",
    fontSize: 14,
  },
});

