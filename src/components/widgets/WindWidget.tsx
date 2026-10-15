import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TemperatureUnit } from '../../types/weather';
import { WidgetCard } from './WidgetCard';
import { formatWind } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface WindWidgetProps {
  windSpeedKmh: number;
  windDirectionDeg: number;
  windDirectionCardinal: string;
  windGustsKmh: number;
  unit: TemperatureUnit;
  onPress?: () => void;
}

export const WindWidget: React.FC<WindWidgetProps> = ({
  windSpeedKmh,
  windDirectionDeg,
  windDirectionCardinal,
  windGustsKmh,
  unit,
  onPress,
}) => {
  return (
    <WidgetCard
      title="Vento"
      icon="weather-windy"
      iconColor="#93C5FD"
      onPress={onPress}
    >
      <View style={styles.body}>
        {/* Top: Compass & Speed */}
        <View style={styles.topRow}>
          <View style={styles.speedCol}>
            <Text style={styles.speedValue}>{formatWind(windSpeedKmh, unit)}</Text>
            <Text style={styles.directionText}>
              {windDirectionCardinal} • {windDirectionDeg}°
            </Text>
          </View>

          {/* Compass Dial */}
          <View style={styles.compassContainer}>
            <View style={styles.compassDial}>
              <Text style={[styles.cardinalLabel, styles.north]}>N</Text>
              <Text style={[styles.cardinalLabel, styles.east]}>L</Text>
              <Text style={[styles.cardinalLabel, styles.south]}>S</Text>
              <Text style={[styles.cardinalLabel, styles.west]}>O</Text>

              {/* Rotated Compass Needle */}
              <View
                style={[
                  styles.needleContainer,
                  {
                    transform: [{ rotate: `${windDirectionDeg}deg` }],
                  },
                ]}
              >
                <MaterialCommunityIcons name="navigation" size={20} color="#60A5FA" />
              </View>
            </View>
          </View>
        </View>

        {/* Gusts */}
        <View style={styles.gustsContainer}>
          <Text style={styles.gustsText}>
            Rajadas até {formatWind(windGustsKmh, unit)}
          </Text>
        </View>
      </View>
    </WidgetCard>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: 'space-between',
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedCol: {
    flex: 1,
  },
  speedValue: {
    fontSize: FontSizes.widgetValueMd,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  directionText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  compassContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDial: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardinalLabel: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: Fonts.bold,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  north: { top: 2 },
  east: { right: 2 },
  south: { bottom: 2 },
  west: { left: 2 },
  needleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gustsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 6,
    marginTop: 6,
  },
  gustsText: {
    fontSize: FontSizes.bodyXs,
    fontFamily: Fonts.light,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
