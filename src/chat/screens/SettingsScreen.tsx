import React, {useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AppHeader,
  Avatar,
  BottomNavigation,
  SearchField,
} from '../components/Common';
import {profile} from '../data';
import {getUnreadNotificationCount, useChat} from '../ChatContext';
import {colors, spacing} from '../theme';
import {ChatStackParamList} from '../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'Settings'>;
type SettingKey = 'twoFactor' | 'sound' | 'push' | 'darkMode';

const settingsSections = [
  {
    title: 'Tài khoản & Bảo mật',
    items: [
      {id: 'personal', icon: '▣', title: 'Thông tin cá nhân', detail: 'Cập nhật họ tên, sinh nhật, tiểu sử'},
      {id: 'password', icon: '⌑', title: 'Đổi mật khẩu', detail: 'Đã đổi 45 ngày trước'},
      {id: 'twoFactor', icon: '◇', title: 'Xác thực hai yếu tố (2FA)', detail: 'Đang bật (Ứng dụng Authenticator)', toggle: true},
      {id: 'privacy', icon: '◉', title: 'Quyền riêng tư', detail: 'Ai có thể thấy tin nhắn & trạng thái online'},
    ],
  },
  {
    title: 'Trò chuyện & Thông báo',
    items: [
      {id: 'sound', icon: '♫', title: 'Âm thanh & Rung', detail: 'Chuông Pulse Beat, rung tiêu chuẩn', toggle: true},
      {id: 'push', icon: '♧', title: 'Thông báo đẩy', detail: 'Hiện bản xem trước tin nhắn', toggle: true},
      {id: 'media', icon: '▧', title: 'Bộ nhớ dữ liệu & Media', detail: 'Đã sử dụng 1.4 GB / Tự tải qua Wi-Fi'},
      {id: 'darkMode', icon: '☾', title: 'Chế độ nền tối (Dark Mode)', detail: 'Đang tắt (Theo hệ thống)', toggle: true},
    ],
  },
  {
    title: 'Hỗ trợ & Khác',
    items: [
      {id: 'help', icon: '?', title: 'Trợ giúp & Phản hồi', detail: 'Câu hỏi thường gặp, báo cáo sự cố'},
      {id: 'terms', icon: '◇', title: 'Điều khoản dịch vụ', detail: 'Chính sách bảo mật người dùng'},
      {id: 'version', icon: 'ⓘ', title: 'Phiên bản ứng dụng', detail: 'Bản phát hành mới nhất  ·  v2.4.1'},
    ],
  },
];

