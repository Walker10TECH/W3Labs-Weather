import { WeatherConditionType } from '../types/weather';

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function hpaToInHg(hpa: number): number {
  return parseFloat((hpa * 0.02953).toFixed(2));
}

export function degToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'L', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const index = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return directions[index];
}

export function parseWmoCode(
  code: number,
  isDay: boolean = true
): {
  condition: WeatherConditionType;
  conditionText: string;
  iconName: string;
} {
  switch (code) {
    case 0: // Céu limpo
      return isDay
        ? { condition: 'clear_day', conditionText: 'Céu Limpo', iconName: 'white-balance-sunny' }
        : { condition: 'clear_night', conditionText: 'Noite Estrelada', iconName: 'weather-night' };
    case 1: // Principalmente limpo
      return isDay
        ? { condition: 'clear_day', conditionText: 'Predomínio de Sol', iconName: 'weather-sunny' }
        : { condition: 'clear_night', conditionText: 'Noite Limpa', iconName: 'weather-night' };
    case 2: // Parcialmente nublado
      return isDay
        ? { condition: 'partly_cloudy_day', conditionText: 'Parcialmente Nublado', iconName: 'weather-partly-cloudy' }
        : { condition: 'partly_cloudy_night', conditionText: 'Parcialmente Nublado', iconName: 'weather-night-partly-cloudy' };
    case 3: // Nublado
      return { condition: 'cloudy', conditionText: 'Nublado', iconName: 'weather-cloudy' };
    case 45:
    case 48: // Nevoeiro
      return { condition: 'fog', conditionText: 'Neblina / Nevoeiro', iconName: 'weather-fog' };
    case 51:
    case 53:
    case 55: // Garoa
      return { condition: 'rain', conditionText: 'Garoa Leve', iconName: 'weather-rainy' };
    case 61:
    case 63: // Chuva
      return { condition: 'rain', conditionText: 'Chuva', iconName: 'weather-pouring' };
    case 65: // Chuva forte
      return { condition: 'heavy_rain', conditionText: 'Chuva Forte', iconName: 'weather-pouring' };
    case 71:
    case 73:
    case 75:
    case 77: // Neve
      return { condition: 'snow', conditionText: 'Neve', iconName: 'weather-snowy' };
    case 80:
    case 81: // Pancadas de chuva
      return { condition: 'rain', conditionText: 'Pancadas de Chuva', iconName: 'weather-rainy' };
    case 82: // Pancadas violentas
      return { condition: 'heavy_rain', conditionText: 'Tempestade de Chuva', iconName: 'weather-lightning-rainy' };
    case 85:
    case 86: // Pancadas de neve
      return { condition: 'snow', conditionText: 'Pancadas de Neve', iconName: 'weather-snowy-heavy' };
    case 95: // Tempestade
      return { condition: 'thunderstorm', conditionText: 'Tempestade', iconName: 'weather-lightning' };
    case 96:
    case 99: // Tempestade com granizo
      return { condition: 'thunderstorm', conditionText: 'Tempestade com Granizo', iconName: 'weather-lightning-rainy' };
    default:
      return isDay
        ? { condition: 'partly_cloudy_day', conditionText: 'Tempo Bom', iconName: 'weather-partly-cloudy' }
        : { condition: 'partly_cloudy_night', conditionText: 'Noite Agradável', iconName: 'weather-night-partly-cloudy' };
  }
}

export function getUvCategory(uv: number): {
  category: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto' | 'Extremo';
  advice: string;
  color: string;
} {
  if (uv <= 2) {
    return {
      category: 'Baixo',
      advice: 'Nenhuma proteção necessária. Aproveite o ar livre.',
      color: '#4CD964',
    };
  }
  if (uv <= 5) {
    return {
      category: 'Moderado',
      advice: 'Use óculos de sol e protetor solar FPS 30+ nas horas centrais.',
      color: '#FFCC00',
    };
  }
  if (uv <= 7) {
    return {
      category: 'Alto',
      advice: 'Proteção essencial. Reduza a exposição direta entre 11h e 16h.',
      color: '#FF9500',
    };
  }
  if (uv <= 10) {
    return {
      category: 'Muito Alto',
      advice: 'Risco alto. Fique na sombra, use chapéu e reaplique protetor.',
      color: '#FF3B30',
    };
  }
  return {
    category: 'Extremo',
    advice: 'Risco extremo. Evite exposição solar prolongada.',
    color: '#AF52DE',
  };
}

export function getAqiCategory(aqi: number): {
  category: 'Excelente' | 'Boa' | 'Moderada' | 'Ruim' | 'Muito Ruim';
  advice: string;
  color: string;
} {
  if (aqi <= 30) {
    return {
      category: 'Excelente',
      advice: 'Qualidade do ar ideal para todas as atividades externas.',
      color: '#34C759',
    };
  }
  if (aqi <= 50) {
    return {
      category: 'Boa',
      advice: 'Ar limpo e saudável para a grande maioria das pessoas.',
      color: '#30D158',
    };
  }
  if (aqi <= 100) {
    return {
      category: 'Moderada',
      advice: 'Pessoas com sensibilidade respiratória devem moderar esforços intensos.',
      color: '#FFD60A',
    };
  }
  if (aqi <= 150) {
    return {
      category: 'Ruim',
      advice: 'Grupos sensíveis podem sentir desconforto respiratório.',
      color: '#FF9F0A',
    };
  }
  return {
    category: 'Muito Ruim',
    advice: 'Qualidade do ar prejudicial. Evite exercícios ao ar livre.',
    color: '#FF453A',
  };
}

