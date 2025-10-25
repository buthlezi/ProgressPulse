// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerTitle: "ProgressPulse",
          headerStyle: { backgroundColor: "#3730A3" },
          headerTintColor: "#FFFFFF",
        }}
      />
    </SafeAreaProvider>
  );
}
