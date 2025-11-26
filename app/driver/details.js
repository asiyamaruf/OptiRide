import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TaskDetails() {
  const router = useRouter();
  const { type, pickup, drop } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type} Task</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Pickup:</Text>
        <Text style={styles.value}>{pickup}</Text>

        <Text style={styles.label}>Drop:</Text>
        <Text style={styles.value}>{drop}</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#5CB85C" }]}
        onPress={() => {
          Alert.alert("Accepted", "You accepted the task!");
          router.push("/");
        }}
      >
        <Text style={styles.btnText}>Accept</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#D9534F", marginTop:10 }]}
        onPress={() => {
          Alert.alert("Rejected", "You rejected the task.");
          router.push("/");
        }}
      >
        <Text style={styles.btnText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:25, justifyContent:"center", backgroundColor:"#F9FAFB" },
  title: { fontSize:26, fontWeight:"700", textAlign:"center", marginBottom:25, color:"#222" },
  card: {
    backgroundColor:"#fff",
    padding:15,
    borderRadius:10,
    marginBottom:25,
    shadowColor:"#000",
    shadowOpacity:0.07,
    shadowOffset:{ width:0, height:2 },
    shadowRadius:5,
  },
  label: { fontSize:14, color:"#666", marginTop:10 },
  value: { fontSize:16, fontWeight:"600", color:"#222" },
  btn: { paddingVertical:10, paddingHorizontal:25, borderRadius:20, alignItems:"center" },
  btnText: { color:"#fff", fontSize:15, fontWeight:"600" },
});
