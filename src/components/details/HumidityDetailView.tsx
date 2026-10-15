import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatTemp } from '../../services/weatherUtils';

interface HumidityDetailViewProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
}

export const HumidityDetailView: React.FC<HumidityDetailViewProps> = ({ current, unit }) => {
  const [selectedDewLevel, setSelectedDewLevel] = useState<number>(2);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const getHumidityZone = (rh: number) => {
    if (rh < 30) return { label: 'Ar Muito Seco (Alerta)', color: '#F87171', advice: 'Beba muita água, use hidratante e umidificador de ambiente.' };
    if (rh < 40) return { label: 'Ar Seco (Atenção)', color: '#FBBF24', advice: 'Hidrate as vias aéreas com soro fisiológico.' };
    if (rh <= 60) return { label: 'Faixa Ideal de Conforto', color: '#4ADE80', advice: 'Nível ótimo para a saúde pulmonar e conforto dérmico da OMS.' };
    if (rh <= 80) return { label: 'Úmido', color: '#60A5FA', advice: 'Suor demora a evaporar; sensação de pele pegajosa.' };
    return { label: 'Muito Úmido / Saturado', color: '#A78BFA', advice: 'Ar quase saturado; alta chance de orvalho, neblina ou chuvisco.' };
  };

  const zone = getHumidityZone(current.humidity);

  // Dew point comfort tiers
  const dewTiers = [
    { label: '< 10°C', title: 'Seco e Refrescante', desc: 'Ar muito agradável e leve, sem pegajosidade.', color: '#60A5FA' },
    { label: '10–15°C', title: 'Conforto Pleno', desc: 'Ideal para qualquer atividade humana ou sono reparador.', color: '#4ADE80' },
    { label: '16–19°C', title: 'Confortável / Ameno', desc: 'Perceptível apenas em exercícios mais intensos.', color: '#FBBF24' },
    { label: '20–23°C', title: 'Abafado e Pegajoso', desc: 'Sensação incômoda; o ar parece pesado e quente.', color: '#F97316' },
    { label: '> 24°C', title: 'Opressivo e Sufocante', desc: 'Condições tropicais extremas; alta fadiga física.', color: '#EF4444' },
  ];

  const curDew = dewTiers[selectedDewLevel];

  // Drying clothes estimation
  const estimateDryingTime = () => {
    if (current.humidity > 80) return { time: '8h a 12h (Lenta)', note: 'Ar muito saturado. Deixe em local com corrente de vento.' };
    if (current.humidity > 60) return { time: '4h a 6h (Moderada)', note: 'Secagem regular com boa circulação de ar.' };
    return { time: '2h a 3h (Rápida)', note: 'Ar seco favorece evaporação acelerada da água das fibras.' };
  };

  const drying = estimateDryingTime();

  return (
    <View style={styles.container}>
      {/* Hero Humidity Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Umidade Relativa do Ar</Text>
            <Text style={styles.heroVal}>{current.humidity}%</Text>
            <View style={[styles.zonePill, { backgroundColor: `${zone.color}25` }]}>
              <Text style={[styles.zoneText, { color: zone.color }]}>{zone.label}</Text>
            </View>
          </View>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="water-percent" size={36} color="#60A5FA" />
          </View>
        </View>

        {/* Visual Bar with Comfort Zone Bracket */}
        <View style={styles.gaugeTrack}>
          <View
            style={[
              styles.gaugeFill,
              { width: `${current.humidity}%`, backgroundColor: zone.color },
            ]}
          />
        </View>
        <View style={styles.scaleRow}>
          <Text style={styles.scaleTxt}>0%</Text>
          <Text style={[styles.scaleTxt, { color: '#4ADE80', fontFamily: Fonts.bold }]}>Ideal 40–60%</Text>
          <Text style={styles.scaleTxt}>100%</Text>
        </View>

        {/* Dew point highlight */}
        <View style={styles.dewPointBox}>
          <MaterialCommunityIcons name="water-outline" size={18} color="#93C5FD" />
          <View style={{ flex: 1 }}>
            <Text style={styles.dewLabel}>Ponto de Orvalho Atual</Text>
            <Text style={styles.dewVal}>{formatTemp(current.dewPointC, unit)}</Text>
          </View>
        </View>

        <Text style={styles.heroAdvice}>{zone.advice}</Text>
      </View>

      {/* INTERACTIVE 1: Escala do Ponto de Orvalho */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="thermometer-water" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Escala do Ponto de Orvalho (Toque nos Níveis)</Text>
        </View>
        <Text style={styles.sectionSub}>O ponto de orvalho mede a sensação real de abafamento:</Text>

        <View style={styles.tiersRow}>
          {dewTiers.map((t, idx) => {
            const isSel = selectedDewLevel === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedDewLevel(idx);
                }}
                style={[styles.tierBtn, isSel && { borderColor: t.color, backgroundColor: `${t.color}20` }]}
              >
                <Text style={[styles.tierBtnText, isSel && { color: t.color, fontFamily: Fonts.bold }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.tierDetailCard, { borderColor: `${curDew.color}40` }]}>
          <Text style={[styles.tierTitle, { color: curDew.color }]}>{curDew.title}</Text>
          <Text style={styles.tierDesc}>{curDew.desc}</Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Práticas Domésticas & Secagem */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="tshirt-crew-outline" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Secagem de Roupas & Ambiente Interno</Text>
        </View>

        <View style={styles.indoorRow}>
          <View style={styles.indoorCard}>
            <MaterialCommunityIcons name="weather-windy" size={20} color="#FBBF24" />
            <Text style={styles.indoorLabel}>Tempo no Varal</Text>
            <Text style={styles.indoorVal}>{drying.time}</Text>
            <Text style={styles.indoorSub}>{drying.note}</Text>
          </View>

          <View style={styles.indoorCard}>
            <MaterialCommunityIcons name="home-thermometer-outline" size={20} color="#4ADE80" />
            <Text style={styles.indoorLabel}>Mofo e Ácaros</Text>
            <Text style={styles.indoorVal}>
              {current.humidity > 70 ? 'Risco Alto' : 'Risco Baixo'}
            </Text>
            <Text style={styles.indoorSub}>
              {current.humidity > 70
                ? 'Abra portas de armários e use desumidificador.'
                : 'Condições desfavoráveis para proliferação de fungos.'}
            </Text>
          </View>
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
  zonePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  zoneText: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginVertical: 6,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scaleTxt: {
    fontSize: 9.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  dewPointBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 8,
  },
  dewLabel: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  dewVal: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
  },
  heroAdvice: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
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
  tiersRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 8,
  },
  tierBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tierBtnText: {
    fontSize: 9.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tierDetailCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  tierTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    marginBottom: 3,
  },
  tierDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  indoorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  indoorCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  indoorLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  indoorVal: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 2,
    marginBottom: 3,
  },
  indoorSub: {
    fontSize: 9.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 14,
  },
});
