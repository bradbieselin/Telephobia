import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { colors } from '../../constants/theme';
import {
  signInWithApple,
  signInWithGoogle,
  signInWithEmail,
  signUp,
} from '../../lib/auth';

export default function AuthScreen() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signup';

  async function handleApple() {
    try {
      setLoading(true);
      await signInWithApple();
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Error', e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    if (isSignUp && password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Telephobia</Text>
          <Text style={styles.tagline}>
            Phone calls don't have to be scary.
          </Text>
        </View>

        <View style={styles.buttons}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.button, styles.appleButton]}
              onPress={handleApple}
              disabled={loading}
            >
              <Text style={styles.appleButtonText}>
                {isSignUp ? ' Sign up with Apple' : ' Sign in with Apple'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogle}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEmail(!showEmail)}
            style={styles.emailToggle}
          >
            <Text style={styles.emailToggleText}>
              {showEmail
                ? 'Hide'
                : isSignUp
                  ? 'Sign up with email'
                  : 'Sign in with email'}
            </Text>
          </TouchableOpacity>

          {showEmail && (
            <View style={styles.emailForm}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.button, styles.emailButton]}
                onPress={handleEmail}
                disabled={loading}
              >
                <Text style={styles.emailButtonText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setMode(isSignUp ? 'signin' : 'signup')}
          style={styles.switchMode}
        >
          <Text style={styles.switchModeText}>
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 40,
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.gray,
  },
  buttons: {
    gap: 12,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  googleButton: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  emailToggle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emailToggleText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: colors.gray,
    textDecorationLine: 'underline',
  },
  emailForm: {
    gap: 12,
    marginTop: 4,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  emailButton: {
    backgroundColor: colors.primary,
  },
  emailButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  switchMode: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  switchModeText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.primary,
  },
});
