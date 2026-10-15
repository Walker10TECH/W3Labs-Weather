import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatTemp } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface HumidityWidgetProps {
  humidity: number;
  dewPointC: number;
  unit: TemperatureUnit;
  onPress?: () => void;
}

export const HumidityWidget: React.FC<HumidityWidgetProps> = ({
  humidity,
  dewPointC,
  unit,
  onPress,
}) => {
  let assessment = 'Nível de umidade confortável.';
  if (humidity > 75) {
    assessment = 'Ar úmido e sensação abafada.';
  } else if (humidity < 30) {
    assessment = 'Ar seco. Beba bastante água e hidrate-se.';
  }

  return (
    <WidgetCard
      title="Umidade"
      icon="water-percent"
      iconColor="#38BDF8"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text style={styles.valueText}>{humidity}%</Text>
        <Text style={styles.dewPointText}>
          Ponto de orvalho: {formatTemp(dewPointC, unit)}
        </Text>
        <Text style={styles.assessmentText}>{assessment}</Text>
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
    fontSize: FontSizes.widgetValue,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  dewPointText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  assessmentText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 13,
    marginTop: 6,
  },
});
