// app/index.tsx (Home)
import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { initDb } from '../lib/db';
import {
  addEntry,
  clearAllEntries,
  Entry,
  getEntryCount,
  listEntries,
  // syncEntries,
} from '../lib/entries';
import { Link } from 'expo-router';
// import { useThemeColors } from '../lib/context/ThemeProviderContext';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  // const colors = useThemeColors();

  useEffect(() => {
    (async () => {
      await initDb();
      setEntries(await listEntries());
    })();
  }, []);

  const addDemo = async () => {
    const id = await addEntry(
      'First ProgressPulse entry ✨',
      new Date().toISOString().slice(0, 10),
    );
    setEntries(await listEntries());
    console.log('Inserted id', id);
  };

  // await syncEntries();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Your Progress</Text>
      <Button title="Add demo entry" onPress={addDemo} />

      <View style={{ marginTop: 12, gap: 8 }}>
        <Button
          title="Count entries"
          onPress={async () => {
            const count = await getEntryCount();
            console.log('[entries] count =', count);
            alert(`Entries in DB: ${count}`);
          }}
        />

        <Button
          title="Clear all entries"
          color="#c62828"
          onPress={async () => {
            await clearAllEntries();
            const fresh = await listEntries();
            setEntries(fresh);
            alert('All entries deleted.');
          }}
        />
      </View>

      <FlatList
        style={{ marginTop: 12 }}
        data={entries}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text>{item.text}</Text>
            <Text style={{ opacity: 0.6 }}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 16, opacity: 0.6 }}>No entries yet</Text>}
      />
      <Link href="/entry/new">+ Add Entry</Link>
    </View>
  );
}
