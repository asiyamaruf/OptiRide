import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";

export default function DriverTasks() {
  const driverId = 1; // temporary (until login integration)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/driver-tasks/${driverId}`);
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Tasks</Text>

      {tasks.length === 0 ? (
        <Text style={styles.noTasks}>No tasks assigned yet.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.task_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.taskTitle}>
                {item.request_type === "ride" ? "🚖 Ride Request" : "📦 Delivery"}
              </Text>
              <Text style={styles.task}>Request ID: {item.request_id}</Text>
              <Text style={styles.task}>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  noTasks: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  task: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
});
