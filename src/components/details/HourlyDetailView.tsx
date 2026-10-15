import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { HourlyForecast, CurrentWeather, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatTemp } from '../../services/weatherUtils';

interface HourlyDetailViewProps {
  hourly: HourlyForecast[];
  current: CurrentWeather;
  unit: TemperatureUnit;
}

export const HourlyDetailView: React.FC<HourlyDetailViewProps> = ({ hourly, current, unit }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [filterPeriod, setFilterPeriod] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos');

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const filteredHours = hourly.filter((h) => {
    const num = parseInt(h.hourLabel.replace('h', ''), 10) || 0;
    if (filterPeriod === 'manha') return num >= 6 && num < 12;
    if (filterPeriod === 'tarde') return num >= 12 && num < 18;
    if (filterPeriod === 'noite') return num >= 18 || num < 6;
    return true;
  });

  const selectedHour = hourly[selectedIdx] || hourly[0];

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
      {/* Hero Selected Hour Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Previsão Horária • {selectedHour.hourLabel}</Text>
            <Text style={styles.heroTemp}>{formatTemp(selectedHour.tempC, unit)}</Text>
            <Text style={styles.heroCond}>{selectedHour.conditionText}</Text>
          </View>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={getConditionIcon(selectedHour.condition) as any}
              size={40}
              color="#FDE047"
            />
          </View>
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaPill}>
            <MaterialCommunityIcons name="water-percent" size={15} color="#38BDF8" />
            <Text style={styles.heroMetaText}>
              Chuva: {selectedHour.precipitationProbability}%
            </Text>
          </View>
          <View style={styles.heroMetaPill}>
            <MaterialCommunityIcons name="clock-outline" size={15} color="#93C5FD" />
            <Text style={styles.heroMetaText}>Horário Local: {selectedHour.time}</Text>
          </View>
        </View>

        <Text style={styles.heroSummary}>{current.friendlySummary}</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Linha do Tempo das Próximas 24 Horas</Text>
        </View>

        <View style={styles.filterRow}>
          {[
            { key: 'todos' as const, label: 'Todas 24h' },
            { key: 'manha' as const, label: 'Manhã' },
            { key: 'tarde' as const, label: 'Tarde' },
            { key: 'noite' as const, label: 'Noite' },
          ].map((tab) => {
            const isSel = filterPeriod === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setFilterPeriod(tab.key);
                }}
                style={[styles.filterBtn, isSel && styles.filterBtnActive]}
              >
                <Text style={[styles.filterBtnText, isSel && styles.filterBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Horizontal Hour Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hoursScroll}>
          {filteredHours.map((h, i) => {
            const actualIndex = hourly.indexOf(h);
            const isSel = selectedIdx === actualIndex;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedIdx(actualIndex);
                }}
                style={[styles.hourCard, isSel && styles.hourCardActive]}
              >
                <Text style={styles.hourLabelText}>{h.hourLabel}</Text>
                <MaterialCommunityIcons
                  name={getConditionIcon(h.condition) as any}
                  size={20}
                  color={isSel ? '#FDE047' : '#FFFFFF'}
                  style={{ marginVertical: 4 }}
                />
                <Text style={styles.hourTempText}>{formatTemp(h.tempC, unit)}</Text>
                <View style={styles.popTag}>
                  <Text style={styles.popTagText}>{h.precipitationProbability}%</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
  },
  heroTemp: {
    fontSize: 44,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroCond: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
    marginTop: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(253, 224, 71, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  heroMetaText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  heroSummary: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginTop: 4,
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterBtnActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.22)',
    borderColor: '#60A5FA',
  },
  filterBtnText: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  hoursScroll: {
    flexDirection: 'row',
  },
  hourCard: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  hourCardActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderColor: '#60A5FA',
  },
  hourLabelText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  hourTempText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginVertical: 2,
  },
  popTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  popTagText: {
    fontSize: 8.5,
    fontFamily: Fonts.bold,
    color: '#38BDF8',
  },
});
