import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Avatar, IconButton} from '../components/Common';
import {useChat} from '../ChatContext';
import {colors, spacing} from '../theme';
import {ChatMessage, ChatStackParamList} from '../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'Conversation'>;

export default function ConversationScreen({navigation, route}: Props) {
  const {conversationId} = route.params;
  const {conversations, sendMessage, markConversationRead} = useChat();
  const conversation = conversations.find(item => item.id === conversationId);
  const [draft, setDraft] = useState('');
  const messageList = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    markConversationRead(conversationId);
  }, [conversationId, markConversationRead]);

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backFallback}>
          <Text style={styles.backText}>‹  Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.missingText}>Không tìm thấy cuộc trò chuyện.</Text>
      </SafeAreaView>
    );
  }

  const submitMessage = () => {
    const text = draft.trim();
    if (!text) {
      Alert.alert('Tin nhắn trống', 'Nhập nội dung trước khi gửi.');
      return;
    }
    sendMessage(conversation.id, text);
    setDraft('');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Avatar uri={conversation.avatar} initials={conversation.initials} size={42} online={conversation.online} />
          <View style={styles.headerCopy}>
            <Text style={styles.personName} numberOfLines={1}>{conversation.name}</Text>
            <Text style={styles.personStatus}>{conversation.online ? 'Đang hoạt động' : 'Hoạt động gần đây'}</Text>
          </View>
          <IconButton
            icon="☎"
            label="Gọi thoại"
            onPress={() => Alert.alert('Cuộc gọi thoại', `Đang gọi ${conversation.name}...`)}
            style={styles.headerAction}
          />
          <IconButton
            icon="▣"
            label="Gọi video"
            onPress={() => Alert.alert('Cuộc gọi video', `Đang gọi video ${conversation.name}...`)}
            style={styles.headerAction}
          />
        </View>
        <View style={styles.dateDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dateText}>Hôm nay</Text>
          <View style={styles.dividerLine} />
        </View>
        <FlatList
          ref={messageList}
          data={conversation.messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => messageList.current?.scrollToEnd({animated: true})}
          renderItem={({item}) => (
            <View style={[styles.messageRow, item.sender === 'me' && styles.messageRowMine]}>
              <View style={[styles.bubble, item.sender === 'me' ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.messageText, item.sender === 'me' && styles.messageTextMine]}>
                  {item.text}
                </Text>
                <Text style={[styles.messageTime, item.sender === 'me' && styles.messageTimeMine]}>
                  {item.time}{item.sender === 'me' ? '  ✓✓' : ''}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Avatar uri={conversation.avatar} initials={conversation.initials} size={72} online={conversation.online} />
              <Text style={styles.emptyTitle}>Bắt đầu trò chuyện với {conversation.name}</Text>
              <Text style={styles.emptyHint}>Hãy gửi lời chào đầu tiên nhé!</Text>
            </View>
          }
        />
        <View style={styles.composer}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Đính kèm tệp"
            onPress={() => Alert.alert('Đính kèm', 'Chia sẻ ảnh và tệp sẽ được hỗ trợ khi kết nối dịch vụ.')}
            style={styles.attachButton}>
            <Text style={styles.attachGlyph}>＋</Text>
          </TouchableOpacity>
          <TextInput
            accessibilityLabel="Nhập tin nhắn"
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submitMessage}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.muted}
            returnKeyType="send"
            style={styles.messageInput}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={draft.trim() ? 'Gửi tin nhắn' : 'Ghi âm tin nhắn'}
            onPress={draft.trim() ? submitMessage : () => Alert.alert('Tin nhắn thoại', 'Nhấn giữ để ghi âm tin nhắn thoại.')}
            style={[styles.sendButton, draft.trim() && styles.sendButtonActive]}>
            <Text style={styles.sendGlyph}>{draft.trim() ? '➤' : '♫'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  keyboard: {flex: 1},
  header: {alignItems: 'center', backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', minHeight: 60, paddingHorizontal: 8},
  backButton: {alignItems: 'center', height: 42, justifyContent: 'center', marginRight: 3, width: 35},
  backText: {color: colors.primary, fontSize: 36, lineHeight: 38},
  headerCopy: {flex: 1, marginLeft: 9},
  personName: {color: colors.text, fontSize: 14, fontWeight: '700'},
  personStatus: {color: colors.online, fontSize: 11, marginTop: 2},
  headerAction: {backgroundColor: 'transparent', height: 40, width: 38},
  dateDivider: {alignItems: 'center', flexDirection: 'row', gap: 12, paddingHorizontal: spacing.page, paddingTop: 17},
  dividerLine: {backgroundColor: '#e2e5f0', flex: 1, height: StyleSheet.hairlineWidth},
  dateText: {color: colors.muted, fontSize: 11},
  messageList: {flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 16, paddingVertical: 15},
  messageRow: {alignItems: 'flex-start', marginBottom: 11},
  messageRowMine: {alignItems: 'flex-end'},
  bubble: {borderRadius: 18, maxWidth: '82%', paddingHorizontal: 13, paddingTop: 10, paddingBottom: 7},
  bubbleTheirs: {backgroundColor: colors.surface, borderBottomLeftRadius: 5},
  bubbleMine: {backgroundColor: colors.primaryBright, borderBottomRightRadius: 5},
  messageText: {color: colors.text, fontSize: 14, lineHeight: 20},
  messageTextMine: {color: colors.surface},
  messageTime: {color: colors.muted, fontSize: 9, marginTop: 4, textAlign: 'right'},
  messageTimeMine: {color: '#dbe5ff'},
  emptyChat: {alignItems: 'center', paddingHorizontal: 28, paddingVertical: 30},
  emptyTitle: {color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 14, textAlign: 'center'},
  emptyHint: {color: colors.muted, fontSize: 12, marginTop: 5},
  composer: {alignItems: 'center', backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: 8, paddingHorizontal: 11, paddingVertical: 10},
  attachButton: {alignItems: 'center', height: 40, justifyContent: 'center', width: 34},
  attachGlyph: {color: colors.primary, fontSize: 26},
  messageInput: {backgroundColor: colors.surfaceLow, borderRadius: 22, color: colors.text, flex: 1, fontSize: 14, maxHeight: 90, minHeight: 42, paddingHorizontal: 15, paddingVertical: 9},
  sendButton: {alignItems: 'center', backgroundColor: colors.surfaceLow, borderRadius: 21, height: 42, justifyContent: 'center', width: 42},
  sendButtonActive: {backgroundColor: colors.primaryBright},
  sendGlyph: {color: colors.primary, fontSize: 18},
  missingText: {color: colors.text, margin: 20},
  backFallback: {padding: 12},
});
