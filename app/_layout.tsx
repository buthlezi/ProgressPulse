// app/_layout.tsx
import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Stack } from 'expo-router';
// import { getAccessToken } from '../lib/auth';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HeaderHeightProvider, useHeaderHeight } from '../lib/context/HeaderHeightContext';
import { DrawerProvider, useDrawer } from '../lib/drawer';
import SideDrawer from '../components/SideDrawer';
// import { colors } from '../lib/themes';
import { ThemeProviderContext, useThemeColors } from '../lib/context/ThemeProviderContext';

function AppHeader({ title = 'ProgressPulse' }: { title?: string }) {
const insets = useSafeAreaInsets();
  const { setHeaderHeight } = useHeaderHeight();
  const { toggle } = useDrawer();
  const colors = useThemeColors();

  return (
    <View
      onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      style={{
        paddingTop: insets.top,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: colors.headerBg,
        borderBottomColor: colors.headerBottom,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        style={{ paddingHorizontal: 8, paddingVertical: 6 }}
      >
        <Ionicons name="menu" size={22} color={colors.headerText} />
      </Pressable>
      <Text style={{ color: colors.headerText, fontSize: 18, fontWeight: '600' }}>{title}</Text>
    </View>
  );
}

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ThemeProviderContext>
        <HeaderHeightProvider>
          <DrawerProvider>
           <Stack
              initialRouteName='(app)'
              screenOptions={{
                header: () => <AppHeader />,
              }}
            >
              <Stack.Screen
                name="sign-in"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(app)"
              />
            </Stack>
            <SideDrawer />
          </DrawerProvider>
        </HeaderHeightProvider>
      </ThemeProviderContext>
    </SafeAreaProvider>
  );
}
