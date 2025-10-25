import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../lib/colors";

export default function Settings() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 16, gap: 16, backgroundColor: colors.pageBg }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Settings</Text>

      <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, backgroundColor: "#fff", gap: 8 }}>
        <Text style={{ fontWeight: "600" }}>Theme</Text>
        <Text>• Indigo Pop (active)</Text>
        <Text style={{ color: colors.muted }}>• Emerald Calm</Text>
        <Text style={{ color: colors.muted }}>• Warm Amber</Text>
      </View>

      <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, backgroundColor: "#fff", gap: 12 }}>
        <Text style={{ fontWeight: "600" }}>Notifications</Text>
        <Pressable style={{ padding: 12, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Enable Daily Reminder</Text>
        </Pressable>
        <Text style={{ color: colors.muted }}>Time: 08:00 (placeholder)</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.muted }}>Version 0.1.0 • ProgressPulse</Text>
      </View>
    </View>
  );
}
