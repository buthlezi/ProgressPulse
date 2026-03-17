import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../lib/auth';
import { Ionicons } from '@expo/vector-icons';
import  AppButton from './AppButton';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  console.log('showPassword', showPassword);
  // console.log


   return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
          Sign In Here
        </Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 4, color: '#0c0cba' }}
        />
        <View style={{ position: 'relative', marginBottom: 16 }}>
        <TextInput
          key={showPassword ? 'password-visible' : 'password-hidden'}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={{ borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 4, color: '#0c0cba', paddingRight: 44 }}
        />

        <Pressable onPress={() => setShowPassword(value => !value)}
        style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: [{ translateY: -12 }],
          }}
        >
         <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={showPassword ? '#0c0cba' : '#88888'}
            accessibilityLabel="Toggle password visibility"
            />
        </Pressable>
        </View>
        <AppButton
          title={loading ? 'Signing In...' : 'Sign In'}
          disabled={loading || !email || !password}
         onPress={async () => {
          try {
            setLoading(true);
            const res = await login(email, password);
            console.log("LOGIN_OK", res)
            router.replace('/');
          } catch (error: any) {
            console.warn('Login failed', error);
            console.log("LOGIN_ERROR_NAME", error?.name);
            console.log("LOGIN_ERROR_MSG", error?.message);
            console.log("LOGIN_ERROR_FULL", JSON.stringify(error, null, 2));            
          } finally {
            setLoading(false);
          }
        }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
