import React, {useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {logoImage} from '../data';
import {canContinueWithCredentials} from '../login';
import {colors} from '../theme';
import {ChatStackParamList} from '../types';

type Props = {
  navigation: Pick<
    NativeStackScreenProps<ChatStackParamList, 'Login'>['navigation'],
    'replace'
  >;
};

export default function LoginScreen({navigation}: Props) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const submit = () => {
    if (!canContinueWithCredentials(account, password)) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }
    if (registering) {
      Alert.alert('Tạo tài khoản thành công', 'Tài khoản mẫu đã sẵn sàng sử dụng.');
      setRegistering(false);
    }
    navigation.replace('Messages');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.logoShadow}>
              <Image source={{uri: logoImage}} style={styles.logo} />
              <View style={styles.logoDot} />
            </View>
            <Text style={styles.brand}>
              Pulse<Text style={styles.brandBlue}>Chat</Text>
            </Text>
            <Text style={styles.tagline}>Kết nối tức thì, trò chuyện không giới hạn</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldHeading}>
              <Text style={styles.fieldLabel}>Tài khoản</Text>
              <Text style={styles.required}>Bắt buộc</Text>
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputGlyph}>@</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="username"
                keyboardType="email-address"
                onChangeText={setAccount}
                  placeholder="Email hoặc số điện thoại"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  value={account}
              />
            </View>
            <View style={[styles.fieldHeading, styles.passwordHeading]}>
              <Text style={styles.fieldLabel}>Mật khẩu</Text>
              <Text style={styles.required}>Bắt buộc</Text>
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputGlyph}>▣</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
              />
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onPress={() => setShowPassword(value => !value)}>
                <Text style={styles.eye}>{showPassword ? '◉' : '◎'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rememberRow}>
              <TouchableOpacity
                accessibilityRole="checkbox"
                accessibilityState={{checked: remember}}
                onPress={() => setRemember(value => !value)}
                style={[styles.checkbox, remember && styles.checkboxActive]}>
                <Text style={styles.checkmark}>{remember ? '✓' : ''}</Text>
              </TouchableOpacity>
              <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() =>
                  Alert.alert('Quên mật khẩu?', 'Liên kết đặt lại mật khẩu sẽ được gửi nếu tài khoản tồn tại.')
                }>
                <Text style={styles.forgot}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={submit}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {registering ? 'Đăng ký' : 'Đăng nhập'}  → 
              </Text>
            </TouchableOpacity>
            <Text style={styles.demoHint}>Chuyển đến màn hình Tin nhắn (Home)</Text>
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>Hoặc tiếp tục với</Text>
              <View style={styles.separatorLine} />
            </View>
            <View style={styles.socialRow}>
              {['Google', 'Apple', 'Facebook'].map((provider, index) => (
                <TouchableOpacity
                  key={provider}
                  accessibilityRole="button"
                  onPress={() =>
                    Alert.alert(
                      `Tiếp tục với ${provider}`,
                      'Đăng nhập mạng xã hội chưa được kết nối trong bản mẫu ngoại tuyến.',
                    )
                  }
                  style={styles.socialButton}>
                  <Text style={[styles.socialGlyph, index === 0 && styles.googleGlyph]}>
                    {index === 0 ? 'G' : index === 1 ? '●' : 'f'}
                  </Text>
                  <Text style={styles.socialText}>{provider}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>
              {registering ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            </Text>
            <TouchableOpacity onPress={() => setRegistering(value => !value)}>
              <Text style={styles.registerLink}>
                {registering ? 'Đăng nhập' : 'Đăng ký ngay'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  keyboard: {flex: 1},
  content: {paddingBottom: 28, paddingHorizontal: 22},
  hero: {alignItems: 'center', paddingBottom: 24, paddingTop: 24},
  logoShadow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: 25,
    elevation: 5,
    height: 86,
    justifyContent: 'center',
    marginBottom: 25,
    width: 86,
  },
  logo: {borderRadius: 18, height: 58, width: 58},
  logoDot: {
    backgroundColor: colors.online,
    borderColor: colors.background,
    borderRadius: 9,
    borderWidth: 2,
    bottom: -2,
    height: 18,
    position: 'absolute',
    right: -1,
    width: 18,
  },
  brand: {color: colors.text, fontSize: 34, fontWeight: '700', letterSpacing: -1},
  brandBlue: {color: colors.primaryBright},
  tagline: {color: colors.secondaryText, fontSize: 15, marginTop: 6, textAlign: 'center'},
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 25,
    elevation: 2,
    padding: 20,
  },
  fieldHeading: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'},
  fieldLabel: {color: colors.text, fontSize: 16, fontWeight: '500'},
  required: {color: colors.muted, fontSize: 13},
  inputBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: 17,
    flexDirection: 'row',
    height: 60,
    marginTop: 8,
    paddingHorizontal: 14,
  },
  inputGlyph: {color: colors.muted, fontSize: 22, marginRight: 12, width: 22},
  input: {color: colors.text, flex: 1, fontSize: 16},
  passwordHeading: {marginTop: 21},
  eye: {color: colors.muted, fontSize: 22, paddingHorizontal: 2},
  rememberRow: {alignItems: 'center', flexDirection: 'row', marginTop: 21},
  checkbox: {
    alignItems: 'center',
    borderColor: colors.muted,
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkboxActive: {backgroundColor: colors.primaryBright, borderColor: colors.primaryBright},
  checkmark: {color: colors.surface, fontSize: 15, fontWeight: '700', lineHeight: 18},
  rememberText: {color: colors.text, flex: 1, fontSize: 13, marginLeft: 10},
  forgot: {color: colors.primary, fontSize: 13, fontWeight: '500'},
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primaryBright,
    borderRadius: 17,
    elevation: 3,
    height: 58,
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: {color: colors.surface, fontSize: 19, fontWeight: '700'},
  demoHint: {color: colors.muted, fontSize: 12, marginTop: 12, textAlign: 'center'},
  separator: {alignItems: 'center', flexDirection: 'row', gap: 12, marginTop: 23},
  separatorLine: {backgroundColor: '#dbe1ff', flex: 1, height: 1},
  separatorText: {color: colors.muted, fontSize: 14},
  socialRow: {flexDirection: 'row', gap: 10, marginTop: 23},
  socialButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: 18,
    flex: 1,
    height: 86,
    justifyContent: 'center',
  },
  socialGlyph: {color: colors.text, fontSize: 24, fontWeight: '700'},
  googleGlyph: {color: '#4285f4'},
  socialText: {color: colors.text, fontSize: 13, marginTop: 4},
  registerRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 26},
  registerPrompt: {color: colors.secondaryText, fontSize: 15},
  registerLink: {color: colors.primary, fontSize: 16, fontWeight: '700', marginLeft: 5},
});
