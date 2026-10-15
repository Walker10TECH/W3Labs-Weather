import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatPressure } from '../../services/weatherUtils';

interface PressureDetailViewProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
}

interface PressureScenario {
  hpa: number;
  label: string;
  weather: string;
  airMovement: string;
  health: string;
  color: string;
  icon: string;
}

const SCENARIOS: PressureScenario[] = [
  {
    hpa: 990,
    label: 'Muito Baixa',
    weather: 'Tempestade Severa / Vendaval',
    airMovement: 'Ar quente e úmido sobe rapidamente gerando nuvens cumulonimbus densas.',
    health: 'Alta chance de crises de enxaqueca e sensação de pressão nos seios nasais.',
    color: '#EF4444',
    icon: 'weather-lightning',
  },
  {
    hpa: 1005,
    label: 'Baixa Pressão',
    weather: 'Instabilidade & Chuvas',
    airMovement: 'Convergência de ventos para o centro; aumento de nebulosidade.',
    health: 'Leve desconforto em pessoas com sensibilidade barométrica articular.',
    color: '#FB923C',
    icon: 'weather-rainy',
  },
  {
    hpa: 1013,
    label: 'Normal (Nível do Mar)',
    weather: 'Tempo Neutro / Agradável',
    airMovement: 'Equilíbrio hidrostático padrão da atmosfera terrestre.',
    health: 'Pressão fisiológica estável em pulmões e circulação sanguínea.',
    color: '#34D399',
    icon: 'weather-partly-cloudy',
  },
  {
    hpa: 1025,
    label: 'Alta Pressão',
    weather: 'Tempo Firme & Ensolarado',
    airMovement: 'O ar frio e denso desce (subsidência), dispersando nuvens e trazendo céu azul.',
    health: 'Dias claros, porém poeira e poluentes podem ficar retidos perto do solo.',
    color: '#60A5FA',
    icon: 'white-balance-sunny',
  },
];

export const PressureDetailView: React.FC<PressureDetailViewProps> = ({ current, unit }) => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(2);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const trendText =
    current.pressureTrend === 'rising'
      ? 'Subindo (Tempo melhorando)'
      : current.pressureTrend === 'falling'
      ? 'Caindo (Instabilidade se aproximando)'
      : 'Estável (Sem mudanças bruscas)';

  const scenario = SCENARIOS[selectedScenarioIdx];

  return (
    <View style={styles.container}>
      {/* Hero Card with Barometer Gauge */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Pressão Barométrica</Text>
            <Text style={styles.heroVal}>{formatPressure(current.pressureHpa, unit)}</Text>
            <View style={styles.trendPill}>
              <MaterialCommunityIcons
                name={
                  current.pressureTrend === 'rising'
                    ? 'trending-up'
                    : current.pressureTrend === 'falling'
                    ? 'trending-down'
                    : 'trending-neutral'
                }
                size={14}
                color={
                  current.pressureTrend === 'rising'
                    ? '#4ADE80'
                    : current.pressureTrend === 'falling'
                    ? '#F87171'
                    : '#93C5FD'
                }
              />
              <Text style={styles.trendPillText}>{trendText}</Text>
            </View>
          </View>
          <View style={styles.baroCircle}>
            <MaterialCommunityIcons name="gauge" size={38} color="#93C5FD" />
          </View>
        </View>

        <Text style={styles.heroAdvice}>
          A pressão atmosférica reflete o peso da coluna de ar sobre a superfície. Variações rápidas anunciam frentes frias ou tempestades.
        </Text>
      </View>

      {/* INTERACTIVE 1: Simulador Barométrico de Mudança de Tempo */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cloud-sync" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Simulador Barométrico (Toque nos Cenários)</Text>
        </View>
        <Text style={styles.sectionSub}>Veja como a pressão atmosférica dita as mudanças climáticas:</Text>

        <View style={styles.scenariosRow}>
          {SCENARIOS.map((sc, idx) => {
            const isSel = selectedScenarioIdx === idx;
            return (
              <TouchableOpacity
                key={sc.hpa}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedScenarioIdx(idx);
                }}
                style={[styles.scenarioBtn, isSel && { borderColor: sc.color, backgroundColor: `${sc.color}20` }]}
              >
                <MaterialCommunityIcons name={sc.icon as any} size={18} color={isSel ? sc.color : '#FFFFFF'} />
                <Text style={[styles.scHpaText, isSel && { color: sc.color, fontFamily: Fonts.bold }]}>
                  {sc.hpa} hPa
                </Text>
                <Text style={styles.scLabelText} numberOfLines={1}>{sc.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic Scenario Explanation */}
        <View style={[styles.scResultBox, { borderColor: `${scenario.color}40` }]}>
          <View style={styles.scResultHeader}>
            <Text style={[styles.scResultTitle, { color: scenario.color }]}>
              {scenario.weather}
            </Text>
            <View style={[styles.scBadge, { backgroundColor: `${scenario.color}25` }]}>
              <Text style={[styles.scBadgeText, { color: scenario.color }]}>{scenario.hpa} hPa</Text>
            </View>
          </View>

          <Text style={styles.scMovementText}>
            <Text style={styles.boldLabel}>Dinâmica do Ar: </Text>
            {scenario.airMovement}
          </Text>

          <Text style={styles.scHealthText}>
            <Text style={styles.boldLabel}>Saúde Humana: </Text>
            {scenario.health}
          </Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Correlação com Altitude */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="elevation-rise" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Altitude & Pressão</Text>
        </View>

        <View style={styles.altBox}>
          <Text style={styles.altText}>
            A cada <Text style={styles.boldAlt}>8,5 metros de subida</Text>, a pressão atmosférica cai aproximadamente 1 hPa. Cidades serranas e montanhosas (como Campos do Jordão a 1.600m) operam naturalmente com pressões ao redor de 840 hPa sem que signifique tempestade!
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
    borderColor: 'rgba(147, 197, 253, 0.3)',
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
    fontSize: 42,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 4,
  },
  trendPillText: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  baroCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(147, 197, 253, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
  scenariosRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  scenarioBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  scHpaText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 3,
  },
  scLabelText: {
    fontSize: 8.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    textAlign: 'center',
  },
  scResultBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  scResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scResultTitle: {
    fontSize: 12.5,
    fontFamily: Fonts.bold,
  },
  scBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scBadgeText: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
  },
  scMovementText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginBottom: 6,
  },
  scHealthText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  boldLabel: {
    fontFamily: Fonts.bold,
    color: '#93C5FD',
  },
  altBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  altText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
  },
  boldAlt: {
    fontFamily: Fonts.bold,
    color: '#FBBF24',
  },
});
