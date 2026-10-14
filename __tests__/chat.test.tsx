import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import {ChatProvider, filterConversations, getUnreadNotificationCount, useChat} from '../src/chat/ChatContext';
import {initialConversations, initialNotifications} from '../src/chat/data';
import {canContinueWithCredentials} from '../src/chat/login';

test('accepts arbitrary non-empty login credentials', () => {
  expect(canContinueWithCredentials('not-an-email', '123')).toBe(true);
  expect(canContinueWithCredentials('  ', '123')).toBe(false);
  expect(canContinueWithCredentials('user', '  ')).toBe(false);
});

test('filters conversations by unread status, category, and Vietnamese text', () => {
  expect(filterConversations(initialConversations, 'unread', '')).toHaveLength(3);
  expect(filterConversations(initialConversations, 'groups', '')).toHaveLength(2);
  expect(filterConversations(initialConversations, 'all', 'linh đan').map(item => item.id)).toEqual(['linh-dan']);
});

test('counts unread sample notifications', () => {
  expect(getUnreadNotificationCount(initialNotifications)).toBe(4);
});

test('sending a message updates its conversation preview and message list', async () => {
  function MessageProbe() {
    const {conversations, sendMessage} = useChat();
    const conversation = conversations.find(item => item.id === 'linh-dan');
    return (
      <>
        <Text testID="message-count">{conversation?.messages.length}</Text>
        <Text testID="last-message">{conversation?.lastMessage}</Text>
        <TouchableOpacity
          testID="send"
          onPress={() => sendMessage('linh-dan', 'Tin nhắn mới từ bài kiểm thử')}
        />
      </>
    );
  }

  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ChatProvider>
        <MessageProbe />
      </ChatProvider>,
    );
  });
  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({testID: 'send'}).props.onPress();
  });
  expect(renderer?.root.findByProps({testID: 'message-count'}).props.children).toBe(4);
  expect(renderer?.root.findByProps({testID: 'last-message'}).props.children).toBe(
    'Tin nhắn mới từ bài kiểm thử',
  );
});
