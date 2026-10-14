import {
  ChatNotification,
  Contact,
  Conversation,
} from './types';

export const logoImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5IEXPYSabv3gkozCh2mXlVg0uYemLKpgSdCFx7rj8lAcrAEHZDR7iP7wXSDxe7PbqI9qG-IJmC6MmJOYt1m_XScs-HZ2d0D3FPHPSeinQunqRMEdZWnJP3xE2EJmMV8KSr53ZXdhOvTu7I-b3Qwh_bqFQIiK35jKyhzmBAL1V3uxyNm63K_ag5H5WY8zY2pvWJHFZf_eTw2HhoOY-nKNnqWsoWePUr5R5Z397l-6Y_ufmDjxFZm-';

const profileImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0rch9c93W22USqxQQDqendrYcpFMqXis_F-yy4GJKtAIgTdBiL3KDENHzNGuB9glURiknSycIoNTelofPvhkt2kZV7vSRznAJASOxyd85yelK7fNL6VIGwBEwexyPn6a1NCWluqaXoLPRcbK4OcyCZlAjlqCfBY4L36v13Uo3Z_-2svUujRRwOpEh090Zq4e0DUqA6dfxq0FcwGkCf2EnUjU68MFeNjG_awm8oUBi4RODXU7efEIZ';
const imageOne =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBtt76ZVJ0QEjzZRvdZmUqbvm0ApBp_BKwbcGKUZOShBkLJfGFT6hjzGVHfMEbDSGDE1k2vtfMGDoeUKl-n0gbcM1vgcHNt2uJM_26bHeAgLVWV2_PHRlIDIN3tsnWmAMEt50E8PjDdUpeRyQDHHe8le6UxHgNcWjy1I-A587Jc25oCIKf5VQq79uPp3K-rH_D3zvbwKP0VFzboLhbYXlPRFvFUM2zjYPR-FHyIJ9OVNI-JSEZjnv7M';
const imageTwo =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHr8rAP6K2p6znQ6NFHnyallstWegO2XVJDBJnLIbLdT-7zJyH00HWq5LPYyDjRHt4jtvwI-hWo1zI6JZ1G_bFwaaLdyx-UYyCMmPKMnVsXQp02f_OCLdxT__jd0jjig2dLF-L3050nmtnI1X_NQ4yuxzMeRzLc5GLvVrOL6Q-EkpEpu0XHWGOxUHbQlL5bVWVyTaBOqlq7QvzpXLhsCZOXgCNMrBVKmniylrp4d2lLoTR9hotBw_u';
const imageThree =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDNhm1YqHX7jmkQ-2KTmlIIckRqehR4M1Fh2RyuUt0x7WH7hq4sa32vXfFcpkP3Se2lvdJfFr23nK1tY1SerISwBvomqObPql9elNPUdtSVu3ekpnbXt_wJkVdN4uohNVt7g8ql_nVnnxEMPAuJ514cB_MwciBtg86ZnNPthnMB9_nXeiVIqWdndXgYABe20gLuPSMskoy5j7Z_tu2TQg1Q-GtPXG2sLHVVAbmjCPjEGGfWyncsY1gc';
const imageFour =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC1nilaRCJq6TPWnWVZaL78PslOpdWq58y7jQ-kuq5V37i-ZsTVoACvkolOL29_p2iMon28Fjx7XEa4wMcacqfQsFi9mkgj3sKpJQTI3-89fq97CdUFizZUTran3rOWVC0HiuttwfXA5FFoo9vuR6IWTA-OGOFj0bk2ferxD31RFwClo-nF52lhzxFv1vFNjpoONxzYH3RBqdTu9mu_aI6jZQoNjzmLpx5kn2rXhqLbRf620vWGYUdN';
const imageFive =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBrwcurz615NQQV5Y61ncHO7e6Vgah47PQ2hq10f_L26QkjEHuTiTLfsRbgLv5XIMeDgg4HuSZLEjPyFmC0TGETiA6ILWd8lx9zzU5T-rr0yVXiNI_6jgLq7vWy60-9vlVi40KCcWWRCda77KrdQhBZfvqBP5o1Rw2UdV1EWOn7fkJZimZKAbtoZdSS17myy_Uqu9KZ-LdQT-bMqGlsmBVe_l7DDP9lj-BKk85QKV05xNUbSr4XzOfv';
const imageSix =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zBw6YsXWapRjf81ue_MzIXoFN2rHvZUApV4E2Hi7ew2p7lYbdaPeaa7ONnYFRsmTE2ONUNQHG-I_jDOpCj_NLhk55o7LabcDQ0p_RcRNBn8F6pgWuOfiY45ryNdnZQ8gKCdExRebnrLmz1cLL5XplaAnLTeonpEhUWKGScOLRb4elYrIqriuFjCX4HJBDdZZRj5_Bqo2r-tHDqmQ4SSKIMoZf6GIm2GWHOBXNpd8NddgwmL4kkNk';
const imageSeven =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAcSuNeipcuWpsdR4xL415ytj1aRbYnnhvjF6b7CpQiefFvKtgwfMmg5hYwznpSy47hEPyER2CPNhlQnd1VrZ7ua-ZnLIpjUyQPDvVWZP2Hgg5Zi6K5P0n5z_u8LpvLk9ax5rKTy0MNwjQEgMCEA0XRrH6cNSggOil3C9uW2yV52a4uieW5kahMXYze4Ay19snGOTAObkoDbfpn9JHfTmcXXUtBpg3cYQAjTR-qIW3-IqJ3TfxuB363';
const imageEight =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDzGq4MAnwKAOrGlv6G2UQOFw3X674GgWmUE-3ApKrxYb0G7aZGj02wtAJPvHSlTnTfi8zMrwMrL7pPkxH47wMsLE9VTekT7C6qni2MROjdZ-XYP3xvJS_-DrSmU-Uf6oXgpTjgZ-96AXEIbNJRNjk5PX3t5VoKsiek_QHOrEv0WcAP4h4KEslKXQqDu2lZrOrhl3Frie56GvmVk46o4NOr1MenAuJ9qIhjR_t3EzyWOVCioNvjenwj';
const imageNine =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGt1mntriJeNiAc2581MjFR9-rG__1K9b1JB3cfNNnzvIymcGShSuqUhEL5SE3P2uEilb3qzjWmfNnjFMDRsU4MyMk2VwytRuDwg5OWml9In6SIICfGYwVmUtGYASEbZWCoR7-ZAzPP-EUAFDKYv5EpzML4RvaJAf90wY3OozQGNA8svMb08rCI0RiPicBKuuJvA0q9Mu0JLpD03qpmsA4yOFkjWs5YdU-PqschRc1d36wXmcs5b-l';

