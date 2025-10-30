import { View, Text, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getEntry, updateEntry } from '../../../lib/store';
// import { colors } from '../../../lib/themes';
import { useState } from 'react';
import { useThemeColors } from '@/lib/context/ThemeContext';

export default function EditEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const entry = id ? getEntry(id) : undefined;
  const colors = useThemeColors();
  const [text, setText] = useState(entry?.text ?? '');

  if (!entry) {
    return (
      <View
        style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 16, justifyContent: 'center' }}
      >
        <Text style={{ textAlign: 'center', color: colors.muted }}>Entry not found.</Text>
      </View>
    );
  }

  const saveEntry = () => {
    const textItem = text.trim();
    if (!textItem) return;
    updateEntry(entry.id, textItem);
    router.replace('/'); // go back to home
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
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Edit entry</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Update text…"
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
