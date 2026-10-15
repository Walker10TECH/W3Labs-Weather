import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WidgetCard } from './WidgetCard';
import { Fonts, FontSizes } from '../../theme/fonts';

interface PrecipitationWidgetProps {
  precipitationMm: number;
  precipitationProbability: number;
  onPress?: () => void;
}

export const PrecipitationWidget: React.FC<PrecipitationWidgetProps> = ({
  precipitationMm,
  precipitationProbability,
  onPress,
}) => {
  let statusText = 'Sem previsão de chuva para hoje.';
  if (precipitationMm > 15) {
    statusText = 'Chuva forte e acumulados significativos.';
  } else if (precipitationMm > 5) {
    statusText = 'Chuva moderada ao longo do dia.';
  } else if (precipitationMm > 0 || precipitationProbability > 30) {
    statusText = 'Pancadas rápidas ou garoa passageira.';
  }

  return (
    <WidgetCard
      title="Precipitação"
      icon="water"
      iconColor="#60A5FA"
      onPress={onPress}
    >
      <View style={styles.body}>
        <View>
          <Text style={styles.valueText}>{precipitationMm} mm</Text>
          <Text style={styles.subTitle}>últimas 24 horas</Text>
        </View>

        <View style={styles.probRow}>
          <Text style={styles.probLabel}>Probabilidade:</Text>
          <Text style={styles.probValue}>{precipitationProbability}%</Text>
        </View>

        <Text style={styles.statusText}>{statusText}</Text>
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
  subTitle: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: -1,
  },
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  probLabel: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  probValue: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.bold,
    color: '#67E8F9',
  },
  statusText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 13,
    marginTop: 5,
  },
});
