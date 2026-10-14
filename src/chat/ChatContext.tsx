import React, {createContext, useContext, useMemo, useState} from 'react';
import {
  initialContacts,
  initialConversations,
  initialNotifications,
  settingDefaults,
} from './data';
import {
  ChatNotification,
  Contact,
  Conversation,
  ConversationFilter,
} from './types';

type ChatContextValue = {
  conversations: Conversation[];
  contacts: Contact[];
  notifications: ChatNotification[];
  settings: typeof settingDefaults;
  sendMessage: (conversationId: string, text: string) => void;
  startConversation: (contact: Contact) => string;
  markConversationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  toggleSetting: (key: keyof typeof settingDefaults) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function getCurrentTime() {
  return new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatProvider({children}: React.PropsWithChildren) {
  const [conversations, setConversations] = useState(initialConversations);
  const [contacts] = useState(initialContacts);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState(settingDefaults);

  const value = useMemo<ChatContextValue>(
    () => ({
      conversations,
      contacts,
      notifications,
      settings,
      sendMessage: (conversationId, rawText) => {
        const text = rawText.trim();
        if (!text) {
          return;
        }
        const time = getCurrentTime();
        setConversations(current =>
          current.map(conversation =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  lastMessage: text,
                  time,
                  unread: 0,
                  messages: [
                    ...conversation.messages,
                    {id: `${conversationId}-${Date.now()}`, text, sender: 'me', time},
                  ],
                }
              : conversation,
          ),
        );
      },
      startConversation: contact => {
        const existing = conversations.find(
          conversation =>
            conversation.id === contact.id || conversation.name === contact.name,
        );
        if (existing) {
          return existing.id;
        }
        const conversation: Conversation = {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
          initials: contact.initials,
          online: contact.online,
          lastMessage: 'Bắt đầu trò chuyện ngay',
          time: 'Mới',
          unread: 0,
          category: 'friends',
          messages: [],
        };
        setConversations(current => [conversation, ...current]);
        return conversation.id;
      },
      markConversationRead: id =>
        setConversations(current => {
          if (!current.some(conversation => conversation.id === id && conversation.unread > 0)) {
            return current;
          }
          return current.map(conversation =>
            conversation.id === id ? {...conversation, unread: 0} : conversation,
          );
        }),
      markAllNotificationsRead: () =>
        setNotifications(current =>
          current.map(notification => ({...notification, unread: false})),
        ),
      markNotificationRead: id =>
        setNotifications(current =>
          current.map(notification =>
            notification.id === id ? {...notification, unread: false} : notification,
          ),
        ),
      removeNotification: id =>
        setNotifications(current =>
          current.filter(notification => notification.id !== id),
        ),
      toggleSetting: key =>
        setSettings(current => ({...current, [key]: !current[key]})),
    }),
    [contacts, conversations, notifications, settings],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error('useChat must be used inside ChatProvider.');
  }
  return value;
}

export function getUnreadNotificationCount(notifications: ChatNotification[]) {
  return notifications.filter(notification => notification.unread).length;
}

export function filterConversations(
  conversations: Conversation[],
  filter: ConversationFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase('vi');
  return conversations.filter(conversation => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && conversation.unread > 0) ||
      (filter === 'groups' && conversation.category === 'groups') ||
      (filter === 'work' && conversation.category === 'work');
    const matchesQuery =
      !normalizedQuery ||
      conversation.name.toLocaleLowerCase('vi').includes(normalizedQuery) ||
      conversation.lastMessage.toLocaleLowerCase('vi').includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });
}
