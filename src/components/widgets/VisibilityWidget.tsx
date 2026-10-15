import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatVisibility } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface VisibilityWidgetProps {
  visibilityKm: number;
  description: string;
  unit: TemperatureUnit;
  onPress?: () => void;
}

export const VisibilityWidget: React.FC<VisibilityWidgetProps> = ({
  visibilityKm,
  description,
  unit,
  onPress,
}) => {
  return (
    <WidgetCard
      title="Visibilidade"
      icon="eye-outline"
      iconColor="#A78BFA"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text style={styles.valueText}>{formatVisibility(visibilityKm, unit)}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
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
  descriptionText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 13,
    marginTop: 6,
  },
});
