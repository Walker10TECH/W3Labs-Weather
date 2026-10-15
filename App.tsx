import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

// Custom Hooks & Types
import { useWeather } from './src/hooks/useWeather';

// Background & Header Components
import { AtmosphericBackground } from './src/components/background/AtmosphericBackground';
import { AppHeader } from './src/components/header/AppHeader';
import { HeroSummaryWidget } from './src/components/header/HeroSummaryWidget';

// Widgets
import { HourlyForecastWidget } from './src/components/widgets/HourlyForecastWidget';
import { DailyForecastWidget } from './src/components/widgets/DailyForecastWidget';
import { UvIndexWidget } from './src/components/widgets/UvIndexWidget';
import { WindWidget } from './src/components/widgets/WindWidget';
import { SunTimeWidget } from './src/components/widgets/SunTimeWidget';
import { AirQualityWidget } from './src/components/widgets/AirQualityWidget';
import { FeelsLikeWidget } from './src/components/widgets/FeelsLikeWidget';
import { PrecipitationWidget } from './src/components/widgets/PrecipitationWidget';
import { HumidityWidget } from './src/components/widgets/HumidityWidget';
import { VisibilityWidget } from './src/components/widgets/VisibilityWidget';
import { PressureWidget } from './src/components/widgets/PressureWidget';
import { MoonPhaseWidget } from './src/components/widgets/MoonPhaseWidget';
import { WidgetDetailModal } from './src/components/widgets/WidgetDetailModal';

// City Search Modal
import { CitySearchModal } from './src/components/city/CitySearchModal';

// Lunar Agriculture Modal (Produtor Rural & Agricultura Familiar)
import { LunarAgricultureModal } from './src/components/lunar/LunarAgricultureModal';

// Font constants
import { Fonts } from './src/theme/fonts';

