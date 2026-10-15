import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HourlyForecast, TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatTemp } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface HourlyForecastWidgetProps {
  hourly: HourlyForecast[];
  unit: TemperatureUnit;
  friendlySummary: string;
  onPress?: () => void;
}

export const HourlyForecastWidget: React.FC<HourlyForecastWidgetProps> = ({
  hourly,
  unit,
  friendlySummary,
  onPress,
}) => {
  const getIcon = (item: HourlyForecast): keyof typeof MaterialCommunityIcons.glyphMap => {
    if (item.isSunset) return 'weather-sunset-down';
    if (item.isSunrise) return 'weather-sunset-up';
    switch (item.condition) {
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
      case 'sunset':
        return 'weather-sunset';
      default:
        return 'weather-cloudy';
    }
  };

  const getIconColor = (item: HourlyForecast): string => {
    if (item.isSunset || item.isSunrise || item.condition === 'sunset') return '#FF9E64';
    if (item.condition === 'clear_day') return '#FFD166';
    if (item.condition === 'clear_night') return '#93C5FD';
    if (item.condition === 'rain' || item.condition === 'heavy_rain') return '#60A5FA';
    if (item.condition === 'thunderstorm') return '#C084FC';
    return '#E2E8F0';
  };

  return (
    <WidgetCard
      title="Previsão Horária"
      icon="clock-outline"
      size="full"
      onPress={onPress}
    >
      <Text style={styles.summaryText}>{friendlySummary}</Text>

      <View style={styles.divider} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.map((item, index) => {
          const isNow = index === 0;

          return (
            <View
              key={`${item.time}-${index}`}
              style={[styles.hourItem, isNow && styles.nowHourItem]}
            >
              {/* Hour Label */}
              <Text style={[styles.hourLabel, isNow && styles.nowHourLabel]}>
                {item.hourLabel}
              </Text>

              {/* Rain Chance Pill */}
              <View style={styles.precipContainer}>
                {item.precipitationProbability > 0 ? (
                  <Text style={styles.precipText}>{item.precipitationProbability}%</Text>
                ) : (
                  <View style={{ height: 12 }} />
                )}
              </View>

              {/* Condition Icon */}
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name={getIcon(item)}
                  size={22}
                  color={getIconColor(item)}
                />
              </View>

              {/* Temp or Event */}
              {item.isSunset || item.isSunrise ? (
                <Text style={styles.eventLabel}>{item.eventLabel || 'Sol'}</Text>
              ) : (
                <Text style={styles.tempText}>
                  {formatTemp(item.tempC, unit)}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </WidgetCard>
  );
};

const styles = StyleSheet.create({
  summaryText: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 8,
  },
  scrollContent: {
    paddingRight: 6,
    gap: 13,
  },
  hourItem: {
    alignItems: 'center',
    minWidth: 44,
    paddingVertical: 3,
  },
  nowHourItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 5,
  },
  hourLabel: {
    fontSize: FontSizes.hourHourLabel,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
  },
  nowHourLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  precipContainer: {
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  precipText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.bold,
    color: '#67E8F9',
  },
  iconWrapper: {
    marginVertical: 5,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempText: {
    fontSize: FontSizes.hourlyTemp,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginTop: 1,
  },
  eventLabel: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
    color: '#FDBA74',
    textAlign: 'center',
    maxWidth: 42,
  },
});
