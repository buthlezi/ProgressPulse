import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View, Text } from 'react-native';
import {useRouter}  from 'expo-router';
import { logout } from '../lib/auth';
import { useDrawer } from '../lib/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '../lib/context/HeaderHeightContext';
import { useThemeColors } from '../lib/context/ThemeProviderContext';

const { width: windowWidth } = Dimensions.get('window');

const WIDTH = Math.min(150, Math.round(windowWidth * 0.8));

const rowStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 0,
  },
});

export default function SideDrawer() {
  const { headerHeight } = useHeaderHeight();
  const router = useRouter();

  const TOP = Math.round(headerHeight) - StyleSheet.hairlineWidth;
  const colors = useThemeColors();
  const { open, close } = useDrawer();
  const translatedOnX = useRef(new Animated.Value(-WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translatedOnX, {
        toValue: open ? 0 : -WIDTH,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: open ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, translatedOnX, opacity]);

  const nav = (href: any) => () => {
    close();
    router.push(href);
  };

  return (
    <>
      {/* Backdrop should not cover header */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: TOP,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      {/* Panel sits below header */}
      <Animated.View
        style={{
          position: 'absolute',
          top: TOP,
          bottom: 0,
          left: 0, // ⬅️ start below header
          width: WIDTH,
          backgroundColor: '#fff',
          borderRightWidth: 1,
          borderRightColor: colors.border,
          transform: [{ translateX: translatedOnX }],
          // no paddingTop here now
        }}
      >
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <Pressable onPress={nav('/')} style={rowStyle.row}>
            <Text style={{ fontSize: 18, marginTop: 8 }}>🏠 Home</Text>
          </Pressable>
          <Pressable onPress={nav('/stats')} style={rowStyle.row}>
            <Text style={{ fontSize: 18 }}>📊 Stats</Text>
          </Pressable>
          <Pressable onPress={nav('/settings')} style={rowStyle.row}>
            <Text style={{ fontSize: 18 }}>⚙️ Settings</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              await logout();
              close();
              router.replace('./sign-in');
            }}
           style={rowStyle.row}
          >
            <Ionicons name="log-out-outline" size={20} />
            <Text style={{ fontSize: 18 }}>Sign Out</Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}
