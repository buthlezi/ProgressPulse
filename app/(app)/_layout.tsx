// app/(app)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack, Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { getAccessToken } from '../../lib/auth';

export default function AppLayout() {
  const [status, setStatus] = useState<'checking' | 'authed' | 'unauthed'>('checking');

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      setStatus(token ? 'authed' : 'unauthed');
    })();
  }, []);

  if (status === 'checking') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === 'unauthed') {
    return <Redirect href="./sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;

}
