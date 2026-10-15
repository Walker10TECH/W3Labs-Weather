import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import {
  CityLocation,
  WeatherData,
  TemperatureUnit,
  WidgetId,
} from '../types/weather';
import { PRESET_CITIES, generateMockWeatherData } from '../services/mockData';
import { fetchLiveWeatherData } from '../services/weatherApi';

export function useWeather() {
  const [savedCities, setSavedCities] = useState<CityLocation[]>(PRESET_CITIES);
  const [currentCity, setCurrentCity] = useState<CityLocation>(PRESET_CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData>(() =>
    generateMockWeatherData(PRESET_CITIES[0])
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [selectedWidget, setSelectedWidget] = useState<WidgetId | null>(null);

  const triggerHaptic = useCallback((style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // Haptics not available in some environments
    }
  }, []);

  // Fetch live weather when current city changes
  const loadWeatherData = useCallback(
    async (city: CityLocation, showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const data = await fetchLiveWeatherData(city);
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        if (showLoading) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadWeatherData(currentCity, false);
  }, [currentCity, loadWeatherData]);

  const refreshWeather = useCallback(async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setIsRefreshing(true);
    await loadWeatherData(currentCity, false);
  }, [currentCity, loadWeatherData, triggerHaptic]);

  const selectCity = useCallback(
    (city: CityLocation) => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentCity(city);
    },
    [triggerHaptic]
  );

  const toggleUnit = useCallback(() => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, [triggerHaptic]);

  const openWidgetDetail = useCallback(
    (widgetId: WidgetId) => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
      setSelectedWidget(widgetId);
    },
    [triggerHaptic]
  );

  const closeWidgetDetail = useCallback(() => {
    setSelectedWidget(null);
  }, []);

  const requestGpsLocation = useCallback(async () => {
    try {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada. Usando cidade padrão.');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const cityName = address?.city || address?.subregion || 'Minha Localização';
      const region = address?.region || address?.district || '';
      const country = address?.country || 'Brasil';

      const gpsCity: CityLocation = {
        id: 'gps-current-loc',
        name: cityName,
        region,
        country,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        isCurrentLocation: true,
      };

      setCurrentCity(gpsCity);
      setSavedCities((prev) => {
        const filtered = prev.filter((c) => c.id !== 'gps-current-loc');
        return [gpsCity, ...filtered];
      });
    } catch (err) {
      console.warn('GPS location error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [triggerHaptic]);

  const addSavedCity = useCallback((city: CityLocation) => {
    setSavedCities((prev) => {
      if (prev.some((c) => c.id === city.id)) return prev;
      return [...prev, city];
    });
  }, []);

  const removeSavedCity = useCallback((cityId: string) => {
    setSavedCities((prev) => prev.filter((c) => c.id !== cityId));
  }, []);

  return {
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
    addSavedCity,
    removeSavedCity,
  };
}
