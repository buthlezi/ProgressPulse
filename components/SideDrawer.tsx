import { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, View, Text } from "react-native";
import { router } from "expo-router";
import { useDrawer } from "../lib/drawer";
import { colors } from "../lib/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDefaultHeaderHeight } from "@react-navigation/elements";

const { width, height } = Dimensions.get("window");

const WIDTH = Math.min(150, Math.round(Dimensions.get("window").width * 0.8));
// Use the library's helper to match the real header height

export default function SideDrawer() {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = getDefaultHeaderHeight({ width, height },false,insets.top) - 8;

  const { open, close } = useDrawer();
  const translatedOnX = useRef(new Animated.Value(-WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  console.log('opacity',opacity);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translatedOnX, { toValue: open ? 0 : -WIDTH, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: open ? 1 : 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [open, translatedOnX, opacity]);

  const nav = (href: string) => () => { close(); router.push(href); };

  return (
    <>
      {/* Backdrop should not cover header */}
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={{ position: "absolute",
          left: 0, right: 0, bottom: 0,
          top: HEADER_HEIGHT,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity
         }}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      {/* Panel sits below header */}
      <Animated.View
        style={{
          position: "absolute",
          top: HEADER_HEIGHT, bottom: 0, left: 0,          // ⬅️ start below header
          width: WIDTH,
          backgroundColor: "#fff",
          borderRightWidth: 1, borderRightColor: colors.border,
          transform: [{ translateX: translatedOnX }],
          // no paddingTop here now
        }}
      >
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <Pressable onPress={nav("/")}><Text style={{ fontSize: 18, marginTop: 8 }}>🏠  Home</Text></Pressable>
          <Pressable onPress={nav("/stats")}><Text style={{ fontSize: 18 }}>📊  Stats</Text></Pressable>
          <Pressable onPress={nav("/settings")}><Text style={{ fontSize: 18 }}>⚙️  Settings</Text></Pressable>
        </View>
      </Animated.View>
    </>
  );
}
