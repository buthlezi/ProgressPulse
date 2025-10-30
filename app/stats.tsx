import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { colors } from '../lib/themes';
import { useThemeColors } from '../lib/context/ThemeContext';

export default function Stats() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingHorizontal: 16,
        gap: 16,
        backgroundColor: colors.pageBg,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Stats</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 16,
          backgroundColor: '#fff',
        }}
      >
        <Text>🔥 Streak Overview</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>[ mini chart placeholder ]</Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 16,
          backgroundColor: '#fff',
        }}
      >
        <Text>📈 Entries over time</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>[ line chart placeholder ]</Text>
      </View>
    </View>
  );
}