export interface WeatherAtmosphere {
  gradientColors: [string, string, ...string[]];
  particleType?: 'sun' | 'stars' | 'rain' | 'clouds' | 'snow';
  statusBarColor: 'light' | 'dark';
  ambientAccent: string;
}

export function getAtmosphericTheme(condition: WeatherConditionType): WeatherAtmosphere {
  switch (condition) {
    case 'clear_day':
      return {
        gradientColors: ['#1C77C3', '#39A0ED', '#68C5DB', '#AEE5D8'],
        particleType: 'sun',
        statusBarColor: 'light',
        ambientAccent: '#FFD166',
      };
    case 'clear_night':
      return {
        gradientColors: ['#0B132B', '#1C2541', '#3A506B', '#243B55'],
        particleType: 'stars',
        statusBarColor: 'light',
        ambientAccent: '#70A9FF',
      };
    case 'partly_cloudy_day':
      return {
        gradientColors: ['#2B5876', '#4E4376', '#5C7A99', '#8CA6BE'],
        particleType: 'clouds',
        statusBarColor: 'light',
        ambientAccent: '#F3C969',
      };
    case 'partly_cloudy_night':
      return {
        gradientColors: ['#0F2027', '#203A43', '#2C5364'],
        particleType: 'stars',
        statusBarColor: 'light',
        ambientAccent: '#8BB8E8',
      };
    case 'cloudy':
      return {
        gradientColors: ['#3E4A61', '#546A7B', '#7A8B99', '#9BA2A6'],
        particleType: 'clouds',
        statusBarColor: 'light',
        ambientAccent: '#A2C4C9',
      };
    case 'rain':
    case 'heavy_rain':
      return {
        gradientColors: ['#1A2938', '#2D445D', '#415B76', '#597081'],
        particleType: 'rain',
        statusBarColor: 'light',
        ambientAccent: '#54A0FF',
      };
    case 'thunderstorm':
      return {
        gradientColors: ['#0D131A', '#1C1936', '#2D2852', '#3E345F'],
        particleType: 'rain',
        statusBarColor: 'light',
        ambientAccent: '#C77DFF',
      };
    case 'snow':
      return {
        gradientColors: ['#3A6073', '#5E8B95', '#8CA6AD', '#D3E0EA'],
        particleType: 'snow',
        statusBarColor: 'light',
        ambientAccent: '#E0F2FE',
      };
    case 'fog':
      return {
        gradientColors: ['#475569', '#64748B', '#94A3B8'],
        particleType: 'clouds',
        statusBarColor: 'light',
        ambientAccent: '#CBD5E1',
      };
    case 'sunset':
      return {
        gradientColors: ['#2B1055', '#75225B', '#B83B5E', '#F08A5D', '#F9ED69'],
        particleType: 'sun',
        statusBarColor: 'light',
        ambientAccent: '#FF9E64',
      };
    default:
      return {
        gradientColors: ['#1C77C3', '#39A0ED', '#68C5DB'],
        particleType: 'clouds',
        statusBarColor: 'light',
        ambientAccent: '#68C5DB',
      };
  }
}

export function calculateMoonPhase(date: Date = new Date()): {
  name: string;
  illumination: number;
  icon: string;
} {
  // Known new moon reference
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const cycleDays = 29.53058770576;
  const cycleMs = cycleDays * 24 * 60 * 60 * 1000;
  const diff = (date.getTime() - knownNewMoon) % cycleMs;
  const normalized = (diff < 0 ? diff + cycleMs : diff) / cycleMs;

  const illumination = Math.round((1 - Math.cos(normalized * 2 * Math.PI)) * 50);

  if (normalized < 0.03 || normalized > 0.97) {
    return { name: 'Lua Nova', illumination, icon: 'moon-new' };
  }
  if (normalized < 0.22) {
    return { name: 'Lua Crescente', illumination, icon: 'moon-waxing-crescent' };
  }
  if (normalized < 0.28) {
    return { name: 'Quarto Crescente', illumination, icon: 'moon-first-quarter' };
  }
  if (normalized < 0.47) {
    return { name: 'Gibosa Crescente', illumination, icon: 'moon-waxing-gibbous' };
  }
  if (normalized < 0.53) {
    return { name: 'Lua Cheia', illumination, icon: 'moon-full' };
  }
  if (normalized < 0.72) {
    return { name: 'Gibosa Minguante', illumination, icon: 'moon-waning-gibbous' };
  }
  if (normalized < 0.78) {
    return { name: 'Quarto Minguante', illumination, icon: 'moon-last-quarter' };
  }
  return { name: 'Lua Minguante', illumination, icon: 'moon-waning-crescent' };
}

export function formatTemp(valueC: number, unit: 'C' | 'F'): string {
  const val = unit === 'C' ? Math.round(valueC) : cToF(valueC);
  return `${val}°`;
}

export function formatWind(valueKmh: number, unit: 'C' | 'F'): string {
  if (unit === 'C') {
    return `${Math.round(valueKmh)} km/h`;
  }
  return `${kmhToMph(valueKmh)} mph`;
}

export function formatPressure(valueHpa: number, unit: 'C' | 'F'): string {
  if (unit === 'C') {
    return `${Math.round(valueHpa)} hPa`;
  }
  return `${hpaToInHg(valueHpa)} inHg`;
}

export function formatVisibility(valueKm: number, unit: 'C' | 'F'): string {
  if (unit === 'C') {
    return `${Math.round(valueKm)} km`;
  }
  const miles = Math.round(valueKm * 0.621371);
  return `${miles} mi`;
}
