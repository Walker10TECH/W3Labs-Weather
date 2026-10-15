import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatVisibility } from '../../services/weatherUtils';

interface VisibilityDetailViewProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
}

export const VisibilityDetailView: React.FC<VisibilityDetailViewProps> = ({ current, unit }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<number>(2);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const visKm = current.visibilityKm;

  const getVisibilityStatus = (km: number) => {
    if (km < 1) return { label: 'Nevoeiro Denso', color: '#EF4444', advice: 'Perigo extremo para tráfego em rodovias e operações aéreas.' };
    if (km < 4) return { label: 'Neblina / Névoa Úmida', color: '#F97316', advice: 'Visão reduzida; reduza velocidade e use farol baixo.' };
    if (km < 10) return { label: 'Visibilidade Moderada', color: '#FBBF24', advice: 'Céu levemente fosco por umidade ou poeira em suspensão.' };
    if (km <= 20) return { label: 'Boa Visibilidade', color: '#4ADE80', advice: 'Condições excelentes e seguras para direção e aviação visual.' };
    return { label: 'Límpida / Excepcional', color: '#38BDF8', advice: 'Ar extremamente transparente; vislumbre de montanhas distantes.' };
  };

  const status = getVisibilityStatus(visKm);

  // Benchmarks list
  const benchmarks = [
    { distance: 0.5, name: 'Prédios Vizinhos', icon: 'office-building', note: 'Curta distância urbana' },
    { distance: 3.0, name: 'Pista de Aeroporto', icon: 'airplane', note: 'Aproximação de voo' },
    { distance: 10.0, name: 'Montanhas no Horizonte', icon: 'image-filter-hdr', note: 'Linha de relevo natural' },
    { distance: 25.0, name: 'Linha do Horizonte Pleno', icon: 'telescope', note: 'Alcance geodésico máximo' },
  ];

  const currentBenchmark = benchmarks[selectedBenchmark];
  const isVisible = visKm >= currentBenchmark.distance;

  return (
    <View style={styles.container}>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Visibilidade Atual</Text>
            <Text style={styles.heroVal}>{formatVisibility(current.visibilityKm, unit)}</Text>
            <View style={[styles.statusPill, { backgroundColor: `${status.color}25` }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="eye-outline" size={36} color="#60A5FA" />
          </View>
        </View>

        <Text style={styles.heroAdvice}>{status.advice}</Text>
      </View>

      {/* INTERACTIVE 1: Simulador de Marcos Visíveis */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="binoculars" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Simulador de Alcance Visual (Toque nos Marcos)</Text>
        </View>
        <Text style={styles.sectionSub}>Descubra o que é visível a olho nu na atmosfera atual:</Text>

        <View style={styles.benchmarkGrid}>
          {benchmarks.map((b, idx) => {
            const isSel = selectedBenchmark === idx;
            const canSee = visKm >= b.distance;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedBenchmark(idx);
                }}
                style={[styles.benchmarkBtn, isSel && styles.benchmarkBtnActive]}
              >
                <MaterialCommunityIcons
                  name={b.icon as any}
                  size={20}
                  color={canSee ? '#4ADE80' : '#F87171'}
                />
                <Text style={styles.benchmarkDist}>{b.distance} km</Text>
                <Text style={styles.benchmarkName} numberOfLines={1}>{b.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.benchmarkResultBox, { borderColor: isVisible ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)' }]}>
          <View style={styles.resultHead}>
            <MaterialCommunityIcons
              name={isVisible ? 'check-circle' : 'close-circle'}
              size={18}
              color={isVisible ? '#4ADE80' : '#F87171'}
            />
            <Text style={[styles.resultTitle, { color: isVisible ? '#4ADE80' : '#F87171' }]}>
              {isVisible ? 'Nitidamente Visível' : 'Oculto por Neblina / Bruma'}
            </Text>
          </View>
          <Text style={styles.resultDesc}>
            O ponto &ldquo;{currentBenchmark.name}&rdquo; ({currentBenchmark.distance} km) está{' '}
            {isVisible ? 'perfeitamente distinguível' : 'obscurecido pela densidade de partículas e umidade do ar'}.
          </Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Segurança no Trânsito & Rodovias */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="car" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Direção Segura em Rodovias</Text>
        </View>

        <View style={styles.driveTips}>
          <View style={styles.driveTipRow}>
            <MaterialCommunityIcons name="car-light-dimmed" size={20} color="#FBBF24" />
            <View style={{ flex: 1 }}>
              <Text style={styles.driveTipTitle}>Uso Correto de Faróis</Text>
              <Text style={styles.driveTipDesc}>
                {visKm < 4
                  ? 'Use SEMPRE farol baixo ou de neblina. O farol alto reflete nas gotículas e cega a própria visão.'
                  : 'Farol baixo diurno recomendado para maior percepção por outros veículos.'}
              </Text>
            </View>
          </View>

          <View style={styles.driveTipRow}>
            <MaterialCommunityIcons name="speedometer" size={20} color="#60A5FA" />
            <View style={{ flex: 1 }}>
              <Text style={styles.driveTipTitle}>Distância de Frenagem</Text>
              <Text style={styles.driveTipDesc}>
                {visKm < 4
                  ? 'Dobre a distância para o veículo da frente (regra dos 4 segundos).'
                  : 'Distância de segurança padrão de 2 segundos.'}
              </Text>
            </View>
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
    fontSize: 42,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
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
  benchmarkGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  benchmarkBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  benchmarkBtnActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.22)',
    borderColor: '#60A5FA',
  },
  benchmarkDist: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 4,
  },
  benchmarkName: {
    fontSize: 8.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
    textAlign: 'center',
  },
  benchmarkResultBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  resultDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  driveTips: {
    gap: 10,
  },
  driveTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: 10,
  },
  driveTipTitle: {
    fontSize: 11.5,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  driveTipDesc: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 14,
  },
});
