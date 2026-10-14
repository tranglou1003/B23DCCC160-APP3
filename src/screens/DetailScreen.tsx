import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getWeatherDescription, getWindDirection} from '../services/weather';
import {DailyForecast, HourlyForecast, RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const BACKGROUND = '#081426';
const SURFACE = '#10243B';

type Metric = {icon: string; label: string; value: string};

function getDailyMetrics(forecast: DailyForecast): Metric[] {
  return [
    {icon: '🌡️', label: 'Nhiệt độ cao nhất', value: `${Math.round(forecast.temperatureMax)}°C`},
    {icon: '❄️', label: 'Nhiệt độ thấp nhất', value: `${Math.round(forecast.temperatureMin)}°C`},
    {icon: '🌧️', label: 'Khả năng mưa', value: `${forecast.precipitationProbability}%`},
    {icon: '☀️', label: 'Chỉ số UV tối đa', value: forecast.uvIndexMax.toFixed(1)},
    {
      icon: '🌬️',
      label: 'Gió mạnh nhất',
      value: `${Math.round(forecast.windSpeedMax)} km/h · ${getWindDirection(forecast.windDirectionDominant)}`,
    },
    {icon: '💦', label: 'Tổng lượng mưa', value: `${forecast.precipitationSum.toFixed(1)} mm`},
    {icon: '🌅', label: 'Bình minh', value: forecast.sunrise.slice(11, 16)},
    {icon: '🌇', label: 'Hoàng hôn', value: forecast.sunset.slice(11, 16)},
  ];
}

function getHourlyMetrics(forecast: HourlyForecast): Metric[] {
  return [
    {icon: '🌡️', label: 'Nhiệt độ', value: `${Math.round(forecast.temperature)}°C`},
    {icon: '💧', label: 'Độ ẩm', value: `${forecast.humidity}%`},
    {icon: '🌬️', label: 'Tốc độ gió', value: `${Math.round(forecast.windSpeed)} km/h`},
    {
      icon: '🧭',
      label: 'Hướng gió',
      value: `${getWindDirection(forecast.windDirection)} · ${Math.round(forecast.windDirection)}°`,
    },
    {icon: '☀️', label: 'Chỉ số UV', value: forecast.uvIndex.toFixed(1)},
    {icon: '🌧️', label: 'Khả năng mưa', value: `${forecast.precipitationProbability}%`},
    {icon: '💦', label: 'Lượng mưa', value: `${forecast.precipitation.toFixed(1)} mm`},
    {icon: '◉', label: 'Áp suất', value: `${Math.round(forecast.pressure)} hPa`},
    {icon: '👁️', label: 'Tầm nhìn', value: `${(forecast.visibility / 1000).toFixed(1)} km`},
  ];
}

function DetailScreen({navigation, route}: Props) {
  const {selection, locationName} = route.params;
  const forecast = selection.forecast;
  const conditions = getWeatherDescription(
    forecast.weatherCode,
    selection.kind === 'hourly' ? selection.forecast.isDay : true,
  );
  const time = forecast.time;
  const metrics =
    selection.kind === 'daily'
      ? getDailyMetrics(selection.forecast)
      : getHourlyMetrics(selection.forecast);
  const dateLabel = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${time.slice(0, 10)}T00:00:00Z`));
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại dự báo"
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹  Dự báo</Text>
        </Pressable>
        <Text style={styles.overline}>CHI TIẾT DỰ BÁO</Text>
        <Text style={styles.title}>
          {selection.kind === 'daily' ? 'Theo ngày' : 'Theo giờ'}
        </Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeading}>
            <View style={styles.summaryCopy}>
              <Text style={styles.location} numberOfLines={2}>{locationName}</Text>
              <Text style={styles.date}>{dateLabel}</Text>
              {selection.kind === 'hourly' ? (
                <Text style={styles.date}>{time.slice(11, 16)}</Text>
              ) : null}
            </View>
            <Text style={styles.weatherIcon}>{conditions.icon}</Text>
          </View>
          <Text style={styles.conditions}>{conditions.label}</Text>
          <View style={styles.temperatureRow}>
            {selection.kind === 'daily' ? (
              <>
                <Text style={styles.temperature}>
                  {Math.round(selection.forecast.temperatureMax)}°
                </Text>
                <Text style={styles.temperatureDivider}>/</Text>
                <Text style={styles.temperatureLow}>
                  {Math.round(selection.forecast.temperatureMin)}°
                </Text>
              </>
            ) : (
              <Text style={styles.temperature}>
                {Math.round(selection.forecast.temperature)}°
              </Text>
            )}
          </View>
          {selection.kind === 'daily' ? (
            <Text style={styles.summaryNote}>Cao nhất / thấp nhất</Text>
          ) : (
            <Text style={styles.summaryNote}>
              Cảm giác như{' '}
              {Math.round(selection.forecast.apparentTemperature)}°C
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Thông tin thời tiết</Text>
        <View style={styles.metricsGrid}>
          {metrics.map(metric => (
            <View key={metric.label} style={styles.metricCard}>
              <View style={styles.metricHeading}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.sourceCard}>
          <Text style={styles.sourceIcon}>ⓘ</Text>
          <Text style={styles.sourceText}>
            Dự báo được cung cấp bởi Open-Meteo. Chọn một khung giờ hoặc ngày khác để xem chi tiết.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: BACKGROUND, flex: 1},
  content: {padding: 20, paddingBottom: 40},
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: SURFACE,
    borderColor: '#233A52',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 28,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backText: {color: '#79D7F2', fontSize: 14, fontWeight: '600'},
  overline: {color: '#93A9BE', fontSize: 10, letterSpacing: 2, marginBottom: 8},
  title: {color: '#F4F8FC', fontSize: 28, fontWeight: '700', marginBottom: 18},
  summaryCard: {
    backgroundColor: SURFACE,
    borderColor: '#284866',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 30,
    padding: 22,
  },
  summaryHeading: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'},
  summaryCopy: {flex: 1, marginRight: 12},
  location: {color: '#F4F8FC', fontSize: 15, fontWeight: '600'},
  date: {color: '#93A9BE', fontSize: 12, marginTop: 6},
  weatherIcon: {fontSize: 52},
  conditions: {color: '#F4F8FC', fontSize: 17, fontWeight: '600', marginTop: 20},
  temperatureRow: {alignItems: 'baseline', flexDirection: 'row', marginTop: 2},
  temperature: {color: '#F4F8FC', fontSize: 64, fontWeight: '300', letterSpacing: -2},
  temperatureDivider: {color: '#93A9BE', fontSize: 34, marginHorizontal: 8},
  temperatureLow: {color: '#93A9BE', fontSize: 42, fontWeight: '300'},
  summaryNote: {color: '#93A9BE', fontSize: 12},
  sectionTitle: {color: '#F4F8FC', fontSize: 17, fontWeight: '700', marginBottom: 14},
  metricsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  metricCard: {
    backgroundColor: SURFACE,
    borderColor: '#233A52',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 104,
    padding: 14,
    width: '48%',
  },
  metricHeading: {alignItems: 'center', flexDirection: 'row'},
  metricIcon: {fontSize: 14, marginRight: 7},
  metricLabel: {color: '#93A9BE', flexShrink: 1, fontSize: 11},
  metricValue: {color: '#F4F8FC', fontSize: 18, fontWeight: '700', marginTop: 15},
  sourceCard: {
    alignItems: 'flex-start',
    backgroundColor: '#112337',
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 22,
    padding: 14,
  },
  sourceIcon: {color: '#79D7F2', fontSize: 15, marginRight: 9},
  sourceText: {color: '#93A9BE', flex: 1, fontSize: 11, lineHeight: 17},
});

export default DetailScreen;
