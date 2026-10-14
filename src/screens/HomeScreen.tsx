import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getPlaceName,
  getWeatherDescription,
  getWeatherForecast,
  getWindDirection,
  searchCity,
} from '../services/weather';
import {DailyForecast, RootStackParamList, WeatherForecast} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const COLORS = {
  background: '#081426',
  surface: '#10243B',
  surfaceLight: '#18314C',
  text: '#F4F8FC',
  muted: '#93A9BE',
  accent: '#79D7F2',
  yellow: '#FFD477',
  border: '#233A52',
};

const FALLBACK_CITY = {
  latitude: 21.0285,
  longitude: 105.8542,
  name: 'Hà Nội, Việt Nam',
};

function formatDay(date: string, index: number) {
  if (index === 0) {
    return 'Hôm nay';
  }
  if (index === 1) {
    return 'Ngày mai';
  }
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', {weekday: 'short', timeZone: 'UTC'}).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

function formatHour(dateTime: string) {
  return dateTime.slice(11, 16);
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeading}>
        <Text style={styles.metricIcon}>{icon}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );
}

function HomeScreen({navigation}: Props) {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [locationNotice, setLocationNotice] = useState('');
  const requestId = useRef(0);
  const lastLocation = useRef(FALLBACK_CITY);

  const loadWeather = useCallback(
    async (
      latitude: number,
      longitude: number,
      name: string,
      notice = '',
    ) => {
      const currentRequest = ++requestId.current;
      lastLocation.current = {latitude, longitude, name};
      setLoading(true);
      setError('');
      setLocationNotice(notice);
      try {
        const result = await getWeatherForecast(latitude, longitude);
        if (currentRequest !== requestId.current) {
          return;
        }
        if (result.hourly.length === 0 || result.daily.length === 0) {
          setForecast(null);
          setError('');
          return;
        }
        setForecast(result);
        setLocationName(name);
      } catch (requestError) {
        if (currentRequest !== requestId.current) {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Đã xảy ra lỗi khi tải thời tiết. Vui lòng thử lại.',
        );
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const loadFallbackCity = useCallback(
    (notice: string) =>
      loadWeather(
        FALLBACK_CITY.latitude,
        FALLBACK_CITY.longitude,
        FALLBACK_CITY.name,
        notice,
      ),
    [loadWeather],
  );

  const requestCurrentLocation = useCallback(async () => {
    setError('');
    setLoading(true);
    let enableHighAccuracy = true;
    try {
      if (Platform.OS === 'android') {
        const permissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        const hasFineLocation =
          permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const hasCoarseLocation =
          permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;
        if (!hasFineLocation && !hasCoarseLocation) {
          await loadFallbackCity(
            'Bạn chưa cấp quyền vị trí. Dự báo đang hiển thị cho Hà Nội; hãy tìm thành phố hoặc cấp quyền để dùng GPS.',
          );
          return;
        }
        enableHighAccuracy = hasFineLocation;
      } else if (Platform.OS === 'ios') {
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
        });
        await new Promise<void>((resolve, reject) => {
          Geolocation.requestAuthorization(resolve, reject);
        });
      }

      Geolocation.getCurrentPosition(
        async ({coords}) => {
          let name = `Vị trí hiện tại (${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)})`;
          let notice = '';
          try {
            const resolvedName = await getPlaceName(coords.latitude, coords.longitude);
            if (resolvedName) {
              name = resolvedName;
            } else {
              notice = 'Không tìm thấy tên địa điểm; đang hiển thị dự báo theo tọa độ GPS.';
            }
          } catch {
            notice = 'Không thể xác định tên địa điểm; đang hiển thị dự báo theo tọa độ GPS.';
          }
          await loadWeather(coords.latitude, coords.longitude, name, notice);
        },
        async locationError => {
          const notice =
            locationError.code === 1
              ? 'Quyền vị trí đã bị từ chối. Dự báo đang hiển thị cho Hà Nội; hãy tìm thành phố hoặc cấp quyền để dùng GPS.'
              : 'Không lấy được GPS. Dự báo đang hiển thị cho Hà Nội; bạn có thể thử lại hoặc tìm thành phố.';
          await loadFallbackCity(notice);
        },
        {enableHighAccuracy, timeout: 15000, maximumAge: 60000},
      );
    } catch (locationError) {
      setLoading(false);
      setError(
        locationError instanceof Error
          ? locationError.message
          : 'Không thể truy cập vị trí. Vui lòng thử lại hoặc tìm thành phố.',
      );
    }
  }, [loadFallbackCity, loadWeather]);

  useEffect(() => {
    requestCurrentLocation();
  }, [requestCurrentLocation]);

  const submitCitySearch = async () => {
    const query = cityQuery.trim();
    if (!query) {
      setError('Hãy nhập tên thành phố để tìm kiếm.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setLocationNotice('');
    try {
      const place = await searchCity(query);
      await loadWeather(place.latitude, place.longitude, place.name);
      setCityQuery('');
    } catch (searchError) {
      setLoading(false);
      setError(
        searchError instanceof Error
          ? searchError.message
          : 'Không thể tìm thấy thành phố. Vui lòng thử lại.',
      );
    }
  };

  const openDailyDetail = (day: DailyForecast) => {
    navigation.navigate('Detail', {
      selection: {kind: 'daily', forecast: day},
      locationName,
    });
  };

  const openHourlyDetail = (hour: WeatherForecast['hourly'][number]) => {
    navigation.navigate('Detail', {
      selection: {kind: 'hourly', forecast: hour},
      locationName,
    });
  };

  const current = forecast?.current;
  const currentConditions = current
    ? getWeatherDescription(current.weatherCode, current.isDay)
    : null;
  const firstHourIndex = forecast
    ? Math.max(
        0,
        forecast.hourly.findIndex(
          hour => hour.time.slice(0, 13) >= current!.time.slice(0, 13),
        ),
      )
    : 0;
  const hourlyForecast = forecast?.hourly.slice(firstHourIndex, firstHourIndex + 24) ?? [];
  const today = forecast?.daily[0];
  const coldestTemperature = forecast
    ? Math.min(...forecast.daily.map(day => day.temperatureMin))
    : 0;
  const warmestTemperature = forecast
    ? Math.max(...forecast.daily.map(day => day.temperatureMax))
    : 1;
  const weeklyTemperatureSpan = Math.max(1, warmestTemperature - coldestTemperature);
  const uvLabel = current
    ? current.uvIndex < 3
      ? 'Thấp'
      : current.uvIndex < 6
        ? 'Trung bình'
        : current.uvIndex < 8
          ? 'Cao'
          : 'Rất cao'
    : '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>WEATHERLY</Text>
            <Text style={styles.brandCaption}>THỜI TIẾT CỦA BẠN</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Làm mới vị trí hiện tại"
            onPress={requestCurrentLocation}
            style={styles.locationButton}>
            <Text style={styles.locationButtonText}>⌖  Vị trí</Text>
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Tìm thành phố"
            onChangeText={setCityQuery}
            onSubmitEditing={submitCitySearch}
            placeholder="Tìm thành phố..."
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={styles.searchInput}
            value={cityQuery}
          />
          <Pressable
            accessibilityRole="button"
            onPress={submitCitySearch}
            style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Tìm</Text>
          </Pressable>
        </View>

        {locationNotice ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{locationNotice}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={COLORS.accent} size="large" />
            <Text style={styles.stateTitle}>Đang cập nhật bầu trời...</Text>
            <Text style={styles.stateMessage}>Đang lấy dữ liệu thời tiết mới nhất.</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateIcon}>☁️</Text>
            <Text style={styles.stateTitle}>Chưa thể tải thời tiết</Text>
            <Text style={styles.stateMessage}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                forecast
                  ? loadWeather(
                      lastLocation.current.latitude,
                      lastLocation.current.longitude,
                      lastLocation.current.name,
                    )
                  : requestCurrentLocation()
              }
              style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : !forecast || !current || !today ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateIcon}>🌤️</Text>
            <Text style={styles.stateTitle}>Chưa có dự báo</Text>
            <Text style={styles.stateMessage}>
              Hiện chưa có dữ liệu cho địa điểm này. Hãy thử tìm một thành phố khác.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.currentCard}>
              <View style={styles.currentTop}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationPin}>⌖</Text>
                  <Text numberOfLines={1} style={styles.locationName}>
                    {locationName}
                  </Text>
                </View>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>TRỰC TIẾP</Text>
                </View>
              </View>
              <Text style={styles.todayLabel}>THỜI TIẾT HIỆN TẠI</Text>
              <View style={styles.heroRow}>
                <View>
                  <Text style={styles.temperature}>
                    {Math.round(current.temperature)}°
                  </Text>
                  <Text style={styles.weatherLabel}>{currentConditions?.label}</Text>
                  <Text style={styles.apparent}>
                    Cảm giác như {Math.round(current.apparentTemperature)}°
                  </Text>
                </View>
                <Text style={styles.heroIcon}>{currentConditions?.icon}</Text>
              </View>
              <View style={styles.highLowRow}>
                <Text style={styles.highLowText}>
                  <Text style={styles.highLowIcon}>↑ </Text>
                  Cao nhất {Math.round(today.temperatureMax)}°
                </Text>
                <View style={styles.highLowDivider} />
                <Text style={styles.highLowText}>
                  <Text style={styles.highLowIcon}>↓ </Text>
                  Thấp nhất {Math.round(today.temperatureMin)}°
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Dự báo theo giờ</Text>
                <Text style={styles.sectionSubtitle}>24 giờ tiếp theo</Text>
              </View>
              <Text style={styles.sectionArrow}>↔</Text>
            </View>
            <ScrollView
              contentContainerStyle={styles.hourlyList}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {hourlyForecast.map((hour, index) => {
                const conditions = getWeatherDescription(hour.weatherCode, hour.isDay);
                const isNow =
                  index === 0 &&
                  hour.time.slice(0, 13) === current.time.slice(0, 13);
                return (
                  <Pressable
                    accessibilityRole="button"
                    key={hour.time}
                    onPress={() => openHourlyDetail(hour)}
                    style={[styles.hourCard, isNow && styles.hourCardActive]}>
                    <Text style={[styles.hourTime, isNow && styles.activeText]}>
                      {isNow ? 'Bây giờ' : formatHour(hour.time)}
                    </Text>
                    <Text style={styles.hourIcon}>{conditions.icon}</Text>
                    <Text style={styles.hourTemperature}>
                      {Math.round(hour.temperature)}°
                    </Text>
                    <Text style={styles.rainChance}>💧 {hour.precipitationProbability}%</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>7 ngày tới</Text>
                <Text style={styles.sectionSubtitle}>Dự báo dài ngày</Text>
              </View>
              <Text style={styles.sectionArrow}>⌄</Text>
            </View>
            <View style={styles.daysCard}>
              {forecast.daily.map((day, index) => {
                const conditions = getWeatherDescription(day.weatherCode);
                const rangeOffset =
                  ((day.temperatureMin - coldestTemperature) / weeklyTemperatureSpan) * 42;
                const rangeWidth = Math.max(
                  6,
                  ((day.temperatureMax - day.temperatureMin) / weeklyTemperatureSpan) * 42,
                );
                return (
                  <Pressable
                    accessibilityRole="button"
                    key={day.time}
                    onPress={() => openDailyDetail(day)}
                    style={[
                      styles.dayRow,
                      index < forecast.daily.length - 1 && styles.dayRowBorder,
                    ]}>
                    <Text style={styles.dayName}>{formatDay(day.time, index)}</Text>
                    <Text style={styles.dayIcon}>{conditions.icon}</Text>
                    <Text style={styles.dayRain}>💧 {day.precipitationProbability}%</Text>
                    <Text style={styles.dayLow}>
                      {Math.round(day.temperatureMin)}°
                    </Text>
                    <View style={styles.rangeTrack}>
                      <View
                        style={[
                          styles.rangeFill,
                          {marginLeft: rangeOffset, width: rangeWidth},
                        ]}
                      />
                    </View>
                    <Text style={styles.dayHigh}>
                      {Math.round(day.temperatureMax)}°
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Chỉ số thời tiết</Text>
                <Text style={styles.sectionSubtitle}>Thông tin môi trường hiện tại</Text>
              </View>
            </View>
            <View style={styles.metricsGrid}>
              <MetricCard
                icon="💧"
                label="Độ ẩm"
                value={`${current.humidity}%`}
                subtitle="Độ ẩm không khí"
              />
              <MetricCard
                icon="🌬️"
                label="Gió"
                value={`${Math.round(current.windSpeed)} km/h`}
                subtitle={`${getWindDirection(current.windDirection)} · ${Math.round(current.windDirection)}°`}
              />
              <MetricCard
                icon="☀️"
                label="Chỉ số UV"
                value={current.uvIndex.toFixed(1)}
                subtitle={uvLabel}
              />
              <MetricCard
                icon="🌧️"
                label="Lượng mưa"
                value={`${current.precipitation.toFixed(1)} mm`}
                subtitle="Hiện tại"
              />
              <MetricCard
                icon="◉"
                label="Áp suất"
                value={`${Math.round(current.pressure)} hPa`}
                subtitle="Mực nước biển"
              />
              <MetricCard
                icon="👁️"
                label="Tầm nhìn"
                value={`${(current.visibility / 1000).toFixed(1)} km`}
                subtitle="Tầm nhìn ngang"
              />
            </View>
          </>
        )}
        <Text style={styles.attribution}>Dữ liệu thời tiết: Open-Meteo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  content: {paddingHorizontal: 20, paddingBottom: 36},
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 18,
  },
  brand: {color: COLORS.text, fontSize: 18, fontWeight: '800', letterSpacing: 2.4},
  brandCaption: {color: COLORS.muted, fontSize: 9, letterSpacing: 1.8, marginTop: 3},
  locationButton: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  locationButtonText: {color: COLORS.accent, fontSize: 13, fontWeight: '600'},
  searchRow: {flexDirection: 'row', gap: 10, marginBottom: 16},
  searchInput: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    color: COLORS.text,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  searchButtonText: {color: COLORS.background, fontSize: 14, fontWeight: '700'},
  notice: {
    backgroundColor: '#29354A',
    borderColor: '#65593D',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  noticeText: {color: '#F0D69A', fontSize: 12, lineHeight: 18},
  currentCard: {
    backgroundColor: COLORS.surface,
    borderColor: '#284866',
    borderRadius: 26,
    borderWidth: 1,
    marginBottom: 30,
    overflow: 'hidden',
    padding: 22,
  },
  currentTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationInfo: {alignItems: 'center', flex: 1, flexDirection: 'row', marginRight: 8},
  locationPin: {color: COLORS.accent, fontSize: 19, marginRight: 7},
  locationName: {color: COLORS.text, flex: 1, fontSize: 13, fontWeight: '600'},
  liveBadge: {
    alignItems: 'center',
    backgroundColor: '#183A43',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  liveDot: {backgroundColor: '#6EE7B7', borderRadius: 4, height: 6, marginRight: 6, width: 6},
  liveText: {color: '#A5F3D0', fontSize: 9, fontWeight: '700', letterSpacing: 0.8},
  todayLabel: {color: COLORS.muted, fontSize: 10, letterSpacing: 1.8, marginTop: 27},
  heroRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'},
  temperature: {color: COLORS.text, fontSize: 76, fontWeight: '300', letterSpacing: -4, lineHeight: 88},
  weatherLabel: {color: COLORS.text, fontSize: 18, fontWeight: '600', marginTop: 1},
  apparent: {color: COLORS.muted, fontSize: 12, marginTop: 5},
  heroIcon: {fontSize: 74, marginRight: 6, marginTop: -13},
  highLowRow: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 19,
    paddingTop: 15,
  },
  highLowText: {color: '#C5D2E0', fontSize: 12, fontWeight: '500'},
  highLowIcon: {color: COLORS.yellow, fontWeight: '800'},
  highLowDivider: {backgroundColor: COLORS.border, height: 14, marginHorizontal: 16, width: 1},
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {color: COLORS.text, fontSize: 17, fontWeight: '700'},
  sectionSubtitle: {color: COLORS.muted, fontSize: 11, marginTop: 4},
  sectionArrow: {color: COLORS.muted, fontSize: 20},
  hourlyList: {gap: 10, paddingBottom: 30},
  hourCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 80,
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  hourCardActive: {backgroundColor: '#16344B', borderColor: COLORS.accent},
  hourTime: {color: COLORS.muted, fontSize: 11, fontWeight: '500'},
  activeText: {color: COLORS.accent},
  hourIcon: {fontSize: 24, marginVertical: 13},
  hourTemperature: {color: COLORS.text, fontSize: 17, fontWeight: '700'},
  rainChance: {color: COLORS.accent, fontSize: 10, marginTop: 9},
  daysCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 14,
  },
  dayRow: {alignItems: 'center', flexDirection: 'row', minHeight: 55},
  dayRowBorder: {borderBottomColor: COLORS.border, borderBottomWidth: StyleSheet.hairlineWidth},
  dayName: {color: COLORS.text, fontSize: 12, fontWeight: '600', width: 65},
  dayIcon: {fontSize: 20, textAlign: 'center', width: 33},
  dayRain: {color: COLORS.accent, fontSize: 10, textAlign: 'center', width: 43},
  dayLow: {color: COLORS.muted, fontSize: 12, textAlign: 'right', width: 30},
  rangeTrack: {
    backgroundColor: '#35465A',
    borderRadius: 4,
    height: 5,
    marginHorizontal: 8,
    overflow: 'hidden',
    width: 42,
  },
  rangeFill: {backgroundColor: COLORS.yellow, borderRadius: 4, height: 5},
  dayHigh: {color: COLORS.text, fontSize: 12, fontWeight: '700', textAlign: 'right', width: 30},
  metricsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  metricCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 116,
    padding: 14,
    width: '48%',
  },
  metricHeading: {alignItems: 'center', flexDirection: 'row'},
  metricIcon: {fontSize: 14, marginRight: 7},
  metricLabel: {color: COLORS.muted, fontSize: 11, fontWeight: '500'},
  metricValue: {color: COLORS.text, fontSize: 20, fontWeight: '700', marginTop: 13},
  metricSubtitle: {color: COLORS.muted, fontSize: 10, marginTop: 4},
  stateCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 260,
    padding: 24,
  },
  stateIcon: {fontSize: 44, marginBottom: 14},
  stateTitle: {color: COLORS.text, fontSize: 17, fontWeight: '700', marginTop: 16},
  stateMessage: {color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 8, textAlign: 'center'},
  retryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 13,
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  retryButtonText: {color: COLORS.background, fontSize: 13, fontWeight: '700'},
  attribution: {color: '#657B90', fontSize: 10, marginTop: 26, textAlign: 'center'},
});

export default HomeScreen;
