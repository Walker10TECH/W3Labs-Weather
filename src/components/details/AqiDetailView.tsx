import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CurrentWeather } from '../../types/weather';
import { Fonts } from '../../theme/fonts';

interface AqiDetailViewProps {
  current: CurrentWeather;
}

type GroupProfile = 'geral' | 'criancas_idosos' | 'respiratorio' | 'atletas';

export const AqiDetailView: React.FC<AqiDetailViewProps> = ({ current }) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupProfile>('geral');
  const [expandedPollutant, setExpandedPollutant] = useState<string | null>('pm25');

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // fallback
    }
  };

  const aqiVal = current.aqi;
  const aqiColor = current.aqiColor || '#34D399';

  const groupAdvice: Record<GroupProfile, { title: string; advice: string; status: string; color: string }> = {
    geral: {
      title: 'População Geral',
      advice:
        aqiVal <= 50
          ? 'Qualidade do ar limpa e ideal. Nenhuma restrição para trabalho ou lazer externo.'
          : aqiVal <= 100
          ? 'Ar aceitável. Maioria das pessoas pode realizar todas as atividades normais.'
          : 'Considere limitar esforços muito prolongados sob sol direto.',
      status: aqiVal <= 50 ? 'Livre' : 'Atenção Leve',
      color: aqiVal <= 50 ? '#4ADE80' : '#FBBF24',
    },
    criancas_idosos: {
      title: 'Crianças e Idosos',
      advice:
        aqiVal <= 50
          ? 'Excelente para passeios em parques e brincadeiras ao ar livre.'
          : aqiVal <= 100
          ? 'Aproveite o dia, mas mantenha boa hidratação contínua.'
          : 'Evite permanência prolongada em avenidas de tráfego pesado e prefira ambientes ventilados.',
      status: aqiVal <= 50 ? 'Ideal' : 'Cuidados Básicos',
      color: aqiVal <= 50 ? '#4ADE80' : '#FB923C',
    },
    respiratorio: {
      title: 'Asma, Rinite e Alergias',
      advice:
        aqiVal <= 50
          ? 'Baixo risco de irritação nasal ou crises broncoespasmódicas.'
          : aqiVal <= 100
          ? 'Pessoas hipersensíveis podem sentir leve coceira ocular ou pigarro na garganta.'
          : 'Mantenha medicação de alívio por perto; utilize soro fisiológico para lavagem nasal.',
      status: aqiVal <= 50 ? 'Baixo Risco' : 'Alerta Moderado',
      color: aqiVal <= 50 ? '#4ADE80' : '#F87171',
    },
    atletas: {
      title: 'Atletas e Treinos Externos',
      advice:
        aqiVal <= 50
          ? 'Condições perfeitas para corridas de longa distância, ciclismo e cross training.'
          : aqiVal <= 100
          ? 'Treinos de alta intensidade recomendados no início da manhã ou fim de tarde.'
          : 'Reduza a intensidade de treinos cardiorrespiratórios extenuantes ao ar livre.',
      status: aqiVal <= 50 ? 'Treino Livre' : 'Treino Moderado',
      color: aqiVal <= 50 ? '#4ADE80' : '#FBBF24',
    },
  };

  const pollutants = [
    {
      id: 'pm25',
      name: 'PM2.5 (Partículas Finas)',
      val: `${current.pm25} µg/m³`,
      limit: '15 µg/m³ (Meta OMS)',
      status: current.pm25 <= 15 ? 'Dentro do Limite' : 'Moderado',
      color: current.pm25 <= 15 ? '#4ADE80' : '#FBBF24',
      origin: 'Proveniente de queima de combustíveis veiculares, indústrias e queimadas. Penetra fundo nos alvéolos pulmonares.',
    },
    {
      id: 'pm10',
      name: 'PM10 (Poeira Inalável)',
      val: `${Math.round(current.pm25 * 1.8)} µg/m³`,
      limit: '45 µg/m³ (Meta OMS)',
      status: 'Normal',
      color: '#4ADE80',
      origin: 'Poeira de vias não pavimentadas, obras civis e desgaste de pneus e freios.',
    },
    {
      id: 'o3',
      name: 'O3 (Ozônio Troposférico)',
      val: '38 µg/m³',
      limit: '100 µg/m³ (Meta OMS)',
      status: 'Bom',
      color: '#4ADE80',
      origin: 'Formado pela reação da luz solar com óxidos de nitrogênio emitidos por escapamentos.',
    },
    {
      id: 'no2',
      name: 'NO2 (Dióxido de Nitrogênio)',
      val: '18 µg/m³',
      limit: '25 µg/m³ (Meta OMS)',
      status: 'Seguro',
      color: '#4ADE80',
      origin: 'Gás resultante da queima em motores a diesel e usinas térmicas.',
    },
  ];

  const currentAdv = groupAdvice[selectedGroup];

  return (
    <View style={styles.container}>
      {/* Hero Card */}
      <View style={[styles.heroCard, { borderColor: `${aqiColor}50` }]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroSub}>Índice de Qualidade do Ar</Text>
            <Text style={[styles.heroVal, { color: aqiColor }]}>{current.aqi}</Text>
            <View style={[styles.statusPill, { backgroundColor: `${aqiColor}25` }]}>
              <Text style={[styles.statusPillText, { color: aqiColor }]}>{current.aqiCategory}</Text>
            </View>
          </View>
          <View style={[styles.aqiCircle, { backgroundColor: `${aqiColor}20` }]}>
            <MaterialCommunityIcons name="air-filter" size={34} color={aqiColor} />
          </View>
        </View>

        <Text style={styles.heroAdvice}>{current.aqiAdvice}</Text>
      </View>

      {/* INTERACTIVE 1: Seletor de Perfil de Saúde */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="account-group" size={18} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Recomendações por Perfil (Toque para ver)</Text>
        </View>

        <View style={styles.groupsRow}>
          {[
            { key: 'geral' as GroupProfile, label: 'Geral', icon: 'account' },
            { key: 'criancas_idosos' as GroupProfile, label: 'Crianças/Idosos', icon: 'human-child' },
            { key: 'respiratorio' as GroupProfile, label: 'Asma/Alergias', icon: 'lungs' },
            { key: 'atletas' as GroupProfile, label: 'Atletas', icon: 'run' },
          ].map((item) => {
            const isSel = selectedGroup === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setSelectedGroup(item.key);
                }}
                style={[styles.groupBtn, isSel && styles.groupBtnActive]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={16}
                  color={isSel ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                />
                <Text style={[styles.groupBtnText, isSel && styles.groupBtnTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic Advice Box */}
        <View style={[styles.adviceBox, { borderColor: `${currentAdv.color}40` }]}>
          <View style={styles.adviceBoxHeader}>
            <Text style={[styles.adviceBoxTitle, { color: currentAdv.color }]}>
              {currentAdv.title}
            </Text>
            <View style={[styles.adviceStatusPill, { backgroundColor: `${currentAdv.color}20` }]}>
              <Text style={[styles.adviceStatusText, { color: currentAdv.color }]}>
                {currentAdv.status}
              </Text>
            </View>
          </View>
          <Text style={styles.adviceBoxText}>{currentAdv.advice}</Text>
        </View>
      </View>

      {/* INTERACTIVE 2: Breakdown Interativo de Poluentes */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-box-outline" size={18} color="#FBBF24" />
          <Text style={styles.sectionTitle}>Composição de Poluentes (Toque para detalhes)</Text>
        </View>

        <View style={styles.pollutantsList}>
          {pollutants.map((pol) => {
            const isExp = expandedPollutant === pol.id;
            return (
              <TouchableOpacity
                key={pol.id}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setExpandedPollutant(isExp ? null : pol.id);
                }}
                style={[styles.polCard, isExp && styles.polCardActive]}
              >
                <View style={styles.polRow}>
                  <View style={styles.polInfoCol}>
                    <Text style={styles.polName}>{pol.name}</Text>
                    <Text style={styles.polLimit}>{pol.limit}</Text>
                  </View>
                  <View style={styles.polValCol}>
                    <Text style={[styles.polVal, { color: pol.color }]}>{pol.val}</Text>
                    <MaterialCommunityIcons
                      name={isExp ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="rgba(255,255,255,0.4)"
                    />
                  </View>
                </View>

                {isExp && (
                  <View style={styles.polExpanded}>
                    <Text style={styles.polOriginText}>
                      <Text style={styles.boldOrigin}>Origem & Efeitos: </Text>
                      {pol.origin}
                    </Text>
                  </View>
                )}
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
    letterSpacing: -1,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },
  aqiCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  groupsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  groupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  groupBtnActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.25)',
    borderColor: '#60A5FA',
  },
  groupBtnText: {
    fontSize: 9.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  groupBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
  },
  adviceBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  adviceBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  adviceBoxTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  adviceStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adviceStatusText: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
  },
  adviceBoxText: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    lineHeight: 16,
  },
  pollutantsList: {
    gap: 8,
  },
  polCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  polCardActive: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  polRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  polInfoCol: {
    flex: 1,
  },
  polName: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  polLimit: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  polValCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  polVal: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  polExpanded: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  polOriginText: {
    fontSize: 10.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 15,
  },
  boldOrigin: {
    fontFamily: Fonts.bold,
    color: '#93C5FD',
  },
});
