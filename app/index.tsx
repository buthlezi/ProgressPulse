// app/index.tsx (Home)
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import '../lib/amplify'


import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { initDb } from '../lib/db';
import { addEntry, Entry, listEntries, syncEntries } from '../lib/entries';
import { Hub } from 'aws-amplify/utils';
// import { Link } from 'expo-router';
// import { useThemeColors } from '../lib/context/ThemeProviderContext';
import { login, getAccessToken} from '../lib/auth'; 
import React from 'react';

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
  const [authReady, setAuthReady] = useState(false);
  // ⏳ give Amplify time to persist the session
  
  // const colors = useThemeColors();

  useEffect(() => {
    const sub = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') {
        console.log('[auth] hub: signedIn');
        setAuthReady(true);
      }
    });

    // 👇 handle restored session
    (async () => {
      const token = await getAccessToken();
      if (token) {
        console.log('[auth] session restored');
        setAuthReady(true);
      }
    })();
  
    return () => sub();
  }, []);
  

  useEffect(() => {
    (async () => {
      try {
        console.log('[auth] starting login...');
        await login('email', 'password');
        console.log('[auth] login success');

        setAuthReady(true);

      } catch (e) {
        console.warn('[auth] login failed', e);
        return; // stop here if login fails
      }
  
      await initDb();
      setEntries(await listEntries());
    })();
  }, []);


  useEffect(() => {
    if (!authReady) return;
  
    (async () => {
      
      console.log('Syncing...');
      try {
        await syncEntries();
      } catch (error) {
        console.warn('Initial sync failed', error);
      }
    })();
  }, [authReady]);
  

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
