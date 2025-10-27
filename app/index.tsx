// app/index.tsx (cleaned for drawer)
import { Link, useFocusEffect } from "expo-router";
import { Text, View, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { getAll, type Entry } from "../lib/store";
import { colors } from "../lib/colors";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<Entry[]>([]);

  const refresh = useCallback(() => setEntries(getAll()), []);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingHorizontal: 16,
        gap: 16,
        backgroundColor: colors.pageBg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 8 }}>
        Your Progress
      </Text>
      <Text style={{ color: "#64748B" }}>
        Capture quick entries and see your momentum.
      </Text>

      {entries.length === 0 ? (
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            borderStyle: "dashed",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#64748B" }}>No entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item: entry }) => (
            <Link href={`/entry/${entry.id}`} asChild>
              <Pressable
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  borderRadius: 12,
                  marginBottom: 10,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ fontWeight: "600" }}>
                  {entry.text.split("\n")[0].slice(0, 60) || "Entry"}
                </Text>
                <Text style={{ color: "#64748B", marginTop: 4 }}>
                  {new Date(entry.createdAt).toLocaleString()}
                </Text>
              </Pressable>
            </Link>
          )}
        />
      )}

      <Link href="/entry/new" asChild>
        <Pressable
          style={{
            padding: 14,
            backgroundColor: "#4F46E5",
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
