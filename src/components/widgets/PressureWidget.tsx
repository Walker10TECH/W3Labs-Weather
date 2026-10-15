import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatPressure } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface PressureWidgetProps {
  pressureHpa: number;
  pressureTrend: 'rising' | 'steady' | 'falling';
  unit: TemperatureUnit;
  onPress?: () => void;
}

export const PressureWidget: React.FC<PressureWidgetProps> = ({
  pressureHpa,
  pressureTrend,
  unit,
  onPress,
}) => {
  const getTrendInfo = () => {
    switch (pressureTrend) {
      case 'rising':
        return { text: 'Subindo • Tempo firme', icon: 'arrow-top-right' as const, color: '#34D399' };
      case 'falling':
        return { text: 'Caindo • Instabilidade', icon: 'arrow-bottom-right' as const, color: '#F87171' };
      default:
        return { text: 'Estável', icon: 'arrow-right' as const, color: '#60A5FA' };
    }
  };

  const trend = getTrendInfo();

  return (
    <WidgetCard
      title="Pressão"
      icon="speedometer"
      iconColor="#F472B6"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text style={styles.valueText}>{formatPressure(pressureHpa, unit)}</Text>

        <View style={styles.trendRow}>
          <MaterialCommunityIcons name={trend.icon} size={13} color={trend.color} />
          <Text style={[styles.trendText, { color: trend.color }]}>{trend.text}</Text>
        </View>

        <Text style={styles.subText}>
          {pressureHpa > 1013
            ? 'Alta pressão atmosférica favorece tempo limpo.'
            : 'Baixa pressão atmosférica pode indicar nuvens e chuva.'}
        </Text>
      </View>
    </WidgetCard>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: 'space-between',
    flex: 1,
  },
  valueText: {
    fontSize: FontSizes.widgetValueSm,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  trendText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
  },
  subText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 13,
    marginTop: 5,
  },
});