export default function SettingsScreen({navigation}: Props) {
  const {notifications, settings, toggleSetting} = useChat();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const unreadCount = getUnreadNotificationCount(notifications);
  const visibleSections = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi');
    return settingsSections
      .map(section => ({
        ...section,
        items: section.items.filter(
          item =>
            !term ||
            item.title.toLocaleLowerCase('vi').includes(term) ||
            item.detail.toLocaleLowerCase('vi').includes(term),
        ),
      }))
      .filter(section => section.items.length);
  }, [query]);

  const handleSetting = (id: string) => {
    if (id === 'twoFactor' || id === 'sound' || id === 'push' || id === 'darkMode') {
      toggleSetting(id as SettingKey);
      return;
    }
    const item = settingsSections.flatMap(section => section.items).find(entry => entry.id === id);
    if (item) {
      Alert.alert(item.title, item.detail);
    }
  };

  const logout = () =>
    Alert.alert('Xác nhận đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi PulseChat không?', [
      {text: 'Hủy bỏ', style: 'cancel'},
      {
        text: 'Đăng xuất ngay',
        style: 'destructive',
        onPress: () => navigation.reset({index: 0, routes: [{name: 'Login'}]}),
      },
    ]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <AppHeader title="Settings" navigation={navigation} onSearch={() => setFocused(true)} />
      <View style={styles.searchWrap}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm cài đặt, mật khẩu, thông báo..."
          autoFocus={focused}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Cài đặt & Tài khoản</Text>
        <Text style={styles.subtitle}>Tùy biến trải nghiệm & quản lý bảo mật</Text>
        <View style={styles.profileCard}>
          <Avatar uri={profile.avatar} initials="N" size={64} online />
          <View style={styles.profileInfo}>
            <View style={styles.profileTitleRow}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.verified}>✓</Text>
            </View>
            <Text style={styles.profileHandle}>{profile.handle}</Text>
            <Text style={styles.profileStatus}>●  Đang trực tuyến trên PulseChat</Text>
            <Text style={styles.profileContact}>✉  {profile.email}</Text>
            <Text style={styles.profileContact}>☎  {profile.phone}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => Alert.alert('Chỉnh sửa hồ sơ', 'Thông tin tài khoản mẫu đã được xác minh.')}
            style={styles.editButton}>
            <Text style={styles.editGlyph}>✎</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => Alert.alert('Chỉnh sửa hồ sơ cá nhân', 'Tính năng cập nhật hồ sơ sẽ được đồng bộ khi kết nối tài khoản.')}
          style={styles.editProfile}>
          <Text style={styles.editProfileText}>✎  Chỉnh sửa hồ sơ cá nhân</Text>
        </TouchableOpacity>

        {visibleSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => {
                const settingKey = item.id as SettingKey;
                const value = item.toggle ? settings[settingKey] : false;
                const contents = (
                  <>
                    <View style={styles.settingIconWrap}>
                      <Text style={styles.settingIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.settingCopy}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingDetail}>{item.detail}</Text>
                    </View>
                    {item.toggle ? (
                      <Switch
                        accessibilityLabel={item.title}
                        value={value}
                        onValueChange={() => toggleSetting(settingKey)}
                        trackColor={{false: '#c3c6d7', true: '#9bb8ff'}}
                        thumbColor={value ? colors.primaryBright : '#f5f5f5'}
                      />
                    ) : (
                      <Text style={styles.chevron}>›</Text>
                    )}
                  </>
                );
                return item.toggle ? (
                  <View
                    key={item.id}
                    style={[
                      styles.settingRow,
                      index < section.items.length - 1 && styles.rowDivider,
                    ]}>
                    {contents}
                  </View>
                ) : (
                  <TouchableOpacity
                    key={item.id}
                    accessibilityRole="button"
                    onPress={() => handleSetting(item.id)}
                    style={[
                      styles.settingRow,
                      index < section.items.length - 1 && styles.rowDivider,
                    ]}>
                    {contents}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <TouchableOpacity accessibilityRole="button" onPress={logout} style={styles.logoutCard}>
          <Text style={styles.logoutTitle}>↪  Đăng xuất</Text>
          <Text style={styles.logoutDetail}>Đăng xuất và quay lại Màn hình Đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation current="Settings" navigation={navigation} notificationCount={unreadCount} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  searchWrap: {paddingHorizontal: spacing.page, paddingTop: 12},
  content: {paddingBottom: 25, paddingHorizontal: spacing.page},
  pageTitle: {color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 20},
  subtitle: {color: colors.muted, fontSize: 13, marginTop: 4},
  profileCard: {alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: 20, flexDirection: 'row', marginTop: 18, padding: 14},
  profileInfo: {flex: 1, marginLeft: 12},
  profileTitleRow: {alignItems: 'center', flexDirection: 'row', gap: 5},
  profileName: {color: colors.text, fontSize: 16, fontWeight: '700'},
  verified: {backgroundColor: colors.primaryBright, borderRadius: 9, color: colors.surface, fontSize: 10, overflow: 'hidden', paddingHorizontal: 4},
  profileHandle: {color: colors.primary, fontSize: 12, marginTop: 3},
  profileStatus: {color: colors.online, fontSize: 11, marginTop: 5},
  profileContact: {color: colors.secondaryText, fontSize: 11, marginTop: 5},
  editButton: {alignItems: 'center', height: 32, justifyContent: 'center', width: 32},
  editGlyph: {color: colors.primary, fontSize: 19},
  editProfile: {alignItems: 'center', backgroundColor: '#e8edff', borderRadius: 14, marginTop: 10, paddingVertical: 10},
  editProfileText: {color: colors.primary, fontSize: 13, fontWeight: '600'},
  section: {marginTop: 19},
  sectionTitle: {color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8},
  sectionCard: {backgroundColor: colors.surface, borderRadius: 18, overflow: 'hidden'},
  settingRow: {alignItems: 'center', flexDirection: 'row', minHeight: 66, paddingHorizontal: 11, paddingVertical: 8},
  rowDivider: {borderBottomColor: '#f0f1f8', borderBottomWidth: StyleSheet.hairlineWidth},
  settingIconWrap: {alignItems: 'center', backgroundColor: colors.surfaceLow, borderRadius: 19, height: 38, justifyContent: 'center', width: 38},
  settingIcon: {color: colors.primary, fontSize: 19},
  settingCopy: {flex: 1, marginLeft: 10},
  settingTitle: {color: colors.text, fontSize: 13, fontWeight: '600'},
  settingDetail: {color: colors.muted, fontSize: 10, lineHeight: 14, marginTop: 3},
  chevron: {color: colors.muted, fontSize: 25, marginLeft: 8},
  logoutCard: {backgroundColor: colors.surface, borderRadius: 17, marginTop: 18, padding: 14},
  logoutTitle: {color: colors.error, fontSize: 14, fontWeight: '700'},
  logoutDetail: {color: colors.muted, fontSize: 11, marginTop: 5},
});
