import type { FirebaseError } from 'firebase/app';
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ResponsiveContainer from '@/components/common/ResponsiveContainer';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

type AuthMode = 'signin' | 'signup';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks incorrect. Please check and try again.',
  'auth/user-not-found': "We couldn't find an account with that email.",
  'auth/wrong-password': 'The password you entered is incorrect.',
  'auth/email-already-in-use': 'That email is already associated with an account.',
  'auth/weak-password': 'Passwords need to be at least 6 characters long.',
  'auth/invalid-credential': 'Double-check your email and password, then try again.',
  'auth/invalid-login-credentials': 'Double-check your email and password, then try again.',
  'auth/network-request-failed': 'We could not reach the server. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts in a short time. Wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact support if this seems unexpected.',
};

const mapAuthError = (error: unknown): string => {
  const fallback = 'Unable to authenticate. Please try again.';

  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const firebaseError = error as Partial<FirebaseError>;
  const code = typeof firebaseError.code === 'string' ? firebaseError.code : null;

  if (!code) {
    return fallback;
  }

  return AUTH_ERROR_MESSAGES[code] ?? fallback;
};

const TITLE_COPY: Record<AuthMode, string> = {
  signin: 'Welcome back',
  signup: 'Get started',
};

const SUBTITLE_COPY: Record<AuthMode, string> = {
  signin: 'Sign in to your account to continue',
  signup: 'Create a new account to get started',
};

const CTA_COPY: Record<AuthMode, string> = {
  signin: 'Sign in',
  signup: 'Sign up',
};

const TOGGLE_COPY: Record<AuthMode, string> = {
  signin: "Don't have an account? Sign up",
  signup: 'Already have an account? Sign in',
};

const AuthGate = () => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const handleToggleMode = useCallback(() => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!trimmedEmail) {
      setError('Enter your email address to continue.');
      return;
    }

    if (password.length < 6) {
      setError('Passwords must include at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await signIn(trimmedEmail, password);
      } else {
        await signUp(trimmedEmail, password);
      }
    } catch (authError) {
      setError(mapAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  }, [mode, password, signIn, signUp, trimmedEmail]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
      edges={Platform.OS === 'ios' ? ['top'] : undefined}
    >
      <ResponsiveContainer outerStyle={styles.outer} style={[styles.inner, Platform.OS === 'web' && { maxWidth: 600 }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={false}
          >
            <View style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
              <Text style={[styles.title, { color: palette.text }]}>{TITLE_COPY[mode]}</Text>
              <Text style={[styles.subtitle, { color: palette.textMuted }]}>{SUBTITLE_COPY[mode]}</Text>

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="Enter your email"
                editable={!submitting}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType={mode === 'signin' ? 'password' : 'newPassword'}
                placeholder="Enter your password"
                editable={!submitting}
              />

              {error ? (
                <Text style={[styles.errorText, { color: palette.danger }]} accessibilityRole="alert">
                  {error}
                </Text>
              ) : null}

              <Button
                label={CTA_COPY[mode]}
                onPress={handleSubmit}
                loading={submitting}
                fullWidth
              />

              <Pressable onPress={handleToggleMode} disabled={submitting} accessibilityRole="button">
                {({ pressed }) => (
                  <Text style={[styles.toggle, { color: palette.primary, opacity: pressed ? 0.7 : 1 }]}>
                    {TOGGLE_COPY[mode]}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  outer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  inner: {
    justifyContent: 'center',
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default AuthGate;
