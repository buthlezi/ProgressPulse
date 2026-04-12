// app/(app)/index.tsx (Home)
import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { initDb } from '../../lib/db';
import {
  addEntry,
  softDeleteEntry,
  Entry,
  listEntries,
  syncEntries,
  updateEntry,
} from '../../lib/entries';

import { getAccessToken } from '../../lib/auth';

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
    margin: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 45,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalInput: {
    borderColor: '#111',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  modalActionButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalCancelButton: {
    backgroundColor: '#ddd',
  },
  modalSaveButton: {
    backgroundColor: '#2563eb',
  },
});

export default function Home() {
  const [value, setValue] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [authReady, setAuthReady] = useState(false);
  // ⏳ give Amplify time to persist the session

  const refreshEntries = async () => {
    setEntries(await listEntries());
  };

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    (async () => {
      await initDb();
      await refreshEntries();
    })();
  }, []);

  useEffect(() => {
    if (!authReady) return;

    (async () => {
      const token = await getAccessToken();
      if (!token) {
        console.log('[sync] skipping, no token');
        return;
      }

      console.log('Syncing...');
      try {
        await syncEntries();
      } catch (error) {
        console.warn('Initial sync failed', error);
      }
    })();
  }, [authReady]);

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          return;
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await softDeleteEntry(id);
          await refreshEntries();
        },
      },
    ]);
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setEditValue(entry.text);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || !editingEntry) {
      Alert.alert('Validation Error', 'Entry text cannot be empty.');
      return;
    }

    await updateEntry(editingEntry.id, trimmed);
    await refreshEntries();
    setIsEditOpen(false);
    setEditingEntry(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    if (editingEntry) {
      console.log('Edit cancelled for id', editingEntry.id);
    }
    setIsEditOpen(false);
    setEditingEntry(null);
    setEditValue('');
  };

  return (
    <View style={{ padding: 16 }}>
      <Modal
        visible={isEditOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Entry</Text>
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              style={styles.modalInput}
              autoFocus
              multiline
              maxLength={40}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalCancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={{ fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalSaveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      <View style={{ marginTop: 12, marginHorizontal: 12 }}>
        <TouchableOpacity
          disabled={value.trim().length === 0}
          onPress={async () => {
            if (value.trim().length === 0) return;
            const id = await addEntry(value, new Date().toISOString().slice(0, 10));
            await refreshEntries();
            setValue('');
            console.log('Inserted id', id);
          }}
          style={{
            backgroundColor: value.trim().length === 0 ? '#ccc' : '#2563eb', // blue
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            alignSelf: 'flex-start', // 👈 THIS fixes the width
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Add Entry</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ marginTop: 12, marginHorizontal: 12 }}
        data={entries}
        keyExtractor={(entry: any) => entry.id}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item }: { item: Entry }) => (
          <>
            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
                <Text>{item.text}</Text>
                <Text style={{ opacity: 0.6 }}>{item.date}</Text>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ccc',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={{ fontWeight: '600' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#d25050',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 16, opacity: 0.6 }}>No entries yet</Text>}
      />
    </View>
  );
}
