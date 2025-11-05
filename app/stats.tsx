import React, { useMemo } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../lib/context/ThemeProviderContext';
import { BarChart, LineChart } from 'react-native-chart-kit';

export default function Stats() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const chartWidth = Dimensions.get('window').width - 32;

  const last7 = useMemo(() => [1, 0, 2, 3, 1, 4, 2], []);
  const trend30 = [
    0, 1, 0, 2, 1, 3, 1, 0, 2, 2, 3, 4, 2, 1, 0, 1, 1, 3, 2, 2, 1, 0, 4, 3, 2, 1, 2, 3, 2, 4,
  ];

  const streak = useMemo(() => {
    let streakValue = 0;
    for (let item = last7.length - 1; item >= 0; item--) {
      if (last7[item] > 0) streakValue += 1;
      else break;
    }
    return streakValue;
  }, [last7]);

  const cardStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.pageBg ?? '#fff',
  };

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
      {/* Streak Overview */}
      <View style={cardStyle}>
        <Text style={{ fontWeight: '600' }}>🔥 Streak Overview</Text>
        <View style={{ marginTop: 10 }}>
          <BarChart
            yAxisLabel=""
            yAxisSuffix=""
            data={{
              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
              datasets: [{ data: last7 }],
            }}
            width={chartWidth}
            height={170}
            showBarTops={false}
            showValuesOnTopOfBars={false}
            withInnerLines={false}
            withHorizontalLabels
            withVerticalLabels
            xLabelsOffset={0}
            fromZero
            chartConfig={{
              backgroundGradientFrom: colors.pageBg,
              backgroundGradientTo: colors.pageBg,
              color: () => colors.primary ?? '#6366F1',
              labelColor: () => colors.primaryDark ?? '#111',
              barPercentage: 0.5,
              decimalPlaces: 0,
              propsForBackgroundLines: { strokeWidth: 0 },
            }}
            style={{ borderRadius: 8 }}
          />
        </View>
        <Text style={{ color: colors.muted, marginTop: 8 }}>
          Current streak: {streak} day{streak === 1 ? '' : 's'}
        </Text>
      </View>

      {/* Entries over time */}
      <View style={cardStyle}>
        <Text style={{ fontWeight: '600' }}>📈 Entries over time</Text>
        <View style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden' }}>
          <LineChart
            data={{
              labels: [], // optional
              datasets: [{ data: trend30 }],
            }}
            width={chartWidth}
            height={160}
            withDots={false}
            withInnerLines={false}
            // withShadow={false}
            bezier
            fromZero
            chartConfig={{
              backgroundGradientFrom: colors.pageBg,
              backgroundGradientTo: colors.pageBg,
              color: () => colors.primary ?? '#6366F1',
              labelColor: () => colors.primaryDark ?? '#111',
              decimalPlaces: 0,
              propsForBackgroundLines: { strokeWidth: 0 },
            }}
            style={{}}
          />
        </View>
        <Text style={{ color: colors.muted, marginTop: 8 }}>Last 30 days</Text>
      </View>

      {/* Export (stub) */}
      <View style={{ height: 8 }} />
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          /* TODO: wire up export after SQLite */
        }}
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: colors.pageBg ?? '#f3f4f6',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ fontWeight: '600' }}>Export Data</Text>
      </Pressable>
    </View>
  );
}
