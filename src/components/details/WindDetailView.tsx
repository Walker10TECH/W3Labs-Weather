import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';
import { formatWind } from '../../services/weatherUtils';

interface WindDetailViewProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
}

interface BeaufortLevel {
  level: number;
  name: string;
  speedRange: string;
  desc: string;
  effects: string;
  icon: string;
  color: string;
}

const BEAUFORT_LEVELS: BeaufortLevel[] = [
  {
    level: 0,
    name: 'Calmaria',
    speedRange: '< 2 km/h',
    desc: 'Fumaça sobe na vertical sem desvio.',
    effects: 'Folhas imóveis. Superfície da água espelhada.',
    icon: 'weather-windy-variant',
    color: '#60A5FA',
  },
  {
    level: 2,
    name: 'Brisa Leve',
    speedRange: '6–11 km/h',
    desc: 'O vento é sentido no rosto; folhas farfalham suavemente.',
    effects: 'Cata-ventos comuns começam a girar. Ideal para esportes ao ar livre.',
    icon: 'weather-windy',
    color: '#34D399',
  },
  {
    level: 4,
    name: 'Brisa Moderada',
    speedRange: '20–28 km/h',
    desc: 'Poeira e folhas soltas se levantam do chão.',
    effects: 'Ramos pequenos balançam. Voo de drones recreativos exige atenção.',
    icon: 'weather-windy',
    color: '#FBBF24',
  },
  {
    level: 6,
    name: 'Vento Forte',
    speedRange: '39–49 km/h',
    desc: 'Grandes galhos se agitam; fios de postes assobiam.',
    effects: 'Uso de guarda-chuva se torna muito difícil. Drones não devem voar.',
    icon: 'weather-tornado',
    color: '#FB923C',
  },
  {
    level: 8,
    name: 'Ventania / Temporal',
    speedRange: '62–74 km/h',
    desc: 'Quebra galhos grandes de árvores; caminhar contra o vento é quase impossível.',
    effects: 'Risco de queda de árvores velhas e telhas soltas. Alerta rodoviário.',
    icon: 'weather-lightning',
    color: '#F87171',
  },
  {
    level: 10,
    name: 'Vendaval Violento',
    speedRange: '> 89 km/h',
    desc: 'Danos estruturais severos em casas e fiação elétrica.',
    effects: 'Árvores arrancadas pela raiz. Risco extremo à integridade física.',
    icon: 'weather-hurricane',
    color: '#A855F7',
  },
];

