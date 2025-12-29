import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { BASE_URL } from "../config/api"; // ✅ correct import

const DRIVER_ID = 1;

export default function DriverTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/driver-tasks/1`)
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.task_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Type: {item.request_type}</Text>
            <Text>Request ID: {item.request_id}</Text>
            <Text>Sequence: {item.sequence_no}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No tasks assigned</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: { padding: 15, marginBottom: 10, backgroundColor: "#eee", borderRadius: 8 },
});
