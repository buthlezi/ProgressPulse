// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { Ionicons} from '@expo/vector-icons';
import { DrawerProvider, useDrawer } from "../lib/drawer";
import SideDrawer from "../components/SideDrawer";
import { colors } from "../lib/colors";

function HeaderHamburger() {
  const { toggle } = useDrawer();
  return (
    <Pressable onPress={toggle} style={{ paddingHorizontal: 12 }}>
      <Ionicons name="menu" size={22} color="#fff" />
    </Pressable>
  );
}


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <DrawerProvider>
      <Stack
        screenOptions={{
          headerTitle: "ProgressPulse",
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: colors.headerText,
          headerLeft: () => <HeaderHamburger />,
        }}
      />
      <SideDrawer />
      </DrawerProvider>
    </SafeAreaProvider>
  );
}

