import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, HourlyForecast } from '../../types/weather';
import { Fonts } from '../../theme/fonts';

interface UvDetailViewProps {
  current: CurrentWeather;
  hourly: HourlyForecast[];
}

type SkinType = 'clara' | 'morena_clara' | 'morena_escura' | 'negra';
type SunscreenFps = 0 | 30 | 50 | 70;

export const UvDetailView: React.FC<UvDetailViewProps> = ({ current, hourly }) => {
  const [selectedSkin, setSelectedSkin] = useState<SkinType>('clara');
  const [selectedFps, setSelectedFps] = useState<SunscreenFps>(50);
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    oculos: true,
    protetor: true,
    chapeu: false,
    sombra: false,
  });

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  // Safe sun time calculation algorithm based on Fitzpatrick scale and UV index
  const calculateBurnTime = () => {
    const baseMinutesBySkin: Record<SkinType, number> = {
      clara: 67,
      morena_clara: 100,
      morena_escura: 140,
      negra: 200,
    };

    const uv = Math.max(1, current.uvIndex);
    const unshieldedMinutes = Math.round(baseMinutesBySkin[selectedSkin] / uv);

    if (selectedFps === 0) {
      return {
        minutes: unshieldedMinutes,
        text: `${unshieldedMinutes} min até início de eritema (queimadura)`,
        status: 'Risco Rápido',
        color: '#F87171',
      };
    }

    const shieldedMinutes = Math.min(480, Math.round(unshieldedMinutes * (selectedFps * 0.4)));
    const hours = Math.floor(shieldedMinutes / 60);
    const mins = shieldedMinutes % 60;

    return {
      minutes: shieldedMinutes,
      text: hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''} de proteção efetiva` : `${mins} min de proteção`,
      status: 'Protegido',
      color: '#4ADE80',
    };
  };

  const burnResult = calculateBurnTime();

  // Synthetic or real daytime UV profile
  const daytimeHours = hourly.slice(0, 14);

  const getUvColor = (val: number) => {
    if (val <= 2) return '#4ADE80';
    if (val <= 5) return '#FBBF24';
    if (val <= 7) return '#FB923C';
    if (val <= 10) return '#F87171';
    return '#A855F7';
  };

  const uvColor = getUvColor(current.uvIndex);

  const toggleCheck = (key: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      {/* Hero Value Card */}
      <View style={[styles.heroCard, { borderColor: uvColor }]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroCategory}>{current.uvCategory}</Text>
            <Text style={[styles.heroVal, { color: uvColor }]}>{current.uvIndex}</Text>
          </View>
          <View style={[styles.uvBadgeCircle, { backgroundColor: `${uvColor}25` }]}>
            <MaterialCommunityIcons name="white-balance-sunny" size={32} color={uvColor} />
          </View>
        </View>

        {/* Visual UV Gauge Bar */}
        <View style={styles.gaugeTrack}>
          <View
            style={[
              styles.gaugeFill,
              {
                width: `${Math.min(100, (current.uvIndex / 12) * 100)}%`,
                backgroundColor: uvColor,
              },
            ]}
          />
        </View>
        <View style={styles.gaugeLabels}>
          <Text style={styles.gaugeScaleText}>0 Baixo</Text>
          <Text style={styles.gaugeScaleText}>3 Mod</Text>
          <Text style={styles.gaugeScaleText}>6 Alto</Text>
          <Text style={styles.gaugeScaleText}>8 Muito Alto</Text>
          <Text style={styles.gaugeScaleText}>11+ Extremo</Text>
        </View>

        <Text style={styles.heroAdvice}>{current.uvAdvice}</Text>
      </View>

      {/* INTERACTIVE 1: Calculadora de Proteção & Tipo de Pele */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calculator-variant" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Simulador de Exposição & Protetor Solar</Text>
        </View>

        <Text style={styles.subLabel}>Selecione seu fototipo de pele:</Text>
        <View style={styles.pillsRow}>
          {[
            { key: 'clara' as SkinType, label: 'Pele Clara' },
            { key: 'morena_clara' as SkinType, label: 'Morena Clara' },
            { key: 'morena_escura' as SkinType, label: 'Morena Escura' },
            { key: 'negra' as SkinType, label: 'Pele Negra' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSelectedSkin(item.key);
              }}
              style={[
                styles.selectPill,
                selectedSkin === item.key && styles.selectPillActive,
              ]}
            >
              <Text
                style={[
                  styles.selectPillText,
                  selectedSkin === item.key && styles.selectPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subLabel, { marginTop: 12 }]}>Fator de Proteção Solar (FPS):</Text>
        <View style={styles.pillsRow}>
          {[
            { fps: 0 as SunscreenFps, label: 'Sem FPS' },
            { fps: 30 as SunscreenFps, label: 'FPS 30' },
            { fps: 50 as SunscreenFps, label: 'FPS 50' },
            { fps: 70 as SunscreenFps, label: 'FPS 70+' },
          ].map((item) => (
            <TouchableOpacity
              key={item.fps}
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSelectedFps(item.fps);
              }}
              style={[
                styles.selectPill,
                selectedFps === item.fps && styles.selectPillActive,
              ]}
            >
              <Text
                style={[
                  styles.selectPillText,
                  selectedFps === item.fps && styles.selectPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Burn result box */}
        <View style={[styles.resultBox, { borderColor: `${burnResult.color}50` }]}>
          <View style={styles.resultHeader}>
            <MaterialCommunityIcons
              name={selectedFps === 0 ? 'shield-alert' : 'shield-check'}
              size={20}
              color={burnResult.color}
            />
            <Text style={[styles.resultStatus, { color: burnResult.color }]}>
              {burnResult.status}
            </Text>
          </View>
          <Text style={styles.resultMain}>{burnResult.text}</Text>
          <Text style={styles.resultSub}>
            {selectedFps === 0
              ? 'A radiação UV quebra o colágeno e provoca queimaduras dérmicas rápidas sem protetor.'
              : 'Reaplique a cada 2 horas ou após suor intenso ou mergulho.'}
          </Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Linha do Tempo Horária UV Interativa */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Curva Horária de Radiação Solar</Text>
        </View>
        <Text style={styles.timelineDesc}>
          Toque em uma hora para ver a intensidade estimada:
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourScroll}>
          {daytimeHours.map((h, i) => {
            const isSelected = selectedHourIndex === i;
            // estimate UV based on hour
            const hourNum = parseInt(h.hourLabel.replace('h', ''), 10) || 12;
            const distFromNoon = Math.abs(12 - hourNum);
            const estUv = Math.max(0, Math.round(current.uvIndex * (1 - distFromNoon * 0.16)));
            const col = getUvColor(estUv);

            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedHourIndex(i);
                }}
                style={[styles.hourCard, isSelected && { borderColor: col, backgroundColor: `${col}15` }]}
              >
                <Text style={styles.hourText}>{h.hourLabel}</Text>
                <View style={[styles.hourBarTrack]}>
                  <View
                    style={[
                      styles.hourBarFill,
                      {
                        height: `${Math.min(100, Math.max(15, (estUv / 12) * 100))}%`,
                        backgroundColor: col,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.hourUvText, { color: col }]}>{estUv}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* INTERACTIVE 3: Checklist de Proteção Interativa */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="check-decagram" size={18} color="#4ADE80" />
          <Text style={styles.sectionTitle}>Checklist do Sol (Toque para marcar)</Text>
        </View>

        {[
          { key: 'oculos', label: 'Óculos com proteção UV400', icon: 'sunglasses' },
          { key: 'protetor', label: 'Protetor solar aplicado no rosto e braços', icon: 'bottle-tonic' },
          { key: 'chapeu', label: 'Chapéu ou boné para proteção do couro cabeludo', icon: 'account-tie-hat' },
          { key: 'sombra', label: 'Ficar na sombra entre 10h e 16h', icon: 'umbrella' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.7}
            onPress={() => toggleCheck(item.key)}
            style={styles.checkRow}
          >
            <MaterialCommunityIcons
              name={checklist[item.key] ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={22}
              color={checklist[item.key] ? '#4ADE80' : 'rgba(255,255,255,0.4)'}
            />
            <MaterialCommunityIcons name={item.icon as any} size={18} color="#93C5FD" style={{ marginHorizontal: 6 }} />
            <Text
              style={[
                styles.checkText,
                checklist[item.key] && styles.checkTextChecked,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroCategory: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
  },
  heroVal: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    letterSpacing: -1,
  },
  uvBadgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gaugeScaleText: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  heroAdvice: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
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
  subLabel: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectPillActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.25)',
    borderColor: '#60A5FA',
  },
  selectPillText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectPillTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  resultBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  resultMain: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  resultSub: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 15,
  },
  timelineDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 8,
  },
  hourScroll: {
    flexDirection: 'row',
  },
  hourCard: {
    width: 52,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  hourText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
  },
  hourBarTrack: {
    width: 6,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  hourBarFill: {
    width: '100%',
    borderRadius: 3,
  },
  hourUvText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  checkText: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  checkTextChecked: {
    color: '#FFFFFF',
  },
});
