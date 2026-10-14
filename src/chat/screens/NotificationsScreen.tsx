import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
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
import {getUnreadNotificationCount, useChat} from '../ChatContext';
import {ChatNotification, ChatStackParamList} from '../types';
import {colors, spacing} from '../theme';

type Props = NativeStackScreenProps<ChatStackParamList, 'Notifications'>;
type NotificationRow =
  | {rowType: 'heading'; key: string; title: string; newCount: number}
  | {rowType: 'notification'; key: string; notification: ChatNotification};

const notificationGroups = [
  {title: 'HÔM NAY', ids: ['invite-minh-anh', 'mention-hoang', 'call-mai']},
  {title: 'TUẦN NÀY', ids: ['group-rn', 'invite-duc-thinh']},
  {title: 'CŨ HƠN', ids: ['security', 'backup']},
];

export default function NotificationsScreen({navigation}: Props) {
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    removeNotification,
  } = useChat();
  const [showUnread, setShowUnread] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState('');
  const unreadCount = getUnreadNotificationCount(notifications);
  const visibleNotifications = useMemo(
    () => {
      const term = query.trim().toLocaleLowerCase('vi');
      return notifications.filter(
        item =>
          (!showUnread || item.unread) &&
          (!term ||
            item.name.toLocaleLowerCase('vi').includes(term) ||
            item.body.toLocaleLowerCase('vi').includes(term)),
      );
    },
    [notifications, query, showUnread],
  );
  const rows = useMemo<NotificationRow[]>(
    () =>
      notificationGroups.flatMap(group => {
        const groupNotifications = visibleNotifications.filter(item =>
          group.ids.includes(item.id),
        );
        if (groupNotifications.length === 0) {
          return [];
        }
        return [
          {
            rowType: 'heading' as const,
            key: `heading-${group.title}`,
            title: group.title,
            newCount: groupNotifications.filter(item => item.unread).length,
          },
          ...groupNotifications.map(notification => ({
            rowType: 'notification' as const,
            key: notification.id,
            notification,
          })),
        ];
      }),
    [visibleNotifications],
  );

  const openNotification = (item: ChatNotification) => {
    markNotificationRead(item.id);
    if (item.kind === 'group') {
      navigation.navigate('Messages');
    } else if (item.kind === 'mention') {
      navigation.navigate('Conversation', {conversationId: 'design-team'});
    } else if (item.kind === 'missed-call') {
      Alert.alert('Cuộc gọi nhỡ', `Gọi lại ${item.name}?`, [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Gọi lại', onPress: () => Alert.alert('Đang gọi', `Đang gọi ${item.name}...`)},
      ]);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <AppHeader
        title="Notifications"
        navigation={navigation}
        onSearch={() => setSearchFocused(true)}
      />
      {searchFocused ? (
        <View style={styles.searchWrap}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm thông báo..."
            autoFocus
          />
        </View>
      ) : null}
      <View style={styles.titleRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Hoạt động mới</Text>
          {unreadCount > 0 ? <Text style={styles.unreadCount}>{unreadCount}</Text> : null}
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={markAllNotificationsRead}
          style={styles.readAll}>
          <Text style={styles.readAllGlyph}>✓✓</Text>
          <Text style={styles.readAllText}>Đọc tất cả</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.segment}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{selected: !showUnread}}
          onPress={() => setShowUnread(false)}
          style={[styles.segmentItem, !showUnread && styles.segmentActive]}>
          <Text style={[styles.segmentText, !showUnread && styles.segmentTextActive]}>
            Tất cả ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{selected: showUnread}}
          onPress={() => setShowUnread(true)}
          style={[styles.segmentItem, showUnread && styles.segmentActive]}>
          <Text style={[styles.segmentText, showUnread && styles.segmentTextActive]}>Chưa đọc</Text>
          <View style={styles.segmentDot} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={rows}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          if (item.rowType === 'heading') {
            return (
              <View style={styles.dateHeading}>
                <Text style={styles.dateHeadingText}>{item.title}</Text>
                {item.newCount > 0 ? <Text style={styles.dateCount}>{item.newCount} mới</Text> : null}
              </View>
            );
          }
          const notification = item.notification;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => openNotification(notification)}
              style={[
                styles.notificationCard,
                !notification.unread && styles.readCard,
              ]}>
              {notification.kind === 'security' ? (
                <View style={styles.securityAvatar}><Text style={styles.securityGlyph}>{notification.initials}</Text></View>
              ) : (
                <Avatar uri={notification.avatar} initials={notification.initials} size={48} />
              )}
              <View style={styles.notificationCopy}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationName}>{notification.name}</Text>
                  {notification.unread ? <View style={styles.unreadDot} /> : null}
                </View>
                <Text style={styles.notificationBody}>{notification.body}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
                {notification.kind === 'invite' && notification.id === 'invite-minh-anh' ? (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => {
                        removeNotification(notification.id);
                        Alert.alert('Đã chấp nhận', `Bạn đã kết nối với ${notification.name}.`);
                      }}
                      style={styles.acceptButton}>
                      <Text style={styles.acceptText}>Chấp nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeNotification(notification.id)} style={styles.laterButton}>
                      <Text style={styles.laterText}>Để sau</Text>
                    </TouchableOpacity>
                  </View>
                ) : notification.kind === 'mention' ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Conversation', {conversationId: 'design-team'})}
                    style={styles.inlineAction}>
                    <Text style={styles.inlineActionText}>↶  Trả lời</Text>
                  </TouchableOpacity>
                ) : notification.kind === 'missed-call' ? (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => Alert.alert('Đang gọi', `Đang gọi ${notification.name}...`)}
                      style={[styles.acceptButton, styles.callButton]}>
                      <Text style={styles.acceptText}>☎  Gọi lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Conversation', {conversationId: 'thu-thao'})}
                      style={styles.laterButton}>
                      <Text style={styles.laterText}>Nhắn tin</Text>
                    </TouchableOpacity>
                  </View>
                ) : notification.kind === 'group' ? (
                  <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={styles.inlineAction}>
                    <Text style={styles.inlineActionText}>Vào nhóm chat  →</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {!notification.unread ? <Text style={styles.readMark}>✓</Text> : null}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyTitle}>Bạn đã xem hết thông báo!</Text>
            <Text style={styles.emptyText}>Mọi tin nhắn, lời mời và thông báo cập nhật đều đã được xử lý gọn gàng.</Text>
          </View>
        }
      />
      <BottomNavigation current="Notifications" navigation={navigation} notificationCount={unreadCount} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  searchWrap: {paddingHorizontal: spacing.page, paddingTop: 8},
  titleRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.page, paddingTop: 17, paddingBottom: 14},
  titleGroup: {alignItems: 'center', flexDirection: 'row', gap: 8},
  title: {color: colors.text, fontSize: 22, fontWeight: '700'},
  unreadCount: {backgroundColor: colors.primaryBright, borderRadius: 11, color: colors.surface, fontSize: 11, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 6, paddingVertical: 2},
  readAll: {alignItems: 'center', backgroundColor: colors.surfaceLow, borderRadius: 18, flexDirection: 'row', gap: 5, paddingHorizontal: 11, paddingVertical: 8},
  readAllGlyph: {color: colors.primary, fontSize: 12, fontWeight: '700'},
  readAllText: {color: colors.primary, fontSize: 12},
  segment: {backgroundColor: colors.surfaceLow, borderRadius: 14, flexDirection: 'row', marginHorizontal: spacing.page, marginBottom: 12, padding: 4},
  segmentItem: {alignItems: 'center', borderRadius: 11, flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', minHeight: 34},
  segmentActive: {backgroundColor: colors.surface},
  segmentText: {color: colors.secondaryText, fontSize: 13},
  segmentTextActive: {color: colors.primary, fontWeight: '600'},
  segmentDot: {backgroundColor: colors.primaryBright, borderRadius: 4, height: 8, width: 8},
  listContent: {paddingBottom: 16, paddingHorizontal: spacing.page},
  dateHeading: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 8},
  dateHeadingText: {color: colors.secondaryText, fontSize: 11, fontWeight: '600', letterSpacing: 0.3},
  dateCount: {color: colors.muted, fontSize: 11},
  notificationCard: {alignItems: 'flex-start', backgroundColor: '#eef0ff', borderRadius: 19, flexDirection: 'row', marginBottom: 9, padding: 12},
  readCard: {backgroundColor: colors.surface},
  notificationCopy: {flex: 1, marginLeft: 10},
  notificationTitleRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'},
  notificationName: {color: colors.text, fontSize: 14, fontWeight: '600', flex: 1},
  notificationBody: {color: colors.secondaryText, fontSize: 12, lineHeight: 18, marginTop: 2},
  notificationTime: {color: colors.muted, fontSize: 10, marginTop: 4},
  unreadDot: {backgroundColor: colors.primaryBright, borderRadius: 5, height: 10, marginLeft: 6, width: 10},
  actions: {alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 10},
  acceptButton: {backgroundColor: colors.primaryBright, borderRadius: 15, paddingHorizontal: 12, paddingVertical: 7},
  acceptText: {color: colors.surface, fontSize: 11, fontWeight: '600'},
  callButton: {backgroundColor: colors.online},
  laterButton: {paddingHorizontal: 8, paddingVertical: 7},
  laterText: {color: colors.secondaryText, fontSize: 11},
  inlineAction: {alignSelf: 'flex-start', backgroundColor: '#dfe8ff', borderRadius: 14, marginTop: 9, paddingHorizontal: 11, paddingVertical: 7},
  inlineActionText: {color: colors.primary, fontSize: 11, fontWeight: '600'},
  readMark: {color: colors.muted, fontSize: 16, marginLeft: 5},
  securityAvatar: {alignItems: 'center', backgroundColor: '#e2eaff', borderRadius: 24, height: 48, justifyContent: 'center', width: 48},
  securityGlyph: {color: colors.primary, fontSize: 18},
  emptyState: {alignItems: 'center', padding: 40},
  emptyIcon: {color: colors.online, fontSize: 34},
  emptyTitle: {color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8},
  emptyText: {color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 5, textAlign: 'center'},
});
