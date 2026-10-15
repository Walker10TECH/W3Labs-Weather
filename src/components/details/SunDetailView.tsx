import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, CityLocation } from '../../types/weather';
import { Fonts } from '../../theme/fonts';

interface SunDetailViewProps {
  current: CurrentWeather;
  location: CityLocation;
}

export const SunDetailView: React.FC<SunDetailViewProps> = ({ current, location }) => {
  const [selectedHour, setSelectedHour] = useState<number>(14);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  // Compute sunlight status for simulated hour
  const getSunSim = (hour: number) => {
    if (hour < 5 || hour > 19) {
      return {
        phase: 'Noite Estrelada',
        desc: 'Escuridão total, iluminação natural por estrelas e lua.',
        shadow: 'Sem sombras solares.',
        lightPct: 0,
        color: '#60A5FA',
        icon: 'weather-night',
      };
    }
    if (hour === 5 || hour === 6) {
      return {
        phase: 'Amanhecer & Hora Azul',
        desc: 'Primeira claridade no horizonte leste. Tons frios e azulados.',
        shadow: 'Sombras extremamente longas e difusas.',
        lightPct: 35,
        color: '#F97316',
        icon: 'weather-sunset-up',
      };
    }
    if (hour === 7 || hour === 8) {
      return {
        phase: 'Hora Dourada da Manhã',
        desc: 'Luz quente, macia e avermelhada. Perfeito para fotografia.',
        shadow: 'Sombras longas e suaves.',
        lightPct: 65,
        color: '#FBBF24',
        icon: 'weather-sunny',
      };
    }
    if (hour >= 11 && hour <= 13) {
      return {
        phase: 'Zênite Solar (Meio-Dia)',
        desc: 'Sol no ponto mais alto do céu. Radiação UV máxima.',
        shadow: 'Sombras mínimas e verticais sob os pés.',
        lightPct: 100,
        color: '#FDE047',
        icon: 'white-balance-sunny',
      };
    }
    if (hour === 17) {
      return {
        phase: 'Hora Dourada da Tarde',
        desc: 'Céu dourado e alaranjado no poente oeste. Clima ameno.',
        shadow: 'Sombras se alongando rapidamente.',
        lightPct: 60,
        color: '#FB923C',
        icon: 'weather-sunset',
      };
    }
    if (hour === 18) {
      return {
        phase: 'Pôr do Sol & Crepúsculo',
        desc: 'O disco solar cruza o horizonte oeste em tons violeta e rosa.',
        shadow: 'Sombras infinitas até o desaparecimento da luz direta.',
        lightPct: 25,
        color: '#EC4899',
        icon: 'weather-sunset-down',
      };
    }
    return {
      phase: 'Luz Plena do Dia',
      desc: 'Iluminação solar direta abundante e temperatura em ascensão.',
      shadow: 'Sombras diagonais nítidas.',
      lightPct: 85,
      color: '#FACC15',
      icon: 'weather-sunny',
    };
  };

  const sim = getSunSim(selectedHour);

  return (
    <View style={styles.container}>
      {/* Hero Solar Arc Display */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Pôr do Sol Previsto</Text>
            <Text style={styles.heroTime}>{current.sunsetTime}</Text>
            <Text style={styles.heroLocation}>{location.name}, {location.region}</Text>
          </View>
          <View style={styles.sunIconWrap}>
            <MaterialCommunityIcons name="weather-sunset" size={38} color="#FBBF24" />
          </View>
        </View>

        {/* Visual Arc Simulation */}
        <View style={styles.arcContainer}>
          <View style={styles.horizonLine} />
          {/* Arc Curve representation */}
          <View style={styles.arcCurve} />

          {/* Current Sun Position */}
          <View
            style={[
              styles.sunBall,
              {
                left: `${Math.min(92, Math.max(8, current.sunProgress * 100))}%`,
                bottom: Math.round(Math.sin(current.sunProgress * Math.PI) * 45 + 12),
              },
            ]}
          >
            <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#FDE047" />
          </View>

          <View style={styles.arcLabels}>
            <View style={styles.arcLabelCol}>
              <Text style={styles.arcTimeLabel}>{current.sunriseTime}</Text>
              <Text style={styles.arcDescLabel}>Nascer</Text>
            </View>
            <View style={styles.arcLabelColCenter}>
              <Text style={styles.arcTimeLabelCenter}>Meio-Dia Solar</Text>
              <Text style={styles.arcDescLabel}>Zênite</Text>
            </View>
            <View style={styles.arcLabelCol}>
              <Text style={styles.arcTimeLabel}>{current.sunsetTime}</Text>
              <Text style={styles.arcDescLabel}>Pôr do Sol</Text>
            </View>
          </View>
        </View>

        {/* Daylight summary cards */}
        <View style={styles.quickCardsRow}>
          <View style={styles.quickCard}>
            <MaterialCommunityIcons name="weather-sunset-up" size={16} color="#60A5FA" />
            <Text style={styles.quickCardLabel}>Nascer do Sol</Text>
            <Text style={styles.quickCardVal}>{current.sunriseTime}</Text>
          </View>

          <View style={styles.quickCard}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#4ADE80" />
            <Text style={styles.quickCardLabel}>Luz Restante</Text>
            <Text style={styles.quickCardVal}>{current.daylightRemaining}</Text>
          </View>
        </View>
      </View>

      {/* INTERACTIVE 1: Simulador do Ciclo Diário */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="sun-clock" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Simulador Interativo da Luz Natural</Text>
        </View>
        <Text style={styles.sectionSub}>Toque no horário para ver a posição do sol e sombras:</Text>

        {/* Hour buttons row */}
        <View style={styles.hoursRow}>
          {[5, 7, 10, 12, 15, 17, 18, 21].map((h) => {
            const isSel = selectedHour === h;
            return (
              <TouchableOpacity
                key={h}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedHour(h);
                }}
                style={[styles.hourPill, isSel && styles.hourPillActive]}
              >
                <Text style={[styles.hourPillText, isSel && styles.hourPillTextActive]}>
                  {h}:00
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Result of simulation */}
        <View style={[styles.simResultBox, { borderColor: `${sim.color}50` }]}>
          <View style={styles.simTop}>
            <MaterialCommunityIcons name={sim.icon as any} size={22} color={sim.color} />
            <View style={styles.simTitleGroup}>
              <Text style={[styles.simPhaseTitle, { color: sim.color }]}>{sim.phase}</Text>
              <Text style={styles.simHourBadge}>Às {selectedHour}:00</Text>
            </View>
          </View>

          <Text style={styles.simDesc}>{sim.desc}</Text>

          <View style={styles.simMetaRow}>
            <View style={styles.simMetaItem}>
              <MaterialCommunityIcons name="weather-sunny-alert" size={14} color="#FBBF24" />
              <Text style={styles.simMetaText}>Luz Natural: {sim.lightPct}%</Text>
            </View>
            <View style={styles.simMetaItem}>
              <MaterialCommunityIcons name="human-male" size={14} color="#93C5FD" />
              <Text style={styles.simMetaText}>{sim.shadow}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* INTERACTIVE 2: Horas Nobres para Fotografia e Estética */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="camera" size={18} color="#EC4899" />
          <Text style={styles.sectionTitle}>Guia de Fotografia & Luzes Nobres</Text>
        </View>

        <View style={styles.photoGrid}>
          <View style={styles.photoCard}>
            <View style={styles.photoHeader}>
              <MaterialCommunityIcons name="camera-iris" size={16} color="#FBBF24" />
              <Text style={styles.photoName}>Hora Dourada (Golden Hour)</Text>
            </View>
            <Text style={styles.photoTime}>06:15–07:15 • 17:00–18:00</Text>
            <Text style={styles.photoDesc}>
              Sombras longas, luz quente e difusa. Ideal para retratos, paisagens e pores do sol deslumbrantes sem contraste agressivo.
            </Text>
          </View>

          <View style={styles.photoCard}>
            <View style={styles.photoHeader}>
              <MaterialCommunityIcons name="camera-iris" size={16} color="#60A5FA" />
              <Text style={styles.photoName}>Hora Azul (Blue Hour)</Text>
            </View>
            <Text style={styles.photoTime}>18:15–18:45</Text>
            <Text style={styles.photoDesc}>
              Céu em azul elétrico e violeta. Equilíbrio perfeito entre as luzes da cidade e a claridade suave do céu noturno.
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
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
  },
  heroTime: {
    fontSize: 38,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroLocation: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  sunIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcContainer: {
    height: 100,
    position: 'relative',
    marginVertical: 10,
    justifyContent: 'flex-end',
  },
  horizonLine: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  arcCurve: {
    position: 'absolute',
    bottom: 24,
    left: 10,
    right: 10,
    height: 60,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'rgba(251, 191, 36, 0.35)',
    borderStyle: 'dashed',
  },
  sunBall: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(253, 224, 71, 0.3)',
    borderWidth: 1,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  arcLabelCol: {
    alignItems: 'center',
  },
  arcLabelColCenter: {
    alignItems: 'center',
  },
  arcTimeLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  arcTimeLabelCenter: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  arcDescLabel: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  quickCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickCardLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  quickCardVal: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 2,
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
    marginBottom: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  hourPill: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hourPillActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    borderColor: '#FBBF24',
  },
  hourPillText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  hourPillTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  simResultBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  simTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  simTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simPhaseTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  simHourBadge: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  simDesc: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    lineHeight: 16,
    marginBottom: 8,
  },
  simMetaRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  simMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  simMetaText: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  photoGrid: {
    gap: 8,
  },
  photoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  photoName: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  photoTime: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#FBBF24',
    marginBottom: 4,
  },
  photoDesc: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 15,
  },
});