export const WindDetailView: React.FC<WindDetailViewProps> = ({ current, unit }) => {
  const [selectedDirection, setSelectedDirection] = useState<string>(
    current.windDirectionCardinal || 'SE'
  );
  const [selectedBeaufort, setSelectedBeaufort] = useState<number>(2);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const beaufortItem = BEAUFORT_LEVELS[selectedBeaufort] || BEAUFORT_LEVELS[1];

  // Activities wind safety criteria
  const windKmh = current.windSpeedKmh;
  const gustKmh = current.windGustsKmh;

  const activities = [
    {
      name: 'Voo com Drone',
      status: windKmh < 30 && gustKmh < 40 ? 'Seguro' : 'Perigoso',
      color: windKmh < 30 ? '#4ADE80' : '#F87171',
      desc: windKmh < 30 ? 'Vento dentro do limite seguro de estabilidade.' : 'Risco de perda de controle ou fly-away.',
      icon: 'quadcopter',
    },
    {
      name: 'Ciclismo em Rodovia',
      status: windKmh < 35 ? 'Bom' : 'Atenção ao Vento Lateral',
      color: windKmh < 35 ? '#4ADE80' : '#FBBF24',
      desc: windKmh < 35 ? 'Arrasto moderado.' : 'Cuidado com rajadas de caminhões e vento cruzado.',
      icon: 'bicycle',
    },
    {
      name: 'Navegação / Esportes Náuticos',
      status: windKmh > 15 && windKmh < 45 ? 'Ideal para Velejar' : windKmh >= 45 ? 'Mar Agitado' : 'Mar Calmo',
      color: windKmh >= 45 ? '#F87171' : '#60A5FA',
      desc: `Velocidade média de ${formatWind(windKmh, unit)}.`,
      icon: 'sail-boat',
    },
    {
      name: 'Uso de Guarda-chuva e Tendas',
      status: gustKmh < 35 ? 'Estável' : 'Risco de Virar',
      color: gustKmh < 35 ? '#4ADE80' : '#FB923C',
      desc: gustKmh < 35 ? 'Tendas fixadas com segurança.' : 'Prenda ancoragens adicionais contra rajadas.',
      icon: 'umbrella-beach',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Hero Wind Card with Compass */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Velocidade Sustentada</Text>
            <Text style={styles.heroSpeed}>{formatWind(current.windSpeedKmh, unit)}</Text>
            <Text style={styles.heroGusts}>
              Rajadas máximas até <Text style={styles.boldGust}>{formatWind(current.windGustsKmh, unit)}</Text>
            </Text>
          </View>

          {/* Compass Visual Representation */}
          <View style={styles.compassCircle}>
            <View
              style={[
                styles.compassNeedle,
                { transform: [{ rotate: `${current.windDirectionDeg}deg` }] },
              ]}
            >
              <View style={styles.needlePointer} />
            </View>
            <Text style={styles.compassLabelN}>N</Text>
            <Text style={styles.compassLabelS}>S</Text>
            <Text style={styles.compassLabelW}>O</Text>
            <Text style={styles.compassLabelE}>L</Text>
            <View style={styles.compassCenter}>
              <Text style={styles.compassCenterText}>{current.windDirectionCardinal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.directionDetailRow}>
          <View style={styles.dirPill}>
            <MaterialCommunityIcons name="compass-rose" size={15} color="#93C5FD" />
            <Text style={styles.dirPillText}>
              Direção de Origem: {current.windDirectionDeg}° ({current.windDirectionCardinal})
            </Text>
          </View>
        </View>
      </View>

      {/* INTERACTIVE 1: Bússola & Rosa dos Ventos Interativa */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="compass" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Rosa dos Ventos Interativa (Toque nos Pontos)</Text>
        </View>

        <View style={styles.cardinalRow}>
          {['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'].map((card) => {
            const isSel = selectedDirection === card;
            return (
              <TouchableOpacity
                key={card}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedDirection(card);
                }}
                style={[styles.cardinalBtn, isSel && styles.cardinalBtnActive]}
              >
                <Text style={[styles.cardinalBtnText, isSel && styles.cardinalBtnTextActive]}>
                  {card}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.directionExplication}>
          <Text style={styles.dirExpTitle}>Quadrante Selecionado: {selectedDirection}</Text>
          <Text style={styles.dirExpText}>
            {selectedDirection === 'S' || selectedDirection === 'SE' || selectedDirection === 'SO'
              ? 'Ventos deste quadrante no hemisfério sul costumam transportar massas de ar polar mais frias e úmidas.'
              : selectedDirection === 'N' || selectedDirection === 'NE' || selectedDirection === 'NO'
              ? 'Ventos deste quadrante transportam ar tropical mais quente vindo do centro-norte do continente.'
              : 'Ventos de quadrante leste trazem umidade marítima da costa atlântica.'}
          </Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Simulador da Escala Beaufort */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="ruler" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Simulador da Escala Beaufort</Text>
        </View>
        <Text style={styles.sectionSub}>Toque no nível para ver o impacto visual e prático:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.beaufortScroll}>
          {BEAUFORT_LEVELS.map((b, idx) => {
            const isSel = selectedBeaufort === idx;
            return (
              <TouchableOpacity
                key={b.level}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedBeaufort(idx);
                }}
                style={[
                  styles.beaufortTab,
                  isSel && { borderColor: b.color, backgroundColor: `${b.color}18` },
                ]}
              >
                <MaterialCommunityIcons name={b.icon as any} size={18} color={isSel ? b.color : '#FFFFFF'} />
                <Text style={[styles.beaufortTabTitle, isSel && { color: b.color, fontFamily: Fonts.bold }]}>
                  {b.name}
                </Text>
                <Text style={styles.beaufortTabSpeed}>{b.speedRange}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[styles.beaufortBox, { borderColor: `${beaufortItem.color}40` }]}>
          <View style={styles.beaufortBoxHeader}>
            <Text style={[styles.beaufortBoxName, { color: beaufortItem.color }]}>
              Força {beaufortItem.level}: {beaufortItem.name}
            </Text>
            <View style={[styles.speedBadge, { backgroundColor: `${beaufortItem.color}25` }]}>
              <Text style={[styles.speedBadgeText, { color: beaufortItem.color }]}>
                {beaufortItem.speedRange}
              </Text>
            </View>
          </View>
          <Text style={styles.beaufortBoxDesc}>{beaufortItem.desc}</Text>
          <Text style={styles.beaufortBoxEffects}>
            <Text style={styles.boldEffects}>Impacto no ambiente: </Text>
            {beaufortItem.effects}
          </Text>
        </View>
      </View>

      {/* INTERACTIVE 3: Painel de Atividades ao Ar Livre */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-check-outline" size={18} color="#4ADE80" />
          <Text style={styles.sectionTitle}>Segurança para Atividades ao Ar Livre</Text>
        </View>

        {activities.map((act, i) => (
          <View key={i} style={styles.activityRow}>
            <View style={styles.actIconCol}>
              <MaterialCommunityIcons name={act.icon as any} size={20} color={act.color} />
            </View>
            <View style={styles.actContentCol}>
              <View style={styles.actTop}>
                <Text style={styles.actName}>{act.name}</Text>
                <View style={[styles.actStatusBadge, { backgroundColor: `${act.color}20` }]}>
                  <Text style={[styles.actStatusText, { color: act.color }]}>{act.status}</Text>
                </View>
              </View>
              <Text style={styles.actDesc}>{act.desc}</Text>
            </View>
          </View>
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
  heroSpeed: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroGusts: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  boldGust: {
    fontFamily: Fonts.bold,
    color: '#FBBF24',
  },
  compassCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassNeedle: {
    position: 'absolute',
    width: 4,
    height: 60,
    alignItems: 'center',
  },
  needlePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 26,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F87171',
  },
  compassLabelN: {
    position: 'absolute',
    top: 4,
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: '#F87171',
  },
  compassLabelS: {
    position: 'absolute',
    bottom: 4,
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  compassLabelW: {
    position: 'absolute',
    left: 4,
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  compassLabelE: {
    position: 'absolute',
    right: 4,
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  compassCenter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0A121D',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassCenterText: {
    fontSize: 8.5,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  directionDetailRow: {
    marginTop: 4,
  },
  dirPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dirPillText: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: '#93C5FD',
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
  sectionSub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 8,
  },
  cardinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 10,
  },
  cardinalBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardinalBtnActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.25)',
    borderColor: '#60A5FA',
  },
  cardinalBtnText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardinalBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  directionExplication: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 10,
    borderRadius: 10,
  },
  dirExpTitle: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
    marginBottom: 3,
  },
  dirExpText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  beaufortScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  beaufortTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minWidth: 90,
  },
  beaufortTabTitle: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginTop: 4,
  },
  beaufortTabSpeed: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  beaufortBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  beaufortBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  beaufortBoxName: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  speedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speedBadgeText: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
  },
  beaufortBoxDesc: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 16,
  },
  beaufortBoxEffects: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  boldEffects: {
    fontFamily: Fonts.bold,
    color: '#FBBF24',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  actIconCol: {
    width: 32,
    alignItems: 'center',
  },
  actContentCol: {
    flex: 1,
  },
  actTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  actName: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  actStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actStatusText: {
    fontSize: 9,
    fontFamily: Fonts.bold,
  },
  actDesc: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
