import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, HourlyForecast } from '../../types/weather';
import { Fonts } from '../../theme/fonts';

interface PrecipitationDetailViewProps {
  current: CurrentWeather;
  hourly: HourlyForecast[];
}

export const PrecipitationDetailView: React.FC<PrecipitationDetailViewProps> = ({
  current,
  hourly,
}) => {
  const [selectedRoofArea, setSelectedRoofArea] = useState<number>(100);
  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(0);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  // 1 mm of rain on 1 m² = 1 Liter of water
  const rainHarvestLiters = Math.round(current.precipitationMm * selectedRoofArea * 0.85); // 85% runoff efficiency

  const next12Hours = hourly.slice(0, 12);
  const selectedHour = next12Hours[selectedHourIdx] || next12Hours[0];

  const getRainIntensity = (mm: number) => {
    if (mm === 0) return { label: 'Sem Chuva', color: '#60A5FA', desc: 'Tempo seco no período.' };
    if (mm < 2.5) return { label: 'Chuva Leve / Garoa', color: '#38BDF8', desc: 'Gotas finas de baixa densidade.' };
    if (mm <= 10) return { label: 'Chuva Moderada', color: '#3B82F6', desc: 'Precipitação contínua regular.' };
    if (mm <= 50) return { label: 'Chuva Forte', color: '#F97316', desc: 'Enxurradas e poças d’água rápidas.' };
    return { label: 'Chuva Torrencial', color: '#EF4444', desc: 'Alerta de alagamentos e deslizamentos.' };
  };

  const intensity = getRainIntensity(current.precipitationMm);

  return (
    <View style={styles.container}>
      {/* Hero Rain Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Precipitação em 24h</Text>
            <Text style={styles.heroVal}>{current.precipitationMm} mm</Text>
            <View style={styles.probPill}>
              <MaterialCommunityIcons name="water-percent" size={14} color="#60A5FA" />
              <Text style={styles.probText}>
                Probabilidade Atual: {current.precipitationProbability}%
              </Text>
            </View>
          </View>
          <View style={styles.rainIconCircle}>
            <MaterialCommunityIcons name="weather-rainy" size={36} color="#60A5FA" />
          </View>
        </View>

        <View style={styles.intensityRow}>
          <Text style={styles.intensityLabel}>Status: </Text>
          <Text style={[styles.intensityVal, { color: intensity.color }]}>
            {intensity.label}
          </Text>
          <Text style={styles.intensityDesc}> — {intensity.desc}</Text>
        </View>
      </View>

      {/* INTERACTIVE 1: Gráfico Horário de Probabilidade */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-bell-curve" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Probabilidade de Chuva Hora a Hora</Text>
        </View>
        <Text style={styles.sectionSub}>Toque em uma hora para ver a chance de precipitação:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourScroll}>
          {next12Hours.map((h, i) => {
            const isSel = selectedHourIdx === i;
            const pop = h.precipitationProbability;
            const popColor = pop > 60 ? '#38BDF8' : pop > 30 ? '#60A5FA' : 'rgba(255,255,255,0.4)';

            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedHourIdx(i);
                }}
                style={[styles.hourItem, isSel && styles.hourItemActive]}
              >
                <Text style={styles.hourLabel}>{h.hourLabel}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(10, pop)}%`,
                        backgroundColor: popColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.popText, { color: popColor }]}>{pop}%</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedHour && (
          <View style={styles.hourDetailBox}>
            <Text style={styles.hourDetailTitle}>
              Às {selectedHour.hourLabel}: {selectedHour.precipitationProbability}% de chance de chuva
            </Text>
            <Text style={styles.hourDetailDesc}>
              {selectedHour.precipitationProbability >= 50
                ? 'Leve capa de chuva ou guarda-chuva ao sair neste horário.'
                : 'Baixa probabilidade de chuva, tempo predominantemente seguro.'}
            </Text>
          </View>
        )}
      </View>

      {/* INTERACTIVE 2: Calculadora de Captação de Água da Chuva */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="water-pump" size={18} color="#4ADE80" />
          <Text style={styles.sectionTitle}>Calculadora de Captação & Irrigação</Text>
        </View>
        <Text style={styles.sectionSub}>
          Selecione a área do seu telhado ou horta para calcular os litros gerados:
        </Text>

        <View style={styles.areaRow}>
          {[30, 60, 100, 250, 500].map((area) => {
            const isSel = selectedRoofArea === area;
            return (
              <TouchableOpacity
                key={area}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedRoofArea(area);
                }}
                style={[styles.areaBtn, isSel && styles.areaBtnActive]}
              >
                <Text style={[styles.areaBtnText, isSel && styles.areaBtnTextActive]}>
                  {area} m²
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.harvestResultCard}>
          <View style={styles.harvestTop}>
            <MaterialCommunityIcons name="barrel" size={24} color="#4ADE80" />
            <View style={{ flex: 1 }}>
              <Text style={styles.harvestLabel}>Volume de Água Captado:</Text>
              <Text style={styles.harvestVal}>{rainHarvestLiters} Litros</Text>
            </View>
          </View>
          <Text style={styles.harvestSub}>
            Com {current.precipitationMm} mm de chuva em {selectedRoofArea} m², você encheria{' '}
            <Text style={styles.boldBarrels}>
              {(rainHarvestLiters / 200).toFixed(1)} tambores de 200L
            </Text>{' '}
            para irrigação de hortaliças ou limpeza de quintal.
          </Text>
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
    borderColor: 'rgba(56, 189, 248, 0.3)',
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
  heroVal: {
    fontSize: 44,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  probPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  probText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
  },
  rainIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  intensityLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  intensityVal: {
    fontSize: 11.5,
    fontFamily: Fonts.bold,
  },
  intensityDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
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
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 10,
  },
  hourScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  hourItem: {
    width: 50,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  hourItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38BDF8',
  },
  hourLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
  },
  barTrack: {
    width: 6,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
  },
  popText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  hourDetailBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 10,
    padding: 10,
  },
  hourDetailTitle: {
    fontSize: 11.5,
    fontFamily: Fonts.bold,
    color: '#38BDF8',
    marginBottom: 2,
  },
  hourDetailDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  areaRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  areaBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  areaBtnActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.22)',
    borderColor: '#4ADE80',
  },
  areaBtnText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  areaBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  harvestResultCard: {
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  harvestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  harvestLabel: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  harvestVal: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: '#4ADE80',
  },
  harvestSub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  boldBarrels: {
    fontFamily: Fonts.bold,
    color: '#FBBF24',
  },
});
