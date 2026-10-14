import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
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
  IconButton,
  SearchField,
} from '../components/Common';
import {onlineFriends} from '../data';
import {
  filterConversations,
  getUnreadNotificationCount,
  useChat,
} from '../ChatContext';
import {colors, spacing} from '../theme';
import {ChatStackParamList, ConversationFilter} from '../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'Messages'>;

const filters: {value: ConversationFilter; label: string}[] = [
  {value: 'all', label: 'Tất cả'},
  {value: 'unread', label: 'Chưa đọc'},
  {value: 'groups', label: 'Nhóm'},
  {value: 'work', label: 'Công việc'},
];

export default function MessagesScreen({navigation}: Props) {
  const {conversations, notifications, contacts, startConversation} = useChat();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const visibleConversations = useMemo(
    () => filterConversations(conversations, filter, query),
    [conversations, filter, query],
  );
  const notificationCount = getUnreadNotificationCount(notifications);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <AppHeader
        title="Messages"
        navigation={navigation}
        onSearch={() => setFocused(true)}
      />
      <View style={styles.toolbar}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Đoạn chat</Text>
          <View style={styles.onlineCount}>
            <Text style={styles.onlineCountText}>8 trực tuyến</Text>
          </View>
        </View>
        <View style={styles.titleActions}>
          <IconButton
            icon="▧"
            label="Bắt đầu gọi video"
            onPress={() => Alert.alert('Cuộc gọi video', 'Chọn một người bạn để bắt đầu cuộc gọi.')}
          />
          <IconButton
            icon="↗"
            label="Soạn tin nhắn mới"
            onPress={() => navigation.navigate('Contacts')}
            style={styles.composeButton}
          />
        </View>
      </View>
      <View style={styles.searchWrap}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm kiếm cuộc trò chuyện, bạn bè..."
          autoFocus={focused}
        />
      </View>
      <View style={styles.filterRow}>
        {filters.map(item => {
          const active = filter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              accessibilityRole="button"
              accessibilityState={{selected: active}}
              onPress={() => setFilter(item.value)}
              style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.label}
              </Text>
              {item.value === 'unread' ? <View style={styles.unreadDot} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
      <FlatList
        data={visibleConversations}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.onlineSection}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionLabel}>BẠN BÈ TRỰC TUYẾN</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
                <Text style={styles.sectionLink}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {onlineFriends.map((friend, index) => (
                <TouchableOpacity
                  key={friend.id}
                  accessibilityRole="button"
                  onPress={() => {
                    const contact = contacts.find(item => item.name === friend.name);
                    if (contact) {
                      const id = startConversation(contact);
                      navigation.navigate('Conversation', {conversationId: id});
                    } else {
                      navigation.navigate('Contacts');
                    }
                  }}
                  style={styles.friendItem}>
                  <View style={[styles.friendAvatar, index > 0 && styles.friendRing]}>
                    <Avatar uri={friend.avatar} initials={friend.initials} size={58} online={index > 0} />
                    {index === 0 ? <View style={styles.addStory}><Text style={styles.addStoryText}>+</Text></View> : null}
                  </View>
                  <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => navigation.navigate('Conversation', {conversationId: item.id})}
            style={styles.conversationCard}>
            <Avatar uri={item.avatar} initials={item.initials} size={58} online={item.online} />
            <View style={styles.conversationCopy}>
              <View style={styles.conversationTitleRow}>
                <Text style={styles.conversationName} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.conversationTime, item.unread > 0 && styles.unreadTime]}>{item.time}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewText} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unread > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyGlyph}>⌕</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy hội thoại</Text>
            <Text style={styles.emptyDescription}>Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc hiện tại.</Text>
          </View>
        }
      />
      <BottomNavigation current="Messages" navigation={navigation} notificationCount={notificationCount} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.page,
    paddingTop: 14,
  },
  titleRow: {alignItems: 'center', flexDirection: 'row', gap: 9},
  title: {color: colors.text, fontSize: 25, fontWeight: '700', letterSpacing: -0.7},
  onlineCount: {backgroundColor: '#e5e9ff', borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5},
  onlineCountText: {color: colors.primary, fontSize: 12},
  titleActions: {flexDirection: 'row', gap: 8},
  composeButton: {backgroundColor: colors.primaryBright},
  searchWrap: {paddingHorizontal: spacing.page, paddingTop: 9},
  filterRow: {flexDirection: 'row', gap: 8, paddingHorizontal: spacing.page, paddingVertical: 12},
  filterChip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {backgroundColor: colors.primaryBright},
  filterText: {color: colors.secondaryText, fontSize: 13},
  filterTextActive: {color: colors.surface, fontWeight: '600'},
  unreadDot: {backgroundColor: colors.error, borderRadius: 4, height: 8, width: 8},
  listContent: {paddingBottom: 12, paddingHorizontal: spacing.page},
  onlineSection: {marginBottom: 12},
  sectionHeading: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12},
  sectionLabel: {color: colors.muted, fontSize: 11, letterSpacing: 0.3},
  sectionLink: {color: colors.primary, fontSize: 12},
  friendItem: {alignItems: 'center', marginRight: 14, width: 62},
  friendAvatar: {height: 62, justifyContent: 'center', width: 62},
  friendRing: {alignItems: 'center', borderColor: colors.primaryBright, borderRadius: 34, borderWidth: 2},
  friendName: {color: colors.secondaryText, fontSize: 11, marginTop: 4, textAlign: 'center', width: 65},
  addStory: {alignItems: 'center', backgroundColor: colors.primaryBright, borderColor: colors.surface, borderRadius: 12, borderWidth: 2, bottom: 0, height: 23, justifyContent: 'center', position: 'absolute', right: -1, width: 23},
  addStoryText: {color: colors.surface, fontSize: 18, lineHeight: 20},
  conversationCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 82,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  conversationCopy: {flex: 1, marginLeft: 12},
  conversationTitleRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'},
  conversationName: {color: colors.text, flex: 1, fontSize: 15, fontWeight: '600', marginRight: 8},
  conversationTime: {color: colors.muted, fontSize: 11},
  unreadTime: {color: colors.primary, fontWeight: '600'},
  previewRow: {alignItems: 'center', flexDirection: 'row', marginTop: 4},
  previewText: {color: colors.secondaryText, flex: 1, fontSize: 13},
  unreadBadge: {alignItems: 'center', backgroundColor: colors.error, borderRadius: 11, height: 22, justifyContent: 'center', marginLeft: 6, minWidth: 22},
  unreadBadgeText: {color: colors.surface, fontSize: 12, fontWeight: '700'},
  emptyState: {alignItems: 'center', paddingHorizontal: 30, paddingVertical: 50},
  emptyGlyph: {color: colors.muted, fontSize: 35},
  emptyTitle: {color: colors.text, fontSize: 17, fontWeight: '600', marginTop: 10},
  emptyDescription: {color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6, textAlign: 'center'},
});
