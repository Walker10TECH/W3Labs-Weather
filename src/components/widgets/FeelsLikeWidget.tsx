import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatTemp } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface FeelsLikeWidgetProps {
  feelsLikeC: number;
  tempC: number;
  humidity: number;
  unit: TemperatureUnit;
  onPress?: () => void;
}

export const FeelsLikeWidget: React.FC<FeelsLikeWidgetProps> = ({
  feelsLikeC,
  tempC,
  humidity,
  unit,
  onPress,
}) => {
  const diff = feelsLikeC - tempC;
  let explanation = 'Similar à temperatura real do ambiente.';
  if (diff > 1) {
    explanation = 'A umidade elevada faz o tempo parecer mais quente.';
  } else if (diff < -1) {
    explanation = 'A velocidade do vento faz parecer mais frio que o termômetro.';
  }

  return (
    <WidgetCard
      title="Sensação Térmica"
      icon="thermometer"
      iconColor="#F87171"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text style={styles.valueText}>{formatTemp(feelsLikeC, unit)}</Text>
        <Text style={styles.explanationText}>{explanation}</Text>
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
  explanationText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 13,
    marginTop: 6,
  },
});
