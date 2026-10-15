import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WidgetCard } from './WidgetCard';
import { Fonts, FontSizes } from '../../theme/fonts';

interface UvIndexWidgetProps {
  uvIndex: number;
  category: string;
  advice: string;
  onPress?: () => void;
}

export const UvIndexWidget: React.FC<UvIndexWidgetProps> = ({
  uvIndex,
  category,
  advice,
  onPress,
}) => {
  // Normalize UV to 0-11 scale
  const progressPercent = Math.min(100, Math.max(0, (uvIndex / 11) * 100));

  return (
    <WidgetCard
      title="Índice UV"
      icon="white-balance-sunny"
      iconColor="#FFD166"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text style={styles.valueText}>{uvIndex}</Text>
        <Text style={styles.categoryText}>{category}</Text>

        {/* UV Spectrum Gradient Bar */}
        <View style={styles.barContainer}>
          <LinearGradient
            colors={['#4CD964', '#FFCC00', '#FF9500', '#FF3B30', '#AF52DE']}
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
  valueText: {
    fontSize: FontSizes.widgetValue,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  categoryText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginTop: -1,
    marginBottom: 6,
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
  adviceText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 13,
    marginTop: 3,
  },
});
