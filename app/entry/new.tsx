import { View, Text, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { colors } from '../../lib/colors';
import { addEntry } from '@/lib/store';

export default function NewEntry() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  const saveEntry = () => {
    const textItem = text.trim();
    if (!textItem) return;
    addEntry(textItem);
    router.replace('/'); // go back to home page
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingHorizontal: 16,
        gap: 12,
        backgroundColor: colors.pageBg,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600' }}>What’s your update?</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type something…"
        multiline
        style={{
          minHeight: 120,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          backgroundColor: '#fff',
        }}
      />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
          }}
        >
          <Text>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={saveEntry}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            backgroundColor: colors.primary,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
