import { View, Text, Pressable, Alert, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getEntry, removeEntry } from "../../lib/store";
import { colors } from "../../lib/colors";

export default function EntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const entry = id ? getEntry(id) : undefined;

  if (!entry) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 16, backgroundColor: colors.pageBg, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", color: colors.muted }}>Entry not found.</Text>
      </View>
    );
  }

  const dateStr = new Date(entry.createdAt).toLocaleString();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 16, gap: 12, backgroundColor: colors.pageBg }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {entry.text.split("\n")[0].slice(0, 60) || "Entry"}
      </Text>
      <View style={{ height: 1, backgroundColor: colors.border }} />
      <Text style={{ color: colors.muted }}>{entry.text}</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>Date: {dateStr}</Text>

      <View style={{ gap: 10, marginTop: 16 }}>
        {/* (Optional) Hook up edit later */}
        <Pressable
          style={{ padding: 14, backgroundColor: colors.primary, borderRadius: 10, alignItems: "center" }}
          onPress={() => router.push(`/entry/${entry.id}/edit`)}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Edit Entry</Text>
        </Pressable>

        <Pressable
          style={{ padding: 14, borderColor: "#FCA5A5", borderWidth: 1, borderRadius: 10, alignItems: "center" }}
          onPress={() =>
            Alert.alert("Delete entry?", "This cannot be undone.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  removeEntry(entry.id);
                  router.back();
                },
              },
            ])
          }
        >
          <Text style={{ color: "#B91C1C", fontWeight: "600" }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
