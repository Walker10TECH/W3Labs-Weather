import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WidgetCard } from './WidgetCard';
import { Fonts, FontSizes } from '../../theme/fonts';

interface AirQualityWidgetProps {
  aqi: number;
  category: string;
  color: string;
  advice: string;
  pm25: number;
  onPress?: () => void;
}

export const AirQualityWidget: React.FC<AirQualityWidgetProps> = ({
  aqi,
  category,
  color,
  advice,
  pm25,
  onPress,
}) => {
  // Normalize AQI to 0-200 scale
  const progressPercent = Math.min(100, Math.max(0, (aqi / 200) * 100));

  return (
    <WidgetCard
      title="Qualidade do Ar"
      icon="leaf"
      iconColor="#34D399"
      onPress={onPress}
    >
      <View style={styles.body}>
        <View style={styles.headerValueRow}>
          <Text style={styles.aqiValue}>{aqi}</Text>
          <View style={[styles.badgePill, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{category}</Text>
          </View>
        </View>

        {/* AQI Gradient Bar */}
        <View style={styles.barContainer}>
          <LinearGradient
            colors={['#34C759', '#30D158', '#FFD60A', '#FF9F0A', '#FF453A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBar}
          />
          <View
            style={[
              styles.pointerDot,
              {
                left: `${progressPercent}%`,
              },
            ]}
          />
        </View>

        <View style={styles.pmRow}>
          <Text style={styles.pmLabel}>PM2.5:</Text>
          <Text style={styles.pmValue}>{pm25} µg/m³</Text>
        </View>

        <Text style={styles.adviceText} numberOfLines={2}>
          {advice}
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
  headerValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aqiValue: {
    fontSize: FontSizes.widgetValue,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  badgeText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  barContainer: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'relative',
    marginVertical: 6,
    justifyContent: 'center',
  },
  gradientBar: {
    ...StyleSheet.absoluteFill,
    borderRadius: 2,
  },
  pointerDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000',
    marginLeft: -3.5,
  },
  pmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pmLabel: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  pmValue: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  adviceText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 13,
    marginTop: 3,
  },
});
