import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherData, TemperatureUnit } from '../../types/weather';
import { formatTemp } from '../../services/weatherUtils';
import { Fonts, FontSizes } from '../../theme/fonts';

interface HeroProps {
  weatherData: WeatherData;
  unit: TemperatureUnit;
  onPressLocation?: () => void;
  onPressAlert?: () => void;
}

export const HeroSummaryWidget: React.FC<HeroProps> = ({
  weatherData,
  unit,
  onPressLocation,
  onPressAlert,
}) => {
  const { width } = useWindowDimensions();
  const { location, current } = weatherData;

  // Responsive font sizes based on screen width
  const isSmallScreen = width < 360; // iPhone 1-5, SE 1st gen, small Androids
  const isLargeScreen = width >= 1024; // Desktop / 4K

  const tempFontSize = isSmallScreen
    ? FontSizes.heroTempSmall
    : isLargeScreen
    ? FontSizes.heroTempDesktop
    : FontSizes.heroTempMobile;

  const cityNameFontSize = isSmallScreen
    ? FontSizes.cityNameSmall
    : isLargeScreen
    ? FontSizes.cityNameDesktop
    : FontSizes.cityNameMobile;

  return (
    <View style={styles.container}>
      {/* City & Region Selector */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressLocation}
        style={styles.locationButton}
      >
        <View style={styles.locationRow}>
          {location.isCurrentLocation ? (
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={isSmallScreen ? 14 : 16}
              color="#60A5FA"
              style={styles.gpsIcon}
            />
          ) : (
            <MaterialCommunityIcons
              name="map-marker"
              size={isSmallScreen ? 14 : 16}
              color="#FFFFFF"
              style={styles.gpsIcon}
            />
          )}
          <Text style={[styles.cityName, { fontSize: cityNameFontSize }]}>
            {location.name}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={isSmallScreen ? 16 : 18}
            color="rgba(255, 255, 255, 0.7)"
          />
        </View>
        <Text style={styles.regionText}>
          {location.region ? `${location.region}, ${location.country}` : location.country}
        </Text>
      </TouchableOpacity>

      {/* Hero Temperature */}
      <View style={styles.tempSection}>
        <Text style={[styles.temperature, { fontSize: tempFontSize }]}>
          {formatTemp(current.tempC, unit)}
        </Text>
      </View>

      {/* Condition Name */}
      <Text
        style={[
          styles.conditionText,
          isSmallScreen && { fontSize: FontSizes.conditionSmall },
        ]}
      >
        {current.conditionText}
      </Text>

      {/* Min / Max & Feels Like */}
      <View style={styles.minMaxRow}>
        <View style={styles.statPill}>
          <MaterialCommunityIcons name="arrow-up" size={11} color="#FF7B7B" />
          <Text style={styles.minMaxText}>Máx: {formatTemp(current.maxC, unit)}</Text>
        </View>
        <View style={styles.statPill}>
          <MaterialCommunityIcons name="arrow-down" size={11} color="#70C5FF" />
          <Text style={styles.minMaxText}>Mín: {formatTemp(current.minC, unit)}</Text>
        </View>
        <View style={styles.feelsLikeBadge}>
          <Text style={styles.feelsLikeText}>
            Sensação {formatTemp(current.feelsLikeC, unit)}
          </Text>
        </View>
      </View>

      {/* Weather Alert Banner */}
      {current.alert && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressAlert}
          style={styles.alertBanner}
        >
          <MaterialCommunityIcons
            name="alert-decagram"
            size={16}
            color="#FFD166"
            style={styles.alertIcon}
          />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{current.alert.title}</Text>
            <Text style={styles.alertDesc} numberOfLines={1}>
              {current.alert.description}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={14} color="#FFD166" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    width: '100%',
  },
  locationButton: {
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gpsIcon: {
    marginRight: 5,
  },
  cityName: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginRight: 3,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  regionText: {
    fontSize: FontSizes.region,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 1,
    textAlign: 'center',
  },
  tempSection: {
    marginTop: 1,
    marginBottom: -3,
  },
  temperature: {
    fontFamily: Fonts.ultralight,
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  conditionText: {
    fontSize: FontSizes.conditionMobile,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  minMaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  minMaxText: {
    fontSize: FontSizes.minMaxPill,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  feelsLikeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  feelsLikeText: {
    fontSize: FontSizes.feelsLikeBadge,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(253, 230, 138, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 11,
    width: '100%',
    maxWidth: 500,
  },
  alertIcon: {
    marginRight: 8,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: Fonts.bold,
    color: '#FDE68A',
    fontSize: FontSizes.bodySmall,
  },
  alertDesc: {
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: FontSizes.bodySm,
    marginTop: 1,
  },
});
