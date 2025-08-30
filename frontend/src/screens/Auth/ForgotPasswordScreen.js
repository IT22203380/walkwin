import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import authService from '../../services/authService';
import GradientBackground from '../../components/GradientBackground';

export default function ForgotPasswordScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	function isValidEmail(value) {
		return value && value.includes('@') && /.+@.+\..+/.test(value);
	}

	async function handleSubmit() {
		try {
			if (!isValidEmail(email)) {
				Alert.alert('Invalid Email', 'Please enter a valid email address with @');
				return;
			}
			setLoading(true);
			await authService.forgotPassword(email.trim());
			setEmailSent(true);
			Alert.alert('Reset Link Sent', 'Check your email for password reset instructions. Click the link in your email to set a new password.');
		} catch (err) {
			Alert.alert('Error', err.message || 'Failed to send reset link');
		} finally {
			setLoading(false);
		}
	}

	if (emailSent) {
		return (
			<GradientBackground>
				<View style={styles.container}>
					<Text style={styles.title}>Check Your Email</Text>
					<Text style={styles.message}>
						We've sent password reset instructions to {email}
					</Text>
					<Text style={styles.instructions}>
						📧 Check your email and click the reset link
					</Text>
					<Text style={styles.instructions}>
						🔑 Click the link to set your new password
					</Text>
					
					<TouchableOpacity 
						style={styles.linkButton} 
						onPress={() => setEmailSent(false)}
					>
						<Text style={styles.linkText}>Send Another Email</Text>
					</TouchableOpacity>
					
					<TouchableOpacity 
						style={styles.backButton} 
						onPress={() => navigation.navigate('Login')}
					>
						<Text style={styles.backButtonText}>Back to Login</Text>
					</TouchableOpacity>
				</View>
			</GradientBackground>
		);
	}

	return (
		<GradientBackground>
			<View style={styles.container}>
				<Text style={styles.title}>Forgot Password?</Text>
				<Text style={styles.subtitle}>
					Enter your email and we'll send you a reset link
				</Text>
				
				<TextInput 
					placeholder="Email address" 
					autoCapitalize="none" 
					keyboardType="email-address" 
					style={styles.input} 
					value={email} 
					onChangeText={setEmail} 
				/>
				
				<TouchableOpacity 
					style={[styles.button, loading && styles.buttonDisabled]} 
					onPress={handleSubmit} 
					disabled={loading}
				>
					{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
				</TouchableOpacity>
				
				<TouchableOpacity 
					style={styles.backButton} 
					onPress={() => navigation.navigate('Login')}
				>
					<Text style={styles.backButtonText}>Back to Login</Text>
				</TouchableOpacity>
			</View>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	container: { 
		width: '100%', 
		maxWidth: 420, 
		alignSelf: 'center', 
		justifyContent: 'center', 
		padding: 24, 
		backgroundColor: '#ffffffcc', 
		borderRadius: 14,
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8
	},
	title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#14532d' },
	subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
	message: { fontSize: 18, color: '#14532d', marginBottom: 16, textAlign: 'center', fontWeight: '600' },
	instructions: { fontSize: 14, color: '#6b7280', marginBottom: 8, textAlign: 'center' },
	input: { borderWidth: 1, borderColor: '#cce3d1', borderRadius: 10, padding: 12, marginBottom: 16, backgroundColor: '#fff' },
	button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
	buttonDisabled: { opacity: 0.6 },
	buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
	linkButton: { padding: 12, alignItems: 'center', marginBottom: 8 },
	linkText: { color: '#16a34a', fontWeight: '600', fontSize: 16 },
	backButton: { padding: 12, alignItems: 'center' },
	backButtonText: { color: '#6b7280', fontWeight: '500', fontSize: 16 }
});


