import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Products() {
  const router = useRouter();

  // You can replace this with your real product list
  const items = ["Milk", "Bread", "Eggs", "Rice", "Fruits", "Snacks"];

  const handleSelect = (product) => {
    console.log("Selected product:", product);

    router.push({
      pathname: "/grocery/address",
      params: { products: product },  // ⭐ THIS IS IMPORTANT
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Product</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard} onPress={() => handleSelect(item)}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
