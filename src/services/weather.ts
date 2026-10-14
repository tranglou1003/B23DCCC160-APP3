import {CurrentWeather, DailyForecast, HourlyForecast, WeatherForecast} from '../types';

type ApiResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    is_day: number;
    precipitation: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    uv_index: number;
    visibility: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    weather_code: number[];
    is_day: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: number[];
    precipitation: number[];
    pressure_msl: number[];
    visibility: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    wind_speed_10m_max: number[];
    precipitation_sum: number[];
    wind_direction_10m_dominant: number[];
  };
};

type GeocodingResponse = {
  results?: Array<{
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
};

type ReverseGeocodingResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
};

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API đang quá tải. Vui lòng thử lại sau ít phút.');
    }
    throw new Error(`Không thể tải dữ liệu (HTTP ${response.status}).`);
  }
  return (await response.json()) as T;
}

export async function getWeatherForecast(
  latitude: number,
  longitude: number,
): Promise<WeatherForecast> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Tọa độ vị trí không hợp lệ.');
  }

  const parameters = [
    `latitude=${encodeURIComponent(latitude)}`,
    `longitude=${encodeURIComponent(longitude)}`,
    'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index,visibility',
    'hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day,relative_humidity_2m,wind_speed_10m,wind_direction_10m,uv_index,precipitation,pressure_msl,visibility',
    'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max,precipitation_sum,wind_direction_10m_dominant',
    'timezone=auto',
    'forecast_days=7',
  ].join('&');
  const payload = await readJson<ApiResponse>(
    `https://api.open-meteo.com/v1/forecast?${parameters}`,
  );

  if (!payload.current || !payload.hourly || !payload.daily) {
    throw new Error('Dữ liệu thời tiết trả về chưa đầy đủ. Vui lòng thử lại.');
  }

  const current: CurrentWeather = {
    time: payload.current.time,
    temperature: payload.current.temperature_2m,
    apparentTemperature: payload.current.apparent_temperature,
    humidity: payload.current.relative_humidity_2m,
    weatherCode: payload.current.weather_code,
    isDay: payload.current.is_day === 1,
    precipitation: payload.current.precipitation,
    pressure: payload.current.pressure_msl,
    windSpeed: payload.current.wind_speed_10m,
    windDirection: payload.current.wind_direction_10m,
    uvIndex: payload.current.uv_index,
    visibility: payload.current.visibility,
  };

  const hourlyData = payload.hourly;
  const dailyData = payload.daily;
  const hourly: HourlyForecast[] = hourlyData.time.map((time, index) => ({
    time,
    temperature: hourlyData.temperature_2m[index],
    apparentTemperature: hourlyData.apparent_temperature[index],
    precipitationProbability: hourlyData.precipitation_probability[index],
    weatherCode: hourlyData.weather_code[index],
    isDay: hourlyData.is_day[index] === 1,
    humidity: hourlyData.relative_humidity_2m[index],
    windSpeed: hourlyData.wind_speed_10m[index],
    windDirection: hourlyData.wind_direction_10m[index],
    uvIndex: hourlyData.uv_index[index],
    precipitation: hourlyData.precipitation[index],
    pressure: hourlyData.pressure_msl[index],
    visibility: hourlyData.visibility[index],
  }));

  const daily: DailyForecast[] = dailyData.time.map((time, index) => ({
    time,
    temperatureMax: dailyData.temperature_2m_max[index],
    temperatureMin: dailyData.temperature_2m_min[index],
    precipitationProbability: dailyData.precipitation_probability_max[index],
    weatherCode: dailyData.weather_code[index],
    sunrise: dailyData.sunrise[index],
    sunset: dailyData.sunset[index],
    uvIndexMax: dailyData.uv_index_max[index],
    windSpeedMax: dailyData.wind_speed_10m_max[index],
    precipitationSum: dailyData.precipitation_sum[index],
    windDirectionDominant: dailyData.wind_direction_10m_dominant[index],
  }));

  return {current, hourly, daily};
}

export async function searchCity(query: string) {
  const parameters = new URLSearchParams({
    name: query.trim(),
    count: '1',
    language: 'vi',
    format: 'json',
  });
  const result = await readJson<GeocodingResponse>(
    `https://geocoding-api.open-meteo.com/v1/search?${parameters.toString()}`,
  );
  const place = result.results?.[0];
  if (!place) {
    throw new Error(`Không tìm thấy địa điểm "${query.trim()}". Hãy thử tên thành phố khác.`);
  }
  return {
    latitude: place.latitude,
    longitude: place.longitude,
    name: [place.name, place.admin1, place.country]
      .filter((part, index, parts) => Boolean(part) && parts.indexOf(part) === index)
      .join(', '),
  };
}

export async function getPlaceName(latitude: number, longitude: number) {
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'vi',
  });
  const result = await readJson<ReverseGeocodingResponse>(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?${parameters.toString()}`,
  );
  return [
    result.city || result.locality,
    result.principalSubdivision,
    result.countryName,
  ]
    .filter((part, index, parts) => Boolean(part) && parts.indexOf(part) === index)
    .join(', ');
}

export function getWeatherDescription(code: number, isDay = true) {
  if (code === 0) {
    return {label: 'Trời quang', icon: isDay ? '☀️' : '🌙'};
  }
  if (code === 1 || code === 2) {
    return {label: 'Ít mây', icon: isDay ? '🌤️' : '☁️'};
  }
  if (code === 3) {
    return {label: 'Nhiều mây', icon: '☁️'};
  }
  if (code === 45 || code === 48) {
    return {label: 'Sương mù', icon: '🌫️'};
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return {label: 'Mưa phùn', icon: '🌦️'};
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {label: 'Có mưa', icon: '🌧️'};
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {label: 'Có tuyết', icon: '❄️'};
  }
  if ([95, 96, 99].includes(code)) {
    return {label: 'Dông bão', icon: '⛈️'};
  }
  return {label: 'Đang cập nhật', icon: '🌡️'};
}

export function getWindDirection(degrees: number) {
  const directions = ['B', 'ĐB', 'Đ', 'ĐN', 'N', 'TN', 'T', 'TB'];
  return directions[Math.round(degrees / 45) % directions.length];
}
