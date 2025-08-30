import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import authService from '../../services/authService';
import GradientBackground from '../../components/GradientBackground';

export default function RegisterScreen({ navigation }) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	function isValidEmail(value) {
		if (!value || !value.includes('@')) return false;
		return /.+@.+\..+/.test(value);
	}

	async function handleRegister() {
		try {
			if (!name || name.length < 2) throw new Error('Enter your full name');
			if (!isValidEmail(email)) throw new Error('Enter a valid email');
			if (!password || password.length < 6) throw new Error('Password must be 6+ characters');
			setLoading(true);
			await authService.register(name.trim(), email.trim(), password);
			setLoading(false);
			navigation.navigate('Login', { registered: true });
			return;
		} catch (err) {
			console.error('Register error', err);
			const msg = (err?.message || '').toLowerCase();
			if (msg.includes('already')) {
				Alert.alert('Account exists', 'Email already registered. Please log in.');
				navigation.navigate('Login', { registered: true });
				return;
			}
			Alert.alert('Registration failed', err.message || 'Please try again');
		} finally {
			setLoading(false);
		}
	}

	return (
		<GradientBackground>
		<View style={styles.container}>
			<Text style={styles.title}>Create Account</Text>
			<TextInput placeholder="Full name" style={styles.input} value={name} onChangeText={setName} />
			<TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
			<TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
			<TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
				{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
			</TouchableOpacity>
			<View style={{ height: 12 }} />
			<TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.link}>Back to login</Text></TouchableOpacity>
		</View>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f7fff9' },
	title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#14532d' },
	input: { borderWidth: 1, borderColor: '#cce3d1', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
	button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center' },
	buttonDisabled: { opacity: 0.6 },
	buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
	link: { color: '#166534', textAlign: 'center', fontWeight: '600' },
});


