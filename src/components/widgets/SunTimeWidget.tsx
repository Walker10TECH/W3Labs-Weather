import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WidgetCard } from './WidgetCard';
import { Fonts, FontSizes } from '../../theme/fonts';

interface SunTimeWidgetProps {
  sunriseTime: string;
  sunsetTime: string;
  sunProgress: number; // 0 to 1
  daylightRemaining: string;
  onPress?: () => void;
}

export const SunTimeWidget: React.FC<SunTimeWidgetProps> = ({
  sunriseTime,
  sunsetTime,
  sunProgress,
  daylightRemaining,
  onPress,
}) => {
  const isDay = sunProgress > 0 && sunProgress < 1;

  return (
    <WidgetCard
      title={isDay ? 'Pôr do Sol' : 'Nascer do Sol'}
      icon={isDay ? 'weather-sunset' : 'weather-sunset-up'}
      iconColor="#FF9E64"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text style={styles.mainTime}>
          {isDay ? sunsetTime : sunriseTime}
        </Text>

        {/* Sun Path Arc Representation */}
        <View style={styles.arcContainer}>
          <View style={styles.horizonLine} />
          <View style={styles.arcDashed} />

          {/* Sun Icon Positioned along arc */}
          <View
            style={[
              styles.sunIndicator,
              {
                left: `${Math.max(5, Math.min(90, sunProgress * 100))}%`,
                bottom: Math.round(Math.sin(sunProgress * Math.PI) * 18 + 3),
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isDay ? 'white-balance-sunny' : 'moon-waning-crescent'}
              size={14}
              color={isDay ? '#FDE047' : '#93C5FD'}
            />
          </View>
        </View>

        {/* Times Footer */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.subLabel}>Nascer</Text>
            <Text style={styles.subValue}>{sunriseTime}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.subLabel}>Pôr do Sol</Text>
            <Text style={styles.subValue}>{sunsetTime}</Text>
          </View>
        </View>

        <Text style={styles.remainingText}>{daylightRemaining}</Text>
      </View>
    </WidgetCard>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: 'space-between',
    flex: 1,
  },
  mainTime: {
    fontSize: FontSizes.widgetValueSm,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  arcContainer: {
    height: 32,
    position: 'relative',
    justifyContent: 'flex-end',
    marginVertical: 3,
  },
  horizonLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: '100%',
  },
  arcDashed: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 0,
    borderStyle: 'dashed',
  },
  sunIndicator: {
    position: 'absolute',
    marginLeft: -7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  subLabel: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.55)',
  },
  subValue: {
    fontSize: FontSizes.bodySmall,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  remainingText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
});
