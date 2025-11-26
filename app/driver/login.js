import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function DriverLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <Text style={styles.subtitle}>Enter your phone number</Text>

      <TextInput
        placeholder="Phone number"
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          if (!phone) return alert("Enter phone number");
          router.push("/driver/tasks");
        }}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:25, justifyContent:"center", backgroundColor:"#F9FAFB" },
  title: { fontSize:26, fontWeight:"700", textAlign:"center", marginBottom:6, color:"#222" },
  subtitle: { fontSize:14, textAlign:"center", marginBottom:25, color:"#777" },
  input: { borderWidth:1, borderColor:"#DDD", padding:12, borderRadius:10, backgroundColor:"#fff", marginBottom:20, fontSize:15 },
  loginBtn: { alignSelf:"center", paddingVertical:10, paddingHorizontal:25, backgroundColor:"#4A90E2", borderRadius:20 },
  loginText: { color:"#fff", fontSize:15, fontWeight:"600" },
});
