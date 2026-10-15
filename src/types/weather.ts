export type WeatherConditionType =
  | 'clear_day'
  | 'clear_night'
  | 'partly_cloudy_day'
  | 'partly_cloudy_night'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'sunset';

export type TemperatureUnit = 'C' | 'F';

export interface HourlyForecast {
  time: string;
  hourLabel: string;
  tempC: number;
  tempF: number;
  condition: WeatherConditionType;
  conditionText: string;
  precipitationProbability: number;
  isSunrise?: boolean;
  isSunset?: boolean;
  eventLabel?: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  shortDayName: string;
  condition: WeatherConditionType;
  conditionText: string;
  minC: number;
  maxC: number;
  minF: number;
  maxF: number;
  precipitationProbability: number;
  uvIndexMax: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: 'info' | 'warning' | 'severe';
  time: string;
}

export interface CurrentWeather {
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  minC: number;
  maxC: number;
  minF: number;
  maxF: number;
  condition: WeatherConditionType;
  conditionText: string;
  humidity: number;
  dewPointC: number;
  dewPointF: number;
  windSpeedKmh: number;
  windSpeedMph: number;
  windDirectionDeg: number;
  windDirectionCardinal: string;
  windGustsKmh: number;
  windGustsMph: number;
  uvIndex: number;
  uvCategory: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto' | 'Extremo';
  uvAdvice: string;
  visibilityKm: number;
  visibilityMiles: number;
  visibilityDescription: string;
  pressureHpa: number;
  pressureInHg: number;
  pressureTrend: 'rising' | 'steady' | 'falling';
  precipitationMm: number;
  precipitationProbability: number;
  sunriseTime: string;
  sunsetTime: string;
  sunProgress: number; // 0 to 1
  daylightRemaining: string;
  moonPhaseName: string;
  moonIllumination: number; // 0 - 100
  aqi: number;
  aqiCategory: 'Excelente' | 'Boa' | 'Moderada' | 'Ruim' | 'Muito Ruim';
  aqiColor: string;
  aqiAdvice: string;
  pm25: number;
  friendlySummary: string;
  alert?: WeatherAlert;
  updatedAt: string;
}

export interface WeatherData {
  location: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface CityLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  isCurrentLocation?: boolean;
}

export type WidgetId =
  | 'hourly'
  | 'daily'
  | 'uv'
  | 'wind'
  | 'sun'
  | 'precipitation'
  | 'feels_like'
  | 'aqi'
  | 'humidity'
  | 'visibility'
  | 'pressure'
  | 'moon';
