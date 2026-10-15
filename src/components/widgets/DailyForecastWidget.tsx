import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DailyForecast, TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatTemp } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface DailyForecastWidgetProps {
  daily: DailyForecast[];
  currentTempC: number;
  unit: TemperatureUnit;
  onPress?: () => void;
}

export const DailyForecastWidget: React.FC<DailyForecastWidgetProps> = ({
  daily,
  currentTempC,
  unit,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  // Find global min and max across all days to normalize horizontal temperature bars
  const globalMin = Math.min(...daily.map((d) => d.minC));
  const globalMax = Math.max(...daily.map((d) => d.maxC));
  const tempRange = Math.max(1, globalMax - globalMin);

  const getConditionIcon = (condition: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (condition) {
      case 'clear_day':
        return 'weather-sunny';
      case 'clear_night':
        return 'weather-night';
      case 'partly_cloudy_day':
        return 'weather-partly-cloudy';
      case 'partly_cloudy_night':
        return 'weather-night-partly-cloudy';
      case 'cloudy':
        return 'weather-cloudy';
      case 'rain':
      case 'heavy_rain':
        return 'weather-pouring';
      case 'thunderstorm':
        return 'weather-lightning-rainy';
      case 'snow':
        return 'weather-snowy';
      case 'fog':
        return 'weather-fog';
      default:
        return 'weather-partly-cloudy';
    }
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'clear_day':
        return '#FFD166';
      case 'rain':
      case 'heavy_rain':
        return '#60A5FA';
      case 'thunderstorm':
        return '#C084FC';
      default:
        return '#CBD5E1';
    }
  };

  // Color generator for temp gradient
  const getGradientForTemps = (min: number, max: number): [string, string] => {
    const avg = (min + max) / 2;
    if (avg < 15) return ['#38BDF8', '#34D399'];
    if (avg < 23) return ['#34D399', '#FBBF24'];
    if (avg < 28) return ['#FBBF24', '#FB923C'];
    return ['#FB923C', '#F87171'];
  };

  return (
    <WidgetCard
      title="Previsão para 10 Dias"
      icon="calendar-blank-outline"
      size="full"
      onPress={onPress}
    >
      <View style={styles.listContainer}>
        {daily.map((day, index) => {
          const isToday = index === 0;

          // Calculate bar offsets relative to 10-day global spread
          const leftPercent = Math.max(0, Math.min(100, ((day.minC - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((globalMax - day.maxC) / tempRange) * 100));
          const barWidthPercent = Math.max(10, 100 - leftPercent - rightPercent);

          // Dot position for today's current temp
          const dotPositionPercent = Math.max(
            0,
            Math.min(100, ((currentTempC - day.minC) / Math.max(1, day.maxC - day.minC)) * 100)
          );

          const gradientColors = getGradientForTemps(day.minC, day.maxC);

          return (
            <View key={day.date} style={styles.dayRow}>
              {/* Day Label */}
              <View style={[styles.dayCol, isSmall && { width: 32 }]}>
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    isSmall && { fontSize: FontSizes.dailyDaySmall },
                  ]}
                >
                  {day.shortDayName}
                </Text>
              </View>

              {/* Icon & Rain Chance */}
              <View style={[styles.iconCol, isSmall && { width: 30 }]}>
                <MaterialCommunityIcons
                  name={getConditionIcon(day.condition)}
                  size={isSmall ? 16 : 18}
                  color={getConditionColor(day.condition)}
                />
                {day.precipitationProbability >= 20 ? (
                  <Text style={[styles.popText, isSmall && { fontSize: FontSizes.bodyXs }]}>
                    {day.precipitationProbability}%
                  </Text>
                ) : null}
              </View>

              {/* Min Temp */}
              <View style={[styles.minTempCol, isSmall && { width: 26, marginRight: 3 }]}>
                <Text style={[styles.minTempText, isSmall && { fontSize: FontSizes.dailyDaySmall }]}>
                  {formatTemp(day.minC, unit)}
                </Text>
              </View>

              {/* Apple Weather Horizontal Temp Bar */}
              <View style={styles.barCol}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFillContainer,
                      {
                        left: `${leftPercent}%`,
                        width: `${barWidthPercent}%`,
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={gradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientBar}
                    />

                    {/* Today's Current Temp Indicator Dot */}
                    {isToday && (
                      <View
                        style={[
                          styles.currentTempDot,
                          {
                            left: `${dotPositionPercent}%`,
                          },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </View>

              {/* Max Temp */}
              <View style={[styles.maxTempCol, isSmall && { width: 26, marginLeft: 3 }]}>
                <Text style={[styles.maxTempText, isSmall && { fontSize: FontSizes.dailyDaySmall }]}>
                  {formatTemp(day.maxC, unit)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </WidgetCard>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 3,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  dayCol: {
    width: 36,
  },
  dayText: {
    fontSize: FontSizes.dailyDay,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  todayText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  iconCol: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popText: {
    fontSize: FontSizes.dailyPop,
    fontFamily: Fonts.bold,
    color: '#67E8F9',
    marginTop: -2,
  },
  minTempCol: {
    width: 28,
    alignItems: 'flex-end',
    marginRight: 6,
  },
  minTempText: {
    fontSize: FontSizes.dailyTemp,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  barCol: {
    flex: 1,
    height: 5,
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  barBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  barFillContainer: {
    position: 'absolute',
    height: '100%',
    borderRadius: 2,
    overflow: 'visible',
    justifyContent: 'center',
  },
  gradientBar: {
    ...StyleSheet.absoluteFill,
    borderRadius: 2,
  },
  currentTempDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    marginLeft: -3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  maxTempCol: {
    width: 28,
    alignItems: 'flex-start',
    marginLeft: 6,
  },
  maxTempText: {
    fontSize: FontSizes.dailyTemp,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
