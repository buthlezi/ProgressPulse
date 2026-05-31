import React, { useState, useMemo, useCallback, use } from 'react';
import { useFocusEffect } from 'expo-router';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../lib/context/ThemeProviderContext';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Entry, listEntries } from '../lib/entries';
import { initDb } from '../lib/db';

export default function Stats() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        await initDb();
        const allEntries = await listEntries();

        if (active) {
          setEntries(allEntries);
          setLoading(false);
        }
      })();

      return () => {
        active = false;
      };
    }, []),
  );

  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const chartWidth = Dimensions.get('window').width - 60;

  const last7 = useMemo(() => {
    const today = new Date();
    const result: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() - i);
      const iso = newDate.toISOString().slice(0, 10);

      const count = entries.filter((entry) => entry.date === iso).length;
      console.log('date:', iso, 'count:', count);
      result.push(count);
    }
    console.log('result last7:', result);
    return result;
  }, [entries]);

  const trend30 = useMemo(() => {
    const today = new Date();
    const result: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() - i);
      const iso = newDate.toISOString().slice(0, 10);

      const count = entries.filter((entry) => entry.date === iso).length;
      result.push(count);
    }
    console.log('result trend30:', result);
    return result;
  }, [entries]);

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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: insets.top,
          backgroundColor: colors.pageBg,
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  const labels30 = Array.from({ length: 30 }, (_, item) => (item % 7 === 0 ? `${item + 1}` : ''));

  const maxLast7 = Math.max(...last7);
  const ySegments = Math.max(1, maxLast7); // at least 1 segment to avoid division by zero

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
            segments={ySegments}
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
        <View style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', paddingRight: 100 }}>
          <LineChart
            data={{
              labels: labels30, // optional
              datasets: [{ data: trend30 }],
            }}
            width={chartWidth}
            height={160}
            withDots={false}
            withInnerLines={false}
            // withShadow={false}
            bezier
            segments={2}
            fromZero
            chartConfig={{
              backgroundGradientFrom: colors.pageBg,
              backgroundGradientTo: colors.pageBg,
              color: () => colors.primary ?? '#6366F1',
              labelColor: () => colors.primaryDark ?? '#111',
              decimalPlaces: 0,
              propsForBackgroundLines: { strokeWidth: 0 },
              propsForLabels: { fontSize: 10 },
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
