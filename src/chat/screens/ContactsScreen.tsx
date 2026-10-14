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
  IconButton,
  SearchField,
} from '../components/Common';
import {getUnreadNotificationCount, useChat} from '../ChatContext';
import {colors, spacing} from '../theme';
import {ChatStackParamList, Contact} from '../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'Contacts'>;
type ContactFilter = 'all' | 'online' | 'recent';
type ContactRow = {key: string; type: 'letter'; letter: string} | {key: string; type: 'contact'; contact: Contact};

export default function ContactsScreen({navigation}: Props) {
  const {contacts, notifications, startConversation} = useChat();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [filter, setFilter] = useState<ContactFilter>('all');
  const visibleContacts = useMemo(() => {
    const recentIds = new Set(['linh-dan', 'minh-quan', 'hoang-nam', 'thu-thao', 'tuan-kiet']);
    return contacts
      .filter(contact => {
        const term = query.trim().toLocaleLowerCase('vi');
        const matchesText =
          !term ||
          contact.name.toLocaleLowerCase('vi').includes(term) ||
          contact.phone.includes(term);
        const matchesFilter =
          filter === 'all' ||
          (filter === 'online' && contact.online) ||
          (filter === 'recent' && recentIds.has(contact.id));
        return matchesText && matchesFilter;
      })
      .sort((first, second) => first.name.localeCompare(second.name, 'vi'));
  }, [contacts, filter, query]);
  const rows = useMemo<ContactRow[]>(() => {
    const result: ContactRow[] = [];
    let lastLetter = '';
    visibleContacts.forEach(contact => {
      const letter = contact.name.charAt(0).toLocaleUpperCase('vi');
      if (letter !== lastLetter) {
        result.push({key: `letter-${letter}`, type: 'letter', letter});
        lastLetter = letter;
      }
      result.push({key: contact.id, type: 'contact', contact});
    });
    return result;
  }, [visibleContacts]);
  const unreadCount = getUnreadNotificationCount(notifications);

  const openChat = (contact: Contact) => {
    const conversationId = startConversation(contact);
    navigation.navigate('Conversation', {conversationId});
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <AppHeader title="Contacts" navigation={navigation} onSearch={() => setFocused(true)} />
      <View style={styles.titleRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Danh bạ</Text>
          <Text style={styles.count}>142</Text>
        </View>
        <IconButton
          icon="＋"
          label="Thêm liên hệ"
          onPress={() =>
            Alert.alert('Thêm liên hệ', 'Liên hệ mới có thể được tìm kiếm theo tên hoặc số điện thoại.')
          }
          style={styles.addButton}
        />
      </View>
      <View style={styles.searchWrap}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tên hoặc số điện thoại..."
          autoFocus={focused}
        />
      </View>
      <View style={styles.quickRow}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() =>
            Alert.alert('Lời mời kết bạn', 'Bạn có 2 lời mời kết bạn đang chờ xác nhận.')
          }
          style={styles.quickCard}>
          <View style={[styles.quickIcon, styles.quickBlue]}><Text style={styles.quickGlyph}>♙+</Text></View>
          <Text style={styles.quickTitle}>Lời mời</Text>
          <Text style={styles.quickSubtitle}>2 mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setFilter('recent')}
          style={styles.quickCard}>
          <View style={[styles.quickIcon, styles.quickGreen]}><Text style={styles.quickGlyph}>◷</Text></View>
          <Text style={styles.quickTitle}>Gần đây</Text>
          <Text style={styles.quickSubtitle}>18 bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() =>
            Alert.alert('Nhóm chung', 'Bạn đang tham gia 8 nhóm cùng bạn bè.')
          }
          style={styles.quickCard}>
          <View style={[styles.quickIcon, styles.quickPurple]}><Text style={styles.quickGlyph}>♟</Text></View>
          <Text style={styles.quickTitle}>Nhóm chung</Text>
          <Text style={styles.quickSubtitle}>8 nhóm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        {([
          ['all', 'Tất cả'],
          ['online', 'Đang hoạt động'],
          ['recent', 'Gần đây'],
        ] as const).map(([value, label]) => (
          <TouchableOpacity
            key={value}
            onPress={() => setFilter(value)}
            style={[styles.filterChip, filter === value && styles.filterActive]}>
            <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={rows}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) =>
          item.type === 'letter' ? (
            <Text style={styles.letter}>{item.letter}</Text>
          ) : (
            <View style={styles.contactCard}>
              <Avatar uri={item.contact.avatar} initials={item.contact.initials} size={54} online={item.contact.online} />
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => openChat(item.contact)}
                style={styles.contactCopy}>
                <Text style={styles.contactName}>{item.contact.name}</Text>
                <Text style={[styles.contactStatus, item.contact.online && styles.onlineText]}>
                  {item.contact.online ? '● ' : ''}{item.contact.status}
                </Text>
              </TouchableOpacity>
              <IconButton
                icon={item.contact.online ? '☎' : '▣'}
                label={`Gọi ${item.contact.name}`}
                onPress={() =>
                  Alert.alert('Bắt đầu cuộc gọi', `Đang gọi ${item.contact.name}...`)
                }
                style={styles.contactAction}
              />
              <IconButton
                icon="▤"
                label={`Nhắn tin cho ${item.contact.name}`}
                onPress={() => openChat(item.contact)}
                style={styles.contactAction}
              />
            </View>
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⌕</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy liên hệ</Text>
            <Text style={styles.emptyText}>Vui lòng thử lại với tên hoặc số điện thoại khác.</Text>
          </View>
        }
      />
      <BottomNavigation current="Contacts" navigation={navigation} notificationCount={unreadCount} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  titleRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.page, paddingTop: 19},
  titleGroup: {alignItems: 'center', flexDirection: 'row', gap: 9},
  title: {color: colors.text, fontSize: 25, fontWeight: '700'},
  count: {backgroundColor: '#e5e9ff', borderRadius: 13, color: colors.secondaryText, fontSize: 12, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 4},
  addButton: {backgroundColor: colors.primaryBright},
  searchWrap: {paddingHorizontal: spacing.page, paddingTop: 10},
  quickRow: {flexDirection: 'row', gap: 10, paddingHorizontal: spacing.page, paddingTop: 14},
  quickCard: {alignItems: 'center', backgroundColor: colors.surface, borderRadius: 18, flex: 1, paddingVertical: 12},
  quickIcon: {alignItems: 'center', borderRadius: 22, height: 44, justifyContent: 'center', width: 44},
  quickBlue: {backgroundColor: '#e5ecff'},
  quickGreen: {backgroundColor: '#e6f2f0'},
  quickPurple: {backgroundColor: '#efedff'},
  quickGlyph: {color: colors.primary, fontSize: 20, fontWeight: '700'},
  quickTitle: {color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 7},
  quickSubtitle: {color: colors.primary, fontSize: 11, marginTop: 2},
  filterRow: {flexDirection: 'row', gap: 8, paddingHorizontal: spacing.page, paddingVertical: 12},
  filterChip: {backgroundColor: colors.surfaceLow, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6},
  filterActive: {backgroundColor: colors.primaryBright},
  filterText: {color: colors.secondaryText, fontSize: 11},
  filterTextActive: {color: colors.surface},
  listContent: {paddingBottom: 14, paddingHorizontal: spacing.page},
  letter: {color: colors.primary, fontSize: 18, fontWeight: '700', marginBottom: 8, marginTop: 10},
  contactCard: {alignItems: 'center', backgroundColor: colors.surface, borderRadius: 18, flexDirection: 'row', marginBottom: 8, minHeight: 76, paddingHorizontal: 11},
  contactCopy: {flex: 1, marginLeft: 11},
  contactName: {color: colors.text, fontSize: 15, fontWeight: '600'},
  contactStatus: {color: colors.muted, fontSize: 12, marginTop: 4},
  onlineText: {color: colors.online},
  contactAction: {backgroundColor: 'transparent', height: 38, width: 38},
  emptyState: {alignItems: 'center', padding: 35},
  emptyIcon: {color: colors.muted, fontSize: 32},
  emptyTitle: {color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8},
  emptyText: {color: colors.muted, fontSize: 13, marginTop: 4, textAlign: 'center'},
});