export const profile = {
  name: 'Nguyễn Văn Nam',
  handle: '@namnguyen.dev',
  email: 'nam.nguyen@pulsechat.io',
  phone: '+84 987 654 321',
  avatar: profileImage,
};

export const onlineFriends = [
  {id: 'self', name: 'Tin của bạn', avatar: profileImage, initials: 'N'},
  {id: 'linh-dan', name: 'Linh Đan', avatar: imageOne, initials: 'LĐ'},
  {id: 'minh-quan', name: 'Minh Quân', avatar: imageTwo, initials: 'MQ'},
  {id: 'hoang-nam', name: 'Hoàng Nam', avatar: imageThree, initials: 'HN'},
  {id: 'thu-thao', name: 'Thu Thảo', avatar: imageFour, initials: 'TT'},
  {id: 'tuan-kiet', name: 'Tuấn Kiệt', avatar: imageFive, initials: 'TK'},
];

export const initialConversations: Conversation[] = [
  {
    id: 'linh-dan',
    name: 'Linh Đan',
    avatar: imageOne,
    initials: 'LĐ',
    online: true,
    lastMessage: 'Tối nay đi cafe bàn về React Native nhé 👍',
    time: '10:45',
    unread: 3,
    category: 'friends',
    messages: [
      {id: 'ld-1', text: 'Cậu xem bản prototype mới chưa?', sender: 'them', time: '10:40'},
      {id: 'ld-2', text: 'Mình vừa xem xong, giao diện mượt lắm!', sender: 'me', time: '10:42'},
      {id: 'ld-3', text: 'Tối nay đi cafe bàn về React Native nhé 👍', sender: 'them', time: '10:45'},
    ],
  },
  {
    id: 'core-team',
    name: 'Core Team React Native 🚀',
    avatar: imageSix,
    initials: 'CT',
    online: true,
    lastMessage: 'Hoàng: Dự án đã hoàn thành rồi bạn nhé!',
    time: '09:12',
    unread: 5,
    category: 'groups',
    messages: [
      {id: 'ct-1', text: 'Mọi người đã đẩy bản build mới lên chưa?', sender: 'me', time: '09:05'},
      {id: 'ct-2', text: 'Dự án đã hoàn thành rồi bạn nhé!', sender: 'them', time: '09:12'},
    ],
  },
  {
    id: 'minh-quan',
    name: 'Minh Quân (Lead Dev)',
    avatar: imageTwo,
    initials: 'MQ',
    online: true,
    lastMessage: '▣  [Hình ảnh] Giao diện prototype mới',
    time: '08:30',
    unread: 1,
    category: 'work',
    messages: [
      {id: 'mq-1', text: 'Anh vừa gửi giao diện prototype mới nhé.', sender: 'them', time: '08:30'},
    ],
  },
  {
    id: 'thu-thao',
    name: 'Thu Thảo PM',
    avatar: imageFour,
    initials: 'TT',
    online: false,
    lastMessage: '🎙 Tin nhắn thoại (0:42)',
    time: 'Hôm qua',
    unread: 0,
    category: 'work',
    messages: [
      {id: 'tt-1', text: 'Mai mình họp lúc 9 giờ nhé.', sender: 'them', time: 'Hôm qua'},
    ],
  },
  {
    id: 'design-team',
    name: 'Thiết Kế Sản Phẩm UI/UX 🎨',
    avatar: imageSeven,
    initials: 'UX',
    online: false,
    lastMessage: 'Bạn: Đã gửi bản review design tokens lên Figma',
    time: 'Hôm qua',
    unread: 0,
    category: 'groups',
    messages: [
      {id: 'ux-1', text: 'Đã gửi bản review design tokens lên Figma', sender: 'me', time: 'Hôm qua'},
    ],
  },
  {
    id: 'hoang-nam',
    name: 'Hoàng Nam Senior',
    avatar: imageThree,
    initials: 'HN',
    online: true,
    lastMessage: 'Cảm ơn Nam, mai mình merge pull request nhé!',
    time: 'T4',
    unread: 0,
    category: 'work',
    messages: [
      {id: 'hn-1', text: 'Cảm ơn Nam, mai mình merge pull request nhé!', sender: 'them', time: 'T4'},
    ],
  },
  {
    id: 'tuan-kiet',
    name: 'Tuấn Kiệt Research',
    avatar: imageFive,
    initials: 'TK',
    online: false,
    lastMessage: 'Kết quả phỏng vấn người dùng đã được tổng hợp xong.',
    time: '20 Th02',
    unread: 0,
    category: 'work',
    messages: [
      {id: 'tk-1', text: 'Kết quả phỏng vấn người dùng đã được tổng hợp xong.', sender: 'them', time: '20:15'},
    ],
  },
  {
    id: 'family',
    name: 'Gia Đình Thân Yêu ❤️',
    avatar: imageEight,
    initials: 'GĐ',
    online: false,
    lastMessage: 'Mẹ: Cuối tuần này về ăn cơm với cả nhà nhé con!',
    time: '18 Th02',
    unread: 0,
    category: 'friends',
    messages: [
      {id: 'gd-1', text: 'Cuối tuần này về ăn cơm với cả nhà nhé con!', sender: 'them', time: '18:02'},
    ],
  },
];