export default function App() {
  const { width, height } = useWindowDimensions();
  const {
    currentCity,
    weatherData,
    isLoading,
    isRefreshing,
    unit,
    savedCities,
    selectedWidget,
    selectCity,
    refreshWeather,
    toggleUnit,
    openWidgetDetail,
    closeWidgetDetail,
    requestGpsLocation,
  } = useWeather();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLunarOpen, setIsLunarOpen] = useState(false);

  // Load Nokia Pure Headline font family
  const [fontsLoaded] = useFonts({
    [Fonts.ultralight]: require('./assets/fonts/nokiapureheadline_ultralight.otf'),
    [Fonts.light]: require('./assets/fonts/nokiapureheadline_light.otf'),
    [Fonts.regular]: require('./assets/fonts/nokiapureheadline_regular.otf'),
    [Fonts.bold]: require('./assets/fonts/nokiapureheadline_bold.otf'),
  });

  const { current, hourly, daily } = weatherData;

  // Responsive Breakpoint Computations
  const isLandscape = width > height;
  const isMobileLandscape = isLandscape && width < 900;
  const isDesktopOr4K = width >= 1024;

  const isSplitLayout = isDesktopOr4K || isMobileLandscape;

  // Splash screen while fonts load
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  // Bento Grid Items JSX
  const renderBentoGrid = () => (
    <View style={styles.bentoGrid}>
      <UvIndexWidget
        uvIndex={current.uvIndex}
        category={current.uvCategory}
        advice={current.uvAdvice}
        onPress={() => openWidgetDetail('uv')}
      />

      <WindWidget
        windSpeedKmh={current.windSpeedKmh}
        windDirectionDeg={current.windDirectionDeg}
        windDirectionCardinal={current.windDirectionCardinal}
        windGustsKmh={current.windGustsKmh}
        unit={unit}
        onPress={() => openWidgetDetail('wind')}
      />

      <SunTimeWidget
        sunriseTime={current.sunriseTime}
        sunsetTime={current.sunsetTime}
        sunProgress={current.sunProgress}
        daylightRemaining={current.daylightRemaining}
        onPress={() => openWidgetDetail('sun')}
      />

      <AirQualityWidget
        aqi={current.aqi}
        category={current.aqiCategory}
        color={current.aqiColor}
        advice={current.aqiAdvice}
        pm25={current.pm25}
        onPress={() => openWidgetDetail('aqi')}
      />

      <FeelsLikeWidget
        feelsLikeC={current.feelsLikeC}
        tempC={current.tempC}
        humidity={current.humidity}
        unit={unit}
        onPress={() => openWidgetDetail('feels_like')}
      />

      <PrecipitationWidget
        precipitationMm={current.precipitationMm}
        precipitationProbability={current.precipitationProbability}
        onPress={() => openWidgetDetail('precipitation')}
      />

      <HumidityWidget
        humidity={current.humidity}
        dewPointC={current.dewPointC}
        unit={unit}
        onPress={() => openWidgetDetail('humidity')}
      />

      <VisibilityWidget
        visibilityKm={current.visibilityKm}
        description={current.visibilityDescription}
        unit={unit}
        onPress={() => openWidgetDetail('visibility')}
      />

      <PressureWidget
        pressureHpa={current.pressureHpa}
        pressureTrend={current.pressureTrend}
        unit={unit}
        onPress={() => openWidgetDetail('pressure')}
      />

      <MoonPhaseWidget
        moonPhaseName={current.moonPhaseName}
        illumination={current.moonIllumination}
        onPress={() => setIsLunarOpen(true)}
      />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerNote}>W3Labs-Weather 2026</Text>
      <Text style={styles.footerSub}>Todos os direitos reservados</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <AtmosphericBackground condition={current.condition}>
        <StatusBar style="light" />
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          {/* Top Bar Header */}
          <View style={styles.headerContainer}>
            <AppHeader
              unit={unit}
              isLoading={isLoading}
              onOpenSearch={() => setIsSearchOpen(true)}
              onToggleUnit={toggleUnit}
              onRequestGps={requestGpsLocation}
              onRefresh={refreshWeather}
              onOpenLunar={() => setIsLunarOpen(true)}
            />
          </View>

          {/* Master Responsive Container */}
          <View style={styles.masterWrapper}>
            {isSplitLayout ? (
              /* Two-Column Split Layout for Mobile Landscape, Tablets and PCs up to 4K */
              <View style={styles.splitLayoutContainer}>
                {/* Left Column (Sticky Weather Focus) */}
                <View style={[styles.leftColumn, isDesktopOr4K ? styles.leftColumnDesktop : styles.leftColumnMobile]}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.leftScrollContent}
                  >
                    <HeroSummaryWidget
                      weatherData={weatherData}
                      unit={unit}
                      onPressLocation={() => setIsSearchOpen(true)}
                      onPressAlert={() => openWidgetDetail('hourly')}
                    />

                    <HourlyForecastWidget
                      hourly={hourly}
                      unit={unit}
                      friendlySummary={current.friendlySummary}
                      onPress={() => openWidgetDetail('hourly')}
                    />
                  </ScrollView>
                </View>

                {/* Right Column (10-Day Forecast & Modular Bento Grid) */}
                <ScrollView
                  style={styles.rightColumn}
                  contentContainerStyle={styles.rightScrollContent}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={refreshWeather}
                      tintColor="#FFFFFF"
                      colors={['#60A5FA']}
                    />
                  }
                >
                  <DailyForecastWidget
                    daily={daily}
                    currentTempC={current.tempC}
                    unit={unit}
                    onPress={() => openWidgetDetail('daily')}
                  />

                  {renderBentoGrid()}
                  {renderFooter()}
                </ScrollView>
              </View>
            ) : (
              /* Single-Column Portrait Feed for Mobile Phones (iPhone 1-18, Android 4-16) */
              <ScrollView
                style={styles.singleScrollView}
                contentContainerStyle={styles.singleScrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={refreshWeather}
                    tintColor="#FFFFFF"
                    colors={['#60A5FA']}
                  />
                }
              >
                <HeroSummaryWidget
                  weatherData={weatherData}
                  unit={unit}
                  onPressLocation={() => setIsSearchOpen(true)}
                  onPressAlert={() => openWidgetDetail('hourly')}
                />

                <HourlyForecastWidget
                  hourly={hourly}
                  unit={unit}
                  friendlySummary={current.friendlySummary}
                  onPress={() => openWidgetDetail('hourly')}
                />

                <DailyForecastWidget
                  daily={daily}
                  currentTempC={current.tempC}
                  unit={unit}
                  onPress={() => openWidgetDetail('daily')}
                />

                {renderBentoGrid()}
                {renderFooter()}
              </ScrollView>
            )}
          </View>

          {/* Search Modal */}
          <CitySearchModal
            visible={isSearchOpen}
            savedCities={savedCities}
            currentCity={currentCity}
            onSelectCity={selectCity}
            onRequestGps={requestGpsLocation}
            onClose={() => setIsSearchOpen(false)}
          />

          {/* Widget Detail Modal */}
          <WidgetDetailModal
            widgetId={selectedWidget}
            weatherData={weatherData}
            unit={unit}
            onClose={closeWidgetDetail}
            onOpenLunar={() => setIsLunarOpen(true)}
          />

          {/* Dedicated Lunar Agriculture Screen for Family Farming & Rural Producers */}
          <LunarAgricultureModal
            visible={isLunarOpen}
            location={currentCity}
            currentMoonPhaseName={current.moonPhaseName}
            illumination={current.moonIllumination}
            onClose={() => setIsLunarOpen(false)}
          />
        </SafeAreaView>
      </AtmosphericBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#0A1118',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    maxWidth: 1560,
    alignSelf: 'center',
  },
  masterWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1560,
    alignSelf: 'center',
  },
  // Split Layout for Large Screens & Mobile Landscape
  splitLayoutContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 12,
  },
  leftColumn: {
    paddingBottom: 16,
  },
  leftColumnDesktop: {
    width: 380,
  },
  leftColumnMobile: {
    width: '42%',
  },
  leftScrollContent: {
    paddingBottom: 24,
  },
  rightColumn: {
    flex: 1,
  },
  rightScrollContent: {
    paddingBottom: 30,
  },
  // Single Column for Mobile Phones Portrait
  singleScrollView: {
    flex: 1,
  },
  singleScrollContent: {
    paddingHorizontal: 11,
    paddingBottom: 30,
  },
  // Bento Grid
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 8,
  },
  footerNote: {
    fontSize: 11,
    fontFamily: 'NokiaPureHeadline-Bold',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footerSub: {
    fontSize: 10,
    fontFamily: 'NokiaPureHeadline-Regular',
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 2,
    textAlign: 'center',
  },
});
