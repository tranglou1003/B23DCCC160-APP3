# PulseChat

Ứng dụng nhắn tin React Native dựa trên các màn hình Stitch được cung cấp. Dữ liệu hội thoại, danh bạ, thông báo và cài đặt là dữ liệu mẫu lưu trong bộ nhớ khi ứng dụng đang chạy; chưa cần máy chủ hoặc tài khoản thật.

## Màn hình và chức năng

- **Đăng nhập:** xác thực dữ liệu nhập cơ bản, ghi nhớ đăng nhập, hiện/ẩn mật khẩu, đăng ký mẫu và điều hướng vào tin nhắn. Đăng nhập Google/Apple/Facebook hiển thị thông báo vì chưa kết nối nhà cung cấp.
- **Tin nhắn:** tìm kiếm hội thoại, lọc tất cả/chưa đọc/nhóm/công việc, xem bạn bè trực tuyến, mở hội thoại và soạn tin mới.
- **Danh bạ:** tìm theo tên hoặc số điện thoại, lọc trực tuyến/gần đây, bắt đầu cuộc trò chuyện và mô phỏng cuộc gọi.
- **Thông báo:** lọc chưa đọc, đánh dấu đã đọc, chấp nhận/bỏ qua lời mời, mở nhóm và trả lời lượt nhắc.
- **Cài đặt:** tìm mục cài đặt, bật/tắt các tùy chọn và xác nhận trước khi đăng xuất.
- **Hội thoại:** gửi tin nhắn mẫu, trạng thái đã đọc, cuộc gọi mẫu và nút đính kèm.

## Cấu trúc chính

```text
src/chat/
  ChatContext.tsx       Dữ liệu dùng chung và thao tác trạng thái
  data.ts               Danh bạ, hội thoại, thông báo và ảnh mẫu
  navigation.tsx        Điều hướng React Navigation
  theme.ts              Màu sắc theo design tokens Stitch
  components/Common.tsx Header, avatar, ô tìm kiếm, thanh tab
  screens/              Login, Messages, Contacts, Notifications,
                        Settings và Conversation
```

## Thư viện

Các dependency đã có trong dự án: React Native, TypeScript, React Navigation Native Stack và Safe Area Context. Không cần cài thêm thư viện cho các màn hình này.

## Chạy trên Android

Cài Android Studio/Android SDK và môi trường theo [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment). Từ thư mục dự án:

```sh
npm install
npm start
```

Mở terminal khác để chạy emulator hoặc thiết bị Android đã bật USB debugging:

```sh
npm run android
```

Để chạy iOS trên macOS:

```sh
cd ios
bundle exec pod install
cd ..
npm run ios
```

Ảnh đại diện và logo mẫu được tải qua HTTPS; giao diện vẫn hiển thị avatar chữ thay thế nếu ảnh không tải được.
