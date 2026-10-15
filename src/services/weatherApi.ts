import { CityLocation, WeatherData, DailyForecast, HourlyForecast, WeatherConditionType } from '../types/weather';
import {
  cToF,
  kmhToMph,
  hpaToInHg,
  degToCardinal,
  parseWmoCode,
  getUvCategory,
  getAqiCategory,
  calculateMoonPhase,
} from './weatherUtils';
import { generateMockWeatherData } from './mockData';

export async function fetchLiveWeatherData(location: CityLocation): Promise<WeatherData> {
  try {
    const lat = location.latitude;
    const lon = location.longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index,visibility,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=10`;

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl, { headers: { 'User-Agent': 'W3Labs-Weather/1.0' } }),
      fetch(aqiUrl, { headers: { 'User-Agent': 'W3Labs-Weather/1.0' } }).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo responded with status ${weatherRes.status}`);
    }

    const data = await weatherRes.json();
    let aqiData: any = null;
    if (aqiRes && aqiRes.ok) {
      aqiData = await aqiRes.json().catch(() => null);
    }

    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    const isDay = current.is_day === 1;
    const parsedCurrent = parseWmoCode(current.weather_code ?? 0, isDay);

    // Parse Sunrise and Sunset
    const sunriseIso = daily.sunrise?.[0] || '';
    const sunsetIso = daily.sunset?.[0] || '';
    const sunriseTime = sunriseIso ? sunriseIso.split('T')[1]?.slice(0, 5) : '06:00';
    const sunsetTime = sunsetIso ? sunsetIso.split('T')[1]?.slice(0, 5) : '18:15';

    // Calculate daylight progress
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [srH, srM] = sunriseTime.split(':').map(Number);
    const [ssH, ssM] = sunsetTime.split(':').map(Number);
    const srTotal = (srH || 6) * 60 + (srM || 0);
    const ssTotal = (ssH || 18) * 60 + (ssM || 15);

    let sunProgress = 0;
    let daylightRemaining = 'Sem sol direto';
    if (currentMinutes >= srTotal && currentMinutes <= ssTotal) {
      sunProgress = Math.min(1, Math.max(0, (currentMinutes - srTotal) / (ssTotal - srTotal)));
      const remMin = ssTotal - currentMinutes;
      const rH = Math.floor(remMin / 60);
      const rM = remMin % 60;
      daylightRemaining = `${rH}h ${rM}m`;
    } else if (currentMinutes < srTotal) {
      sunProgress = 0;
      const toSr = srTotal - currentMinutes;
      daylightRemaining = `Nascer em ${Math.floor(toSr / 60)}h ${toSr % 60}m`;
    } else {
      sunProgress = 1;
      daylightRemaining = 'Pôr do sol ocorrido';
    }

    // AQI
    const aqiVal = Math.round(aqiData?.current?.us_aqi ?? 36);
    const pm25Val = parseFloat((aqiData?.current?.pm2_5 ?? 8.5).toFixed(1));
    const aqiInfo = getAqiCategory(aqiVal);

    // UV
    const maxUv = Math.round(daily.uv_index_max?.[0] ?? (isDay ? 7 : 0));
    const uvInfo = getUvCategory(maxUv);

    // Moon
    const moon = calculateMoonPhase(now);

    // Hourly next 24 hours
    const parsedHourly: HourlyForecast[] = [];
    const hourlyTimes: string[] = hourly.time || [];
    const nowIso = now.toISOString();

    // Find closest current hour index
    let startIdx = 0;
    const currentHourStr = now.toISOString().slice(0, 13);
    for (let i = 0; i < hourlyTimes.length; i++) {
      if (hourlyTimes[i].startsWith(currentHourStr)) {
        startIdx = i;
        break;
      }
    }

    const next24 = hourlyTimes.slice(startIdx, startIdx + 24);
    for (let i = 0; i < next24.length; i++) {
      const idx = startIdx + i;
      const timeStr = next24[i];
      const hourPart = timeStr.split('T')[1]?.slice(0, 5) || '';
      const hourLabel = i === 0 ? 'Agora' : hourPart;
      const tempC = Math.round(hourly.temperature_2m?.[idx] ?? current.temperature_2m ?? 22);
      const isDayHour = (hourly.is_day?.[idx] ?? 1) === 1;
      const condParsed = parseWmoCode(hourly.weather_code?.[idx] ?? 0, isDayHour);
      const pop = Math.round(hourly.precipitation_probability?.[idx] ?? 0);

      parsedHourly.push({
        time: timeStr,
        hourLabel,
        tempC,
        tempF: cToF(tempC),
        condition: condParsed.condition,
        conditionText: condParsed.conditionText,
        precipitationProbability: pop,
      });

      // Insert sunset event if matches
      if (hourPart === sunsetTime.slice(0, 2) + ':00' && i > 0 && i < next24.length - 1) {
        parsedHourly.push({
          time: `${sunsetIso}`,
          hourLabel: sunsetTime,
          tempC,
          tempF: cToF(tempC),
          condition: 'sunset',
          conditionText: 'Pôr do Sol',
          precipitationProbability: 0,
          isSunset: true,
          eventLabel: 'Pôr do Sol',
        });
      }
    }

    // Daily Forecast
    const parsedDaily: DailyForecast[] = [];
    const dailyTimes: string[] = daily.time || [];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekDaysFull = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    for (let i = 0; i < dailyTimes.length; i++) {
      const dDate = new Date(dailyTimes[i] + 'T12:00:00');
      const dayName = i === 0 ? 'Hoje' : weekDaysFull[dDate.getDay()];
      const shortDayName = i === 0 ? 'Hoje' : weekDays[dDate.getDay()];
      const minC = Math.round(daily.temperature_2m_min?.[i] ?? 18);
      const maxC = Math.round(daily.temperature_2m_max?.[i] ?? 26);
      const wmo = daily.weather_code?.[i] ?? 0;
      const cond = parseWmoCode(wmo, true);
      const pop = Math.round(daily.precipitation_probability_max?.[i] ?? 0);
      const uv = Math.round(daily.uv_index_max?.[i] ?? 6);

      parsedDaily.push({
        date: dailyTimes[i],
        dayName,
        shortDayName,
        condition: cond.condition,
        conditionText: cond.conditionText,
        minC,
        maxC,
        minF: cToF(minC),
        maxF: cToF(maxC),
        precipitationProbability: pop,
        uvIndexMax: uv,
      });
    }

    const currentTempC = Math.round(current.temperature_2m ?? 23);
    const feelsLikeC = Math.round(current.apparent_temperature ?? currentTempC);
    const minDayC = parsedDaily[0]?.minC ?? currentTempC - 4;
    const maxDayC = parsedDaily[0]?.maxC ?? currentTempC + 4;
    const humidity = Math.round(current.relative_humidity_2m ?? 60);

    // Dew point approximation: T - ((100 - RH) / 5)
    const dewPointC = Math.round(currentTempC - (100 - humidity) / 5);

    const windSpeedKmh = Math.round(current.wind_speed_10m ?? 12);
    const windDirDeg = Math.round(current.wind_direction_10m ?? 0);
    const windGustsKmh = Math.round(current.wind_gusts_10m ?? windSpeedKmh * 1.4);
    const pressureHpa = Math.round(current.surface_pressure ?? 1013);
    const precipMm = parseFloat((current.precipitation ?? 0).toFixed(1));

    // Visibility
    const visibilityMeters = hourly.visibility?.[startIdx] ?? 10000;
    const visibilityKm = Math.round(visibilityMeters / 1000);
    const visibilityDesc =
      visibilityKm >= 10
        ? 'Perfeita e ar límpido'
        : visibilityKm >= 5
        ? 'Boa visibilidade'
        : 'Reduzida por névoa';

    const friendlySummary = `${parsedCurrent.conditionText} com ${currentTempC}°C em ${location.name}. Máxima de ${maxDayC}°C e mínima de ${minDayC}°C. Vento ${degToCardinal(windDirDeg)} a ${windSpeedKmh} km/h.`;

    const weatherData: WeatherData = {
      location,
      current: {
        tempC: currentTempC,
        tempF: cToF(currentTempC),
        feelsLikeC,
        feelsLikeF: cToF(feelsLikeC),
        minC: minDayC,
        maxC: maxDayC,
        minF: cToF(minDayC),
        maxF: cToF(maxDayC),
        condition: parsedCurrent.condition,
        conditionText: parsedCurrent.conditionText,
        humidity,
        dewPointC,
        dewPointF: cToF(dewPointC),
        windSpeedKmh,
        windSpeedMph: kmhToMph(windSpeedKmh),
        windDirectionDeg: windDirDeg,
        windDirectionCardinal: degToCardinal(windDirDeg),
        windGustsKmh,
        windGustsMph: kmhToMph(windGustsKmh),
        uvIndex: maxUv,
        uvCategory: uvInfo.category,
        uvAdvice: uvInfo.advice,
        visibilityKm,
        visibilityMiles: Math.round(visibilityKm * 0.621371),
        visibilityDescription: visibilityDesc,
        pressureHpa,
        pressureInHg: hpaToInHg(pressureHpa),
        pressureTrend: 'steady',
        precipitationMm: precipMm,
        precipitationProbability: parsedHourly[0]?.precipitationProbability ?? 0,
        sunriseTime,
        sunsetTime,
        sunProgress,
        daylightRemaining,
        moonPhaseName: moon.name,
        moonIllumination: moon.illumination,
        aqi: aqiVal,
        aqiCategory: aqiInfo.category,
        aqiColor: aqiInfo.color,
        aqiAdvice: aqiInfo.advice,
        pm25: pm25Val,
        friendlySummary,
        updatedAt: 'Atualizado agora',
      },
      hourly: parsedHourly,
      daily: parsedDaily,
    };

    return weatherData;
  } catch (error) {
    console.warn('Network weather fetch failed, using realistic mock data:', error);
    return generateMockWeatherData(location);
  }
}

export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=8&language=pt&format=json`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'W3Labs-Weather/1.0' },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      id: `${item.id}`,
      name: item.name,
      region: item.admin1 || item.admin2 || item.country || '',
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (e) {
    console.warn('Geocoding search error:', e);
    return [];
  }
}
