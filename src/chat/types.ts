export type ChatMessage = {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  online: boolean;
  lastMessage: string;
  time: string;
  unread: number;
  category: 'friends' | 'groups' | 'work';
  messages: ChatMessage[];
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  status: string;
  online: boolean;
  avatar: string;
  initials: string;
};

export type ChatNotification = {
  id: string;
  name: string;
  body: string;
  time: string;
  avatar: string;
  initials: string;
  kind: 'invite' | 'mention' | 'missed-call' | 'group' | 'security';
  unread: boolean;
};

export type ConversationFilter = 'all' | 'unread' | 'groups' | 'work';

export type ChatStackParamList = {
  Login: undefined;
  Messages: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Settings: undefined;
  Conversation: {conversationId: string};
};