export const initialContacts: Contact[] = [
  {id: 'an-nguyen', name: 'An Nguyễn', phone: '090 123 4567', status: 'Đang hoạt động', online: true, avatar: imageThree, initials: 'AN'},
  {id: 'anh-duong', name: 'Ánh Dương', phone: '090 234 5678', status: 'Hoạt động 15 phút trước', online: false, avatar: imageNine, initials: 'AD'},
  {id: 'bao-tram', name: 'Bảo Trâm', phone: '090 345 6789', status: 'Đang hoạt động', online: true, avatar: imageFour, initials: 'BT'},
  {id: 'binh-minh', name: 'Bình Minh', phone: '090 456 7890', status: 'Ngoại tuyến', online: false, avatar: '', initials: 'BM'},
  {id: 'cuong-pham', name: 'Cường Phạm', phone: '090 567 8901', status: 'Đang hoạt động', online: true, avatar: imageFive, initials: 'CP'},
  {id: 'diem-my', name: 'Diễm My', phone: '090 678 9012', status: 'Hoạt động 2 giờ trước', online: false, avatar: imageSeven, initials: 'DM'},
  {id: 'hoang-nam', name: 'Hoàng Nam', phone: '090 789 0123', status: 'Đang hoạt động', online: true, avatar: imageThree, initials: 'HN'},
  {id: 'lan-anh', name: 'Lan Anh', phone: '090 890 1234', status: 'Đang hoạt động', online: true, avatar: imageOne, initials: 'LA'},
  {id: 'linh-dan', name: 'Linh Đan', phone: '090 321 6547', status: 'Đang hoạt động', online: true, avatar: imageOne, initials: 'LĐ'},
  {id: 'minh-quan', name: 'Minh Quân', phone: '090 246 8135', status: 'Đang hoạt động', online: true, avatar: imageTwo, initials: 'MQ'},
  {id: 'thu-thao', name: 'Thu Thảo', phone: '090 135 7924', status: 'Hoạt động 1 giờ trước', online: false, avatar: imageFour, initials: 'TT'},
  {id: 'tuan-kiet', name: 'Tuấn Kiệt', phone: '090 864 2097', status: 'Ngoại tuyến', online: false, avatar: imageFive, initials: 'TK'},
];

