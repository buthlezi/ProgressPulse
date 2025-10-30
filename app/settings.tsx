// import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemeColors } from '../lib/context/ThemeContext';
import { THEMES, ThemeName } from '../lib/themes';
// import { colors } from '../lib/themes';

export default function Settings() {
  const { theme: themeName, setThemeName } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  // Define theme list once
  const themes = Object.keys(THEMES);

  const handleThemeSelect = (theme: ThemeName) => {
    setThemeName(theme);
  };

  const handleEnableReminder = () => {
    console.log('Enabled daily reminder pressed');
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: colors.pageBg,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Settings</Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            backgroundColor: '#fff',
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: '600', marginBottom: 4 }}>Theme</Text>

          {themes.map((theme) => (
            <Pressable key={theme} onPress={() => handleThemeSelect(theme as ThemeName)}>
              <Text
                style={{
                  color: theme === themeName ? colors.primary : colors.muted,
                  fontWeight: theme === themeName ? '600' : '400',
                }}
              >
                • {theme}
                {theme === themeName && ' (active)'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            backgroundColor: '#fff',
            gap: 12,
          }}
        >
          <Text style={{ fontWeight: '600' }}>Notifications</Text>

          <Pressable
            onPress={handleEnableReminder}
            style={({ pressed }) => ({
              padding: 12,
              borderRadius: 10,
              backgroundColor: pressed ? colors.primaryDark : colors.primary,
              alignItems: 'center',
            })}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Enable Daily Reminder</Text>
          </Pressable>

          <Text style={{ color: colors.muted }}>Time: 08:00 (placeholder)</Text>
        </View>

        <View style={{ padding: 16, alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: colors.muted }}>Version 0.1.0 • ProgressPulse</Text>
        </View>
      </ScrollView>
    </View>
  );
}
