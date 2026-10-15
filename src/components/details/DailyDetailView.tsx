import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DailyForecast, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatTemp } from '../../services/weatherUtils';

interface DailyDetailViewProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
  currentTempC: number;
}

export const DailyDetailView: React.FC<DailyDetailViewProps> = ({ daily, unit, currentTempC }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const selectedDay = daily[selectedDayIdx] || daily[0];

  const getConditionIcon = (cond: string) => {
    switch (cond) {
      case 'clear_day':
        return 'weather-sunny';
      case 'clear_night':
        return 'weather-night';
      case 'rain':
      case 'heavy_rain':
        return 'weather-pouring';
      case 'thunderstorm':
        return 'weather-lightning';
      case 'cloudy':
        return 'weather-cloudy';
      default:
        return 'weather-partly-cloudy';
    }
  };

  return (
    <View style={styles.container}>
      {/* Hero Selected Day Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>{selectedDay.dayName} • {selectedDay.date}</Text>
            <View style={styles.tempRangeRow}>
              <Text style={styles.heroMax}>{formatTemp(selectedDay.maxC, unit)}</Text>
              <Text style={styles.heroMin}> / {formatTemp(selectedDay.minC, unit)}</Text>
            </View>
            <Text style={styles.heroCond}>{selectedDay.conditionText}</Text>
          </View>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={getConditionIcon(selectedDay.condition) as any}
              size={38}
              color="#FBBF24"
            />
          </View>
        </View>

        <View style={styles.heroMetrics}>
          <View style={styles.heroMetricPill}>
            <MaterialCommunityIcons name="water-percent" size={14} color="#38BDF8" />
            <Text style={styles.heroMetricText}>Chuva: {selectedDay.precipitationProbability}%</Text>
          </View>
          <View style={styles.heroMetricPill}>
            <MaterialCommunityIcons name="white-balance-sunny" size={14} color="#FBBF24" />
            <Text style={styles.heroMetricText}>UV Máx: {selectedDay.uvIndexMax}</Text>
          </View>
        </View>
      </View>

      {/* 10-Day Interactive List */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar-range" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Previsão dos Próximos 10 Dias (Toque no Dia)</Text>
        </View>

        <View style={styles.daysList}>
          {daily.map((day, idx) => {
            const isSel = selectedDayIdx === idx;
            return (
              <TouchableOpacity
                key={day.date}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedDayIdx(idx);
                }}
                style={[styles.dayRow, isSel && styles.dayRowActive]}
              >
                <View style={styles.dayColLeft}>
                  <Text style={[styles.dayNameText, isSel && styles.dayNameTextActive]}>
                    {idx === 0 ? 'Hoje' : day.shortDayName}
                  </Text>
                  <Text style={styles.dayDateText}>{day.date.slice(5)}</Text>
                </View>

                <View style={styles.iconCol}>
                  <MaterialCommunityIcons
                    name={getConditionIcon(day.condition) as any}
                    size={22}
                    color="#FDE047"
                  />
                  {day.precipitationProbability > 20 && (
                    <Text style={styles.dayPopText}>{day.precipitationProbability}%</Text>
                  )}
                </View>

                {/* Min / Max Temp Bar */}
                <View style={styles.barCol}>
                  <Text style={styles.minTempText}>{formatTemp(day.minC, unit)}</Text>
                  <View style={styles.tempRangeBarTrack}>
                    <View
                      style={[
                        styles.tempRangeBarFill,
                        {
                          width: `${Math.min(100, Math.max(20, (day.maxC - day.minC) * 8))}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.maxTempText}>{formatTemp(day.maxC, unit)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
  },
  tempRangeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroMax: {
    fontSize: 38,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroMin: {
    fontSize: 22,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  heroCond: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
    marginTop: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  heroMetricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  heroMetricText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  daysList: {
    gap: 6,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  dayRowActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.18)',
    borderColor: '#60A5FA',
  },
  dayColLeft: {
    width: 65,
  },
  dayNameText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  dayNameTextActive: {
    color: '#93C5FD',
  },
  dayDateText: {
    fontSize: 9.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  iconCol: {
    width: 44,
    alignItems: 'center',
  },
  dayPopText: {
    fontSize: 8.5,
    fontFamily: Fonts.bold,
    color: '#38BDF8',
  },
  barCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  minTempText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    width: 24,
    textAlign: 'right',
  },
  tempRangeBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  tempRangeBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FBBF24',
  },
  maxTempText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    width: 24,
  },
});
