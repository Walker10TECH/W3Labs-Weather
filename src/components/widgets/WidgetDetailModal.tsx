import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WidgetId, WeatherData, TemperatureUnit } from '../../types/weather';
import { Fonts } from '../../theme/fonts';

// Dedicated Interactive Detail Views
import { UvDetailView } from '../details/UvDetailView';
import { WindDetailView } from '../details/WindDetailView';
import { SunDetailView } from '../details/SunDetailView';
import { AqiDetailView } from '../details/AqiDetailView';
import { FeelsLikeDetailView } from '../details/FeelsLikeDetailView';
import { PrecipitationDetailView } from '../details/PrecipitationDetailView';
import { HumidityDetailView } from '../details/HumidityDetailView';
import { VisibilityDetailView } from '../details/VisibilityDetailView';
import { PressureDetailView } from '../details/PressureDetailView';
import { HourlyDetailView } from '../details/HourlyDetailView';
import { DailyDetailView } from '../details/DailyDetailView';

interface WidgetDetailModalProps {
  widgetId: WidgetId | null;
  weatherData: WeatherData;
  unit: TemperatureUnit;
  onClose: () => void;
  onOpenLunar?: () => void;
}

export const WidgetDetailModal: React.FC<WidgetDetailModalProps> = ({
  widgetId,
  weatherData,
  unit,
  onClose,
  onOpenLunar,
}) => {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 768;

  if (!widgetId) return null;

  const { current, location, hourly, daily } = weatherData;

  const getWidgetMeta = () => {
    switch (widgetId) {
      case 'uv':
        return { title: 'Índice UV & Proteção', icon: 'white-balance-sunny', color: '#FBBF24' };
      case 'wind':
        return { title: 'Vento & Rajadas', icon: 'weather-windy', color: '#60A5FA' };
      case 'sun':
        return { title: 'Ciclo Solar & Luz do Dia', icon: 'weather-sunset', color: '#F97316' };
      case 'aqi':
        return { title: 'Qualidade do Ar (AQI)', icon: 'air-filter', color: '#34D399' };
      case 'feels_like':
        return { title: 'Sensação Térmica', icon: 'thermometer-alert', color: '#FB923C' };
      case 'precipitation':
        return { title: 'Precipitação & Chuva', icon: 'weather-rainy', color: '#38BDF8' };
      case 'humidity':
        return { title: 'Umidade & Ponto de Orvalho', icon: 'water-percent', color: '#60A5FA' };
      case 'visibility':
        return { title: 'Visibilidade Atmosférica', icon: 'eye-outline', color: '#93C5FD' };
      case 'pressure':
        return { title: 'Pressão Atmosférica', icon: 'gauge', color: '#A78BFA' };
      case 'moon':
        return { title: 'Fase da Lua & Plantio', icon: 'moon-waning-crescent', color: '#E0E7FF' };
      case 'hourly':
        return { title: 'Previsão Horária (24h)', icon: 'clock-time-four-outline', color: '#60A5FA' };
      case 'daily':
        return { title: 'Previsão de 10 Dias', icon: 'calendar-range', color: '#FBBF24' };
      default:
        return { title: 'Resumo do Clima', icon: 'calendar-month', color: '#60A5FA' };
    }
  };

  const meta = getWidgetMeta();
  const modalHeight = isWide ? Math.min(height * 0.88, 780) : height * 0.88;

  const renderContent = () => {
    switch (widgetId) {
      case 'uv':
        return <UvDetailView current={current} hourly={hourly} />;

      case 'wind':
        return <WindDetailView current={current} unit={unit} />;

      case 'sun':
        return <SunDetailView current={current} location={location} />;

      case 'aqi':
        return <AqiDetailView current={current} />;

      case 'feels_like':
        return <FeelsLikeDetailView current={current} unit={unit} />;

      case 'precipitation':
        return <PrecipitationDetailView current={current} hourly={hourly} />;

      case 'humidity':
        return <HumidityDetailView current={current} unit={unit} />;

      case 'visibility':
        return <VisibilityDetailView current={current} unit={unit} />;

      case 'pressure':
        return <PressureDetailView current={current} unit={unit} />;

      case 'hourly':
        return <HourlyDetailView hourly={hourly} current={current} unit={unit} />;

      case 'daily':
        return <DailyDetailView daily={daily} unit={unit} currentTempC={current.tempC} />;

      case 'moon':
        return (
          <View style={styles.section}>
            <Text style={styles.modalTitle}>Fase da Lua & Plantio</Text>
            <Text style={styles.modalBigVal}>{current.moonPhaseName}</Text>
            <Text style={styles.descText}>Iluminação visível: {current.moonIllumination}%</Text>

            {onOpenLunar && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  onOpenLunar();
                }}
                style={styles.lunarAgriCtaBtn}
              >
                <MaterialCommunityIcons name="sprout" size={20} color="#0A1118" />
                <View style={styles.lunarAgriCtaTextWrap}>
                  <Text style={styles.lunarAgriCtaTitle}>Guia da Agricultura Familiar</Text>
                  <Text style={styles.lunarAgriCtaSub}>
                    Ver o que plantar, evitar e calendário completo →
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Ciclo Lunar Sinódico & Fisiologia Vegetal:</Text>
              <Text style={styles.infoBoxItem}>
                O ciclo lunar de 29,5 dias influencia marés e atração hídrica na seiva das plantas, guiando épocas certas de semeadura e colheita para o produtor rural.
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.section}>
            <Text style={styles.modalTitle}>Resumo do Clima</Text>
            <Text style={styles.descText}>{current.friendlySummary}</Text>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, isWide && styles.overlayWide]}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            { height: modalHeight },
            isWide && styles.sheetContainerWide,
          ]}
        >
          {Platform.OS === 'ios' ? (
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidSheetBg]} />
          )}

          <View style={styles.sheetContent}>
            {/* Grabber Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleGroup}>
                <View style={[styles.headerIconWrap, { backgroundColor: `${meta.color}20` }]}>
                  <MaterialCommunityIcons name={meta.icon as any} size={18} color={meta.color} />
                </View>
                <Text style={styles.headerTitleText}>{meta.title}</Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                accessibilityLabel="Fechar Detalhes"
              >
                <MaterialCommunityIcons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Detail Body */}
            <ScrollView
              contentContainerStyle={styles.scrollBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
              {renderContent()}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 10, 18, 0.72)',
  },
  overlayWide: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dismissArea: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: '#0A121D',
    width: '100%',
    zIndex: 20,
    elevation: 24,
  },
  sheetContainerWide: {
    maxWidth: 680,
    borderRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
  },
  androidSheetBg: {
    backgroundColor: '#0A121D',
  },
  sheetContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 32,
  },
  section: {
    paddingTop: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalBigVal: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
    marginBottom: 6,
  },
  lunarAgriCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 14,
    gap: 10,
  },
  lunarAgriCtaTextWrap: {
    flex: 1,
  },
  lunarAgriCtaTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#0A1118',
  },
  lunarAgriCtaSub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#0A1118',
    opacity: 0.85,
    marginTop: 1,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoBoxTitle: {
    fontSize: 12.5,
    fontFamily: Fonts.bold,
    color: '#93C5FD',
    marginBottom: 6,
  },
  infoBoxItem: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 17,
  },
});
