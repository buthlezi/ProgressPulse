import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../lib/colors";

export default function EntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 16, gap: 12, backgroundColor: colors.pageBg }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>[ Title or first line ]</Text>
      <View style={{ height: 1, backgroundColor: colors.border }} />
      <Text style={{ color: colors.muted }}>[ Full entry text here... ]</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>Date: 2025-10-25 09:00</Text>

      <View style={{ gap: 10, marginTop: 16 }}>
        <Pressable style={{ padding: 14, backgroundColor: colors.primary, borderRadius: 10, alignItems: "center" }}
          onPress={() => router.push(`/entry/${id}/edit`) /* optional future route */}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Edit Entry</Text>
        </Pressable>
        <Pressable style={{ padding: 14, borderColor: "#FCA5A5", borderWidth: 1, borderRadius: 10, alignItems: "center" }}
          onPress={() => { /* TODO: delete then navigate */ router.back(); }}>
          <Text style={{ color: "#B91C1C", fontWeight: "600" }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
