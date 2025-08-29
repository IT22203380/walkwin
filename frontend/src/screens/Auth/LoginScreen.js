import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';
import GradientBackground from '../../components/GradientBackground';

export default function LoginScreen({ navigation, route }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [successMsg, setSuccessMsg] = useState(route?.params?.registered ? 'Registered successfully. Please log in.' : '');
	const [errorMsg, setErrorMsg] = useState('');
	const [showSuccess, setShowSuccess] = useState(false);
	const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const done = await AsyncStorage.getItem('onboardingCompleted');
				if (!done) {
					navigation.replace('Onboarding');
				}
			} catch {}
		})();
	}, [navigation]);

	function isValidEmail(value) {
		if (!value || !value.includes('@')) return false;
		return /.+@.+\..+/.test(value);
	}

	function showMessage(message, isError = false) {
		if (isError) {
			setErrorMsg(message);
			setShowSuccess(false);
			setLoginSuccessMsg('');
		} else {
			setErrorMsg('');
			setShowSuccess(true);
			setLoginSuccessMsg(message);
		}
		setTimeout(() => {
			if (isError) {
				setErrorMsg('');
			} else {
				setShowSuccess(false);
				setLoginSuccessMsg('');
			}
		}, 5000);
	}

	async function handleLogin() {
		try {
			setErrorMsg('');
			setShowSuccess(false);
			setLoginSuccessMsg('');
			if (!isValidEmail(email)) {
				showMessage('Please enter a valid email address with @', true);
				return;
			}
			if (!password || password.length < 6) {
				showMessage('Password must be at least 6 characters long', true);
				return;
			}
			setLoading(true);
			await authService.login(email.trim(), password);
			showMessage('Login successful! Welcome back to Walk & Win!');
			setTimeout(() => {
				navigation.replace('Profile');
			}, 2000);
		} catch (err) {
			let errorMessage = 'Login failed. Please try again.';
			if (err?.response?.status === 401) errorMessage = 'Incorrect email or password. Please check your credentials and try again.';
			else if (err?.message?.toLowerCase().includes('invalid credentials')) errorMessage = 'Incorrect email or password. Please check your credentials and try again.';
			else if (err?.message?.toLowerCase().includes('not found')) errorMessage = 'Email not found. Please check your email address or create a new account.';
			else if (err?.message) errorMessage = err.message;
			showMessage(errorMessage, true);
		} finally {
			setLoading(false);
		}
	}

	return (
		<GradientBackground>
		<View style={styles.container}>
			<Text style={styles.title}>Walk & Win Login</Text>
			{!!successMsg && <Text style={styles.success}>{successMsg}</Text>}
			{showSuccess && <Text style={styles.success}>{loginSuccessMsg}</Text>}
			{!!errorMsg && !showSuccess && <Text style={styles.error}>{errorMsg}</Text>}
			<TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
			<TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
			<TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
				{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
			</TouchableOpacity>
			<View style={{ height: 12 }} />
			<TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.link}>Create account</Text></TouchableOpacity>
			<View style={{ height: 8 }} />
			<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.link}>Forgot password</Text></TouchableOpacity>
		</View>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	container: { width: '100%', maxWidth: 420, alignSelf: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#ffffffcc', borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8 },
	title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#14532d' },
	input: { borderWidth: 1, borderColor: '#cce3d1', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
	button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center' },
	buttonDisabled: { opacity: 0.6 },
	buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
	link: { color: '#166534', textAlign: 'center', fontWeight: '600' },
	success: { color: '#065f46', backgroundColor: '#d1fae5', padding: 10, borderRadius: 8, marginBottom: 12, textAlign: 'center' },
	error: { color: '#991b1b', backgroundColor: '#fca5a5', padding: 10, borderRadius: 8, marginBottom: 12, textAlign: 'center' },
});


