import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GroceryHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery</Text>
      <Text style={styles.subtitle}>Order groceries quickly</Text>

      <Link href="/grocery/products" asChild>
        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:25, justifyContent:"center", backgroundColor:"#F9FAFB" },
  title: { fontSize:26, fontWeight:"700", textAlign:"center", marginBottom:6, color:"#222" },
  subtitle: { fontSize:14, textAlign:"center", marginBottom:28, color:"#777" },
  smallBtn: { alignSelf:"center", paddingVertical:10, paddingHorizontal:25, backgroundColor:"#4A90E2", borderRadius:20 },
  smallBtnText: { color:"#fff", fontSize:15, fontWeight:"600" }
});
