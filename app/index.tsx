// app/index.tsx (Home)
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { initDb } from '../lib/db';
import { addEntry, Entry, listEntries, syncEntries } from '../lib/entries';
// import { Link } from 'expo-router';
import { SYNC_ENDPOINT } from '../lib/config';
// import { useThemeColors } from '../lib/context/ThemeProviderContext';

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
    margin: 12,
  },
});

export default function Home() {
  const [value, setValue] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  // const colors = useThemeColors();

  useEffect(() => {
    (async () => {
      await initDb();
      setEntries(await listEntries());
      console.log('[debug] entries after add:', await listEntries());
    })();
  }, []);

  useEffect(() => {
    if (!SYNC_ENDPOINT) {
      console.log('[sync] Skipping initial sync - backend not configured');
      return;
    }
    console.log('Syncing...');
    (async () => {
      try {
        await syncEntries();
      } catch (error) {
        console.warn('Initial sync failed', error);
      }
    })();
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Your Progress</Text>
      <View
        style={{
          justifyContent: 'center',
          marginTop: 12,
        }}
      >
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={setValue}
          value={value}
          style={styles.textInput}
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button
          title="Add Entry"
          color={value.trim() ? '#c62828' : '#aaaaaa'}
          disabled={value.trim().length === 0}
          onPress={async () => {
            if (value.trim().length === 0) return;
            const id = await addEntry(value, new Date().toISOString().slice(0, 10));
            setEntries(await listEntries());
            setValue('');
            console.log('Inserted id', id);
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
    </View>
  );
}

{
  /* <Pressable
onPress={toggle}
accessibilityRole="button"
accessibilityLabel="Open menu"
style={{ paddingHorizontal: 8, paddingVertical: 6 }}
>
<Ionicons name="menu" size={22} color={colors.headerText} />
</Pressable> */
}
