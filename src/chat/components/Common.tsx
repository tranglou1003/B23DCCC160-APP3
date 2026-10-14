import React, {useState} from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {profile, logoImage} from '../data';
import {ChatStackParamList} from '../types';
import {colors} from '../theme';

export function Avatar({
  uri,
  initials,
  size = 48,
  online = false,
  style,
}: {
  uri: string;
  initials: string;
  size?: number;
  online?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={[styles.avatarWrap, {width: size, height: size}, style]}>
      {uri && !failed ? (
        <Image
          source={{uri}}
          onError={() => setFailed(true)}
          style={[styles.avatarImage, {width: size, height: size}] as StyleProp<ImageStyle>}
        />
      ) : (
        <View style={[styles.avatarFallback, {width: size, height: size}]}>
          <Text style={[styles.avatarInitials, {fontSize: size * 0.3}]}>{initials}</Text>
        </View>
      )}
      {online ? <View style={[styles.onlineDot, styles.avatarOnlineDot]} /> : null}
    </View>
  );
}

export function AppHeader({
  title,
  navigation,
  onSearch,
}: {
  title: string;
  navigation: NavigationProp<ChatStackParamList>;
  onSearch?: () => void;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        {logoFailed ? (
          <View style={styles.logoFallback}>
            <Text style={styles.logoGlyph}>✦</Text>
          </View>
        ) : (
          <Image
            source={{uri: logoImage}}
            onError={() => setLogoFailed(true)}
            style={styles.logo}
          />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Tìm kiếm"
          onPress={onSearch}
          style={styles.headerIcon}>
          <Text style={styles.headerIconText}>⌕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Mở cài đặt tài khoản"
          onPress={() => navigation.navigate('Settings')}
          style={styles.profileButton}>
          <Avatar uri={profile.avatar} initials="N" size={34} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const tabItems = [
  {route: 'Messages' as const, label: 'Tin nhắn', icon: '▤'},
  {route: 'Contacts' as const, label: 'Danh bạ', icon: '▣'},
  {route: 'Notifications' as const, label: 'Thông báo', icon: '♧'},
  {route: 'Settings' as const, label: 'Cài đặt', icon: '⚙'},
];

export function BottomNavigation({
  current,
  navigation,
  notificationCount,
}: {
  current: 'Messages' | 'Contacts' | 'Notifications' | 'Settings';
  navigation: NavigationProp<ChatStackParamList>;
  notificationCount: number;
}) {
  return (
    <View style={styles.bottomBar}>
      {tabItems.map(item => {
        const active = current === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            accessibilityLabel={item.label}
            onPress={() => navigation.navigate(item.route)}
            style={styles.tab}>
            <View>
              <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{item.icon}</Text>
              {item.route === 'Notifications' && notificationCount > 0 ? (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{notificationCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
  autoFocus = false,
  onSubmitEditing,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
}) {
  return (
    <View style={styles.searchBox}>
      <Text style={styles.searchGlyph}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
      />
      {value ? (
        <TouchableOpacity accessibilityLabel="Xóa nội dung tìm kiếm" onPress={() => onChangeText('')}>
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  style,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.iconButton, style]}>
      <Text style={styles.actionIcon}>{icon}</Text>
    </TouchableOpacity>
  );
}

export function PageContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.page, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: '#f0f0f8',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },
  brand: {alignItems: 'center', flexDirection: 'row', gap: 10},
  logo: {borderRadius: 5, height: 34, width: 34},
  logoFallback: {
    alignItems: 'center',
    backgroundColor: colors.primaryBright,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  logoGlyph: {color: colors.surface, fontSize: 20, fontWeight: '700'},
  headerTitle: {color: colors.text, fontSize: 18, fontWeight: '600'},
  headerActions: {alignItems: 'center', flexDirection: 'row', gap: 13},
  headerIcon: {alignItems: 'center', height: 40, justifyContent: 'center', width: 36},
  headerIconText: {color: colors.secondaryText, fontSize: 32, lineHeight: 36},
  profileButton: {
    borderColor: '#dbe1ff',
    borderRadius: 24,
    borderWidth: 2,
    padding: 1,
  },
  bottomBar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopColor: '#ececf4',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 66,
    justifyContent: 'space-around',
    paddingBottom: 3,
  },
  tab: {alignItems: 'center', flex: 1, justifyContent: 'center', gap: 1},
  tabIcon: {color: colors.secondaryText, fontSize: 24, fontWeight: '500', lineHeight: 28},
  tabIconActive: {color: colors.primaryBright},
  tabLabel: {color: colors.secondaryText, fontSize: 11},
  tabLabelActive: {color: colors.primaryBright},
  tabBadge: {
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 9,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    position: 'absolute',
    right: -11,
    top: -2,
  },
  tabBadgeText: {color: colors.surface, fontSize: 10, fontWeight: '700'},
  avatarWrap: {alignItems: 'center', justifyContent: 'center'},
  avatarImage: {borderRadius: 999},
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.onlineSoft,
    borderRadius: 999,
    justifyContent: 'center',
  },
  avatarInitials: {color: colors.online, fontWeight: '600'},
  onlineDot: {
    backgroundColor: colors.online,
    borderColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    height: 14,
    position: 'absolute',
    width: 14,
  },
  avatarOnlineDot: {right: -1, bottom: -1},
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: 28,
    flexDirection: 'row',
    height: 46,
    paddingHorizontal: 15,
  },
  searchGlyph: {color: colors.muted, fontSize: 25, marginRight: 10},
  searchInput: {color: colors.text, flex: 1, fontSize: 14, paddingVertical: 0},
  clearText: {color: colors.muted, fontSize: 24, paddingHorizontal: 4},
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionIcon: {color: colors.primary, fontSize: 22},
});
