import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../lib/auth';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
        Sign In
      </Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 4 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, marginBottom: 24, borderRadius: 4 }}
      />
      <Button
        title={loading ? 'Signing In...' : 'Sign In'}
        disabled={loading || !email || !password}
        onPress={async () => {
          try {
            setLoading(true);
            await login(email, password);
            router.replace('/');
          } catch (error) {
            console.warn('Login failed', error);
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
}
