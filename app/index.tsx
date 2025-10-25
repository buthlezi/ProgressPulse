// app/index.tsx
import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingHorizontal: 16,
        gap: 16,
        backgroundColor: "#F8FAFC", // Page background
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 8 }}>
        Your Progress
      </Text>

      <Text style={{ color: "#64748B" }}>
        Capture quick entries and see your momentum.
      </Text>

      {/* placeholder list area */}
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#E2E8F0", // Border/stroke
          borderStyle: "dashed",
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#64748B" }}>No entries yet</Text>
      </View>

      <Link href="/entry/new" asChild>
        <Pressable
          style={{
            padding: 14,
            backgroundColor: "#4F46E5", // Primary button
            borderRadius: 10,
            alignItems: "center",
            marginBottom: insets.bottom || 12,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Add Entry</Text>
        </Pressable>
      </Link>
    </View>
  );
}