export const initialNotifications: ChatNotification[] = [
  {id: 'invite-minh-anh', name: 'Minh Anh', body: 'Đã gửi lời mời kết bạn từ danh bạ đồng bộ.', time: '5 phút trước · Bạn chung: 8', avatar: imageNine, initials: 'MA', kind: 'invite', unread: true},
  {id: 'mention-hoang', name: 'Hoàng Nam', body: 'Đã nhắc đến bạn trong UI/UX Design Team: “@Huy cậu kiểm tra lại flow checkout nhé!”', time: '28 phút trước', avatar: imageThree, initials: 'HN', kind: 'mention', unread: true},
  {id: 'call-mai', name: 'Mai Linh', body: 'Cuộc gọi thoại nhỡ (2 cuộc)', time: '1 giờ trước', avatar: imageFour, initials: 'ML', kind: 'missed-call', unread: true},
  {id: 'group-rn', name: 'React Native Vietnam', body: 'Bạn có 15 tin nhắn chưa đọc và 2 file tài liệu đính kèm vừa được chia sẻ.', time: 'Hôm qua lúc 19:45', avatar: imageSix, initials: 'RN', kind: 'group', unread: true},
  {id: 'invite-duc-thinh', name: 'Đức Thịnh', body: 'đã chấp nhận lời mời kết bạn của bạn. Hai bạn đã kết nối trên PulseChat, hãy bắt đầu trò chuyện ngay!', time: '3 ngày trước', avatar: imageSeven, initials: 'ĐT', kind: 'invite', unread: false},
  {id: 'security', name: 'Bảo mật tài khoản', body: 'Đăng nhập thành công từ thiết bị mới (iPhone 15 Pro, TP. Hồ Chí Minh).', time: '1 tuần trước', avatar: '', initials: '✓', kind: 'security', unread: false},
  {id: 'backup', name: 'Sao lưu tin nhắn', body: 'Bản sao lưu tin nhắn tự động hàng tuần đã hoàn tất (1.2 GB).', time: '2 tuần trước', avatar: '', initials: '☁', kind: 'security', unread: false},
];

export const settingDefaults = {
  twoFactor: true,
  sound: true,
  push: true,
  darkMode: false,
};
