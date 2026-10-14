export type HourlyForecast = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  precipitation: number;
  pressure: number;
  visibility: number;
};

export type DailyForecast = {
  time: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
  precipitationSum: number;
  windDirectionDominant: number;
};

export type CurrentWeather = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  visibility: number;
};

export type WeatherForecast = {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};

export type ForecastSelection =
  | {kind: 'hourly'; forecast: HourlyForecast}
  | {kind: 'daily'; forecast: DailyForecast};

export type RootStackParamList = {
  Home: undefined;
  Detail: {selection: ForecastSelection; locationName: string};
};
