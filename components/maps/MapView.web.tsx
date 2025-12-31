import { View } from "react-native";

export default function WebMap() {
  return (
    <View style={{ flex: 1 }}>
      <iframe
        title="map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=12.9716,77.5946&z=14&output=embed"
      />
    </View>
  );
}
