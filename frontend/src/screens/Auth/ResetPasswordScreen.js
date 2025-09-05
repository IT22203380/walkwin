import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import authService from '../../services/authService';
import GradientBackground from '../../components/GradientBackground';

export default function ResetPasswordScreen({ navigation, route }) {
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);
	const token = route?.params?.token || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : '');
	const [valid, setValid] = useState(false);

	useEffect(() => {
		async function check() {
			try {
				await authService.validateResetToken(token);
				setValid(true);
			} catch (e) {
				Alert.alert('Invalid link', 'The reset link is invalid or expired');
				navigation.replace('Login');
			}
		}
		if (token) check();
	}, [token]);

	async function handleSubmit() {
		try {
			// Validation
			if (!password || password.length < 6) {
				Alert.alert('Invalid Password', 'Password must be at least 6 characters long');
				return;
			}
			if (password !== confirm) {
				Alert.alert('Passwords Don\'t Match', 'Please make sure both passwords are the same');
				return;
			}

			setLoading(true);
			console.log('Updating password...');
			await authService.resetPassword(token, password);
			console.log('Password updated successfully, navigating to Login...');
			
			// Try multiple navigation methods to ensure it works
			try {
				navigation.replace('Login');
			} catch (navError) {
				console.error('Navigation error:', navError);
				// Fallback navigation methods
				try {
					navigation.navigate('Login');
				} catch (navError2) {
					console.error('Second navigation error:', navError2);
					// Force navigation reset
					navigation.reset({
						index: 0,
						routes: [{ name: 'Login' }],
					});
				}
			}
		} catch (err) {
			Alert.alert('Failed', err.message || 'Please try again');
		} finally {
			setLoading(false);
		}
	}

	if (!token || !valid) {
		return (
			<GradientBackground>
				<View style={styles.container}><ActivityIndicator /></View>
			</GradientBackground>
		);
	}

	return (
		<GradientBackground>
			<View style={styles.container}>
				<Text style={styles.title}>Reset Password</Text>
				<TextInput placeholder="New password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
				<TextInput placeholder="Confirm password" secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />
				<TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
					{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update password</Text>}
				</TouchableOpacity>
			</View>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	container: { width: '100%', maxWidth: 420, alignSelf: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#ffffffcc', borderRadius: 14 },
	title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#14532d' },
	input: { borderWidth: 1, borderColor: '#cce3d1', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
	button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center' },
	buttonDisabled: { opacity: 0.6 },
	buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});


