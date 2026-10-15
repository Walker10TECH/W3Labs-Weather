import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatTemp, formatWind } from '../../services/weatherUtils';

interface FeelsLikeDetailViewProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
}

export const FeelsLikeDetailView: React.FC<FeelsLikeDetailViewProps> = ({ current, unit }) => {
  // Interactive simulator state
  const [simTemp, setSimTemp] = useState<number>(Math.round(current.tempC));
  const [simHumidity, setSimHumidity] = useState<number>(current.humidity);
  const [simWind, setSimWind] = useState<number>(Math.round(current.windSpeedKmh));

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  // Heat Index & Wind Chill mathematical calculation
  const calculateSimulatedFeelsLike = (t: number, rh: number, w: number) => {
    if (t >= 27) {
      // Rothfusz Heat Index regression
      const tF = (t * 9) / 5 + 32;
      const hiF =
        -42.379 +
        2.04901523 * tF +
        10.14333127 * rh -
        0.22475541 * tF * rh -
        0.00683783 * tF * tF -
        0.05481717 * rh * rh +
        0.00122874 * tF * tF * rh +
        0.00085282 * tF * rh * rh -
        0.00000199 * tF * tF * rh * rh;
      const hiC = ((hiF - 32) * 5) / 9;
      return Math.round(hiC);
    }
    if (t <= 10 && w > 4.8) {
      // Wind Chill
      const wc =
        13.12 +
        0.6215 * t -
        11.37 * Math.pow(w, 0.16) +
        0.3965 * t * Math.pow(w, 0.16);
      return Math.round(wc);
    }
    // Moderate temperatures: slight humidity adjustment
    const vaporPressure = (rh / 100) * 6.105 * Math.exp((17.27 * t) / (237.7 + t));
    const fl = t + 0.33 * vaporPressure - 0.7 * (w / 3.6) - 4.0;
    return Math.round(fl);
  };

  const simResult = calculateSimulatedFeelsLike(simTemp, simHumidity, simWind);
  const deltaReal = current.feelsLikeC - current.tempC;

  const getThermalRisk = (flC: number) => {
    if (flC >= 40) return { label: 'Perigo Extremo', color: '#EF4444', advice: 'Risco iminente de insolação e exaustão térmica severa.' };
    if (flC >= 33) return { label: 'Cautela Alta', color: '#F97316', advice: 'Cãibras de calor e fadiga com atividade física sustentada.' };
    if (flC >= 27) return { label: 'Atenção Leve', color: '#FBBF24', advice: 'Possível fadiga em exposição direta prolongada ao sol.' };
    if (flC <= 5) return { label: 'Frio Rigoroso', color: '#60A5FA', advice: 'Risco de hipotermia sem agasalhos corta-vento adequados.' };
    return { label: 'Confortável', color: '#4ADE80', advice: 'Balanço térmico equilibrado com roupas leves ou normais.' };
  };

  const risk = getThermalRisk(current.feelsLikeC);
  const simRisk = getThermalRisk(simResult);

  return (
    <View style={styles.container}>
      {/* Hero Real vs Feels Like Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Sensação Térmica Real</Text>
            <Text style={styles.heroVal}>{formatTemp(current.feelsLikeC, unit)}</Text>
            <View style={[styles.deltaBadge, { backgroundColor: deltaReal >= 0 ? 'rgba(249, 115, 22, 0.18)' : 'rgba(96, 165, 250, 0.18)' }]}>
              <MaterialCommunityIcons
                name={deltaReal >= 0 ? 'arrow-top-right' : 'arrow-bottom-right'}
                size={14}
                color={deltaReal >= 0 ? '#FB923C' : '#60A5FA'}
              />
              <Text style={[styles.deltaText, { color: deltaReal >= 0 ? '#FB923C' : '#60A5FA' }]}>
                {Math.abs(Math.round(deltaReal))}° {deltaReal >= 0 ? 'mais quente' : 'mais frio'} que o termômetro
              </Text>
            </View>
          </View>

          <View style={[styles.riskCircle, { backgroundColor: `${risk.color}20` }]}>
            <MaterialCommunityIcons name="thermometer-alert" size={32} color={risk.color} />
          </View>
        </View>

        {/* Breakdown of real metrics */}
        <View style={styles.factorsRow}>
          <View style={styles.factorCard}>
            <Text style={styles.factorLabel}>Termômetro</Text>
            <Text style={styles.factorVal}>{formatTemp(current.tempC, unit)}</Text>
          </View>
          <View style={styles.factorCard}>
            <Text style={styles.factorLabel}>Umidade</Text>
            <Text style={styles.factorVal}>{current.humidity}%</Text>
          </View>
          <View style={styles.factorCard}>
            <Text style={styles.factorLabel}>Vento</Text>
            <Text style={styles.factorVal}>{formatWind(current.windSpeedKmh, unit)}</Text>
          </View>
        </View>

        <Text style={styles.heroAdvice}>{risk.advice}</Text>
      </View>

      {/* INTERACTIVE 1: Calculadora Interativa de Sensação Térmica */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calculator" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Simulador Interativo (Ajuste os Valores)</Text>
        </View>
        <Text style={styles.sectionSub}>Teste como o corpo reage mudando temperatura, umidade e vento:</Text>

        {/* Temp Stepper */}
        <View style={styles.stepperRow}>
          <View style={styles.stepperLabelCol}>
            <Text style={styles.stepperLabel}>Temperatura do Ar:</Text>
            <Text style={styles.stepperCurVal}>{simTemp}°C</Text>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSimTemp((prev) => Math.max(0, prev - 2));
              }}
              style={styles.stepBtn}
            >
              <MaterialCommunityIcons name="minus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSimTemp((prev) => Math.min(45, prev + 2));
              }}
              style={styles.stepBtn}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Humidity Stepper */}
        <View style={styles.stepperRow}>
          <View style={styles.stepperLabelCol}>
            <Text style={styles.stepperLabel}>Umidade do Ar:</Text>
            <Text style={styles.stepperCurVal}>{simHumidity}%</Text>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSimHumidity((prev) => Math.max(10, prev - 10));
              }}
              style={styles.stepBtn}
            >
              <MaterialCommunityIcons name="minus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSimHumidity((prev) => Math.min(100, prev + 10));
              }}
              style={styles.stepBtn}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Wind Stepper */}
        <View style={styles.stepperRow}>
          <View style={styles.stepperLabelCol}>
            <Text style={styles.stepperLabel}>Velocidade do Vento:</Text>
            <Text style={styles.stepperCurVal}>{simWind} km/h</Text>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSimWind((prev) => Math.max(0, prev - 5));
              }}
              style={styles.stepBtn}
            >
              <MaterialCommunityIcons name="minus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setSimWind((prev) => Math.min(80, prev + 5));
              }}
              style={styles.stepBtn}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Simulated Result Box */}
        <View style={[styles.simResultCard, { borderColor: `${simRisk.color}45` }]}>
          <View style={styles.simResultTop}>
            <Text style={styles.simResultLabel}>Sensação Térmica Resultante:</Text>
            <View style={[styles.simRiskPill, { backgroundColor: `${simRisk.color}20` }]}>
              <Text style={[styles.simRiskText, { color: simRisk.color }]}>{simRisk.label}</Text>
            </View>
          </View>
          <Text style={[styles.simBigVal, { color: simRisk.color }]}>{simResult}°C</Text>
          <Text style={styles.simExplanation}>
            {simHumidity > 70
              ? 'Alta umidade impede a evaporação do suor, acumulando calor dentro do corpo.'
              : simWind > 25
              ? 'Vento forte remove a camada de ar quente sobre a pele, acelerando o resfriamento.'
              : 'Condições moderadas com boa dissipação de calor.'}
          </Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Recomendações de Hidratação e Roupas */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cup-water" size={18} color="#38BDF8" />
          <Text style={styles.sectionTitle}>Meta de Hidratação & Vestimenta</Text>
        </View>

        <View style={styles.hydrationBox}>
          <View style={styles.hydRow}>
            <MaterialCommunityIcons name="water" size={24} color="#38BDF8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.hydTitle}>Meta Diária de Água Estimada</Text>
              <Text style={styles.hydVal}>
                {current.feelsLikeC >= 30 ? '3.0 a 3.5 Litros' : '2.0 a 2.5 Litros'}
              </Text>
            </View>
          </View>
          <Text style={styles.hydDesc}>
            {current.feelsLikeC >= 30
              ? 'Com sensação térmica elevada, o organismo perde até 1 litro de suor por hora de atividade. Reponha eletrólitos.'
              : 'Mantenha consumo regular ao longo do dia mesmo sem sentir sede pronunciada.'}
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
    borderColor: 'rgba(249, 115, 22, 0.3)',
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
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  deltaText: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
  },
  riskCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  factorCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  factorLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  factorVal: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroAdvice: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 17,
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
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  stepperLabelCol: {
    flex: 1,
  },
  stepperLabel: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stepperCurVal: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 1,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simResultCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  simResultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  simResultLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  simRiskPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  simRiskText: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
  },
  simBigVal: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    marginVertical: 2,
  },
  simExplanation: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 15,
  },
  hydrationBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  hydRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  hydTitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  hydVal: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#38BDF8',
  },
  hydDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
});
