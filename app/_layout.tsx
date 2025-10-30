// app/_layout.tsx
import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HeaderHeightProvider, useHeaderHeight } from '../lib/context/HeaderHeightContext';
import { DrawerProvider, useDrawer } from '../lib/drawer';
import SideDrawer from '../components/SideDrawer';
// import { colors } from '../lib/themes';
import { ThemeProvider, useThemeColors } from '../lib/context/ThemeContext';

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
      <ThemeProvider>
        <HeaderHeightProvider>
          <DrawerProvider>
            <Stack
              screenOptions={{
                header: () => <AppHeader />,
              }}
            />
            <SideDrawer />
          </DrawerProvider>
        </HeaderHeightProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
