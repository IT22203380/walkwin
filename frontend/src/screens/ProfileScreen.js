import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import authService from '../services/authService';
import GradientBackground from '../components/GradientBackground';

export default function ProfileScreen({ navigation }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadUserProfile();
	}, []);

	async function loadUserProfile() {
		try {
			const userData = await authService.me();
			setUser(userData);
		} catch (err) {
			Alert.alert('Error', 'Failed to load profile');
		} finally {
			setLoading(false);
		}
	}

	async function handleLogout() {
		try {
			await authService.logout();
			navigation.replace('Login');
		} catch (err) {
			Alert.alert('Error', 'Failed to logout');
		}
	}

	if (loading) {
		return (
			<GradientBackground>
				<View style={styles.container}>
					<Text style={styles.loading}>Loading profile...</Text>
				</View>
			</GradientBackground>
		);
	}

	if (!user) {
		return (
			<GradientBackground>
				<View style={styles.container}>
					<Text style={styles.error}>Profile not found</Text>
					<TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
						<Text style={styles.buttonText}>Go to Login</Text>
					</TouchableOpacity>
				</View>
			</GradientBackground>
		);
	}

	return (
		<GradientBackground>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.container}>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.title}>Profile</Text>
						<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
							<Text style={styles.logoutText}>Logout</Text>
						</TouchableOpacity>
					</View>

					{/* User Info Card */}
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Personal Information</Text>
						<View style={styles.infoRow}>
							<Text style={styles.label}>Name:</Text>
							<Text style={styles.value}>{user.name}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.label}>Email:</Text>
							<Text style={styles.value}>{user.email}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.label}>Member since:</Text>
							<Text style={styles.value}>
								{new Date(user.createdAt || Date.now()).toLocaleDateString()}
							</Text>
						</View>
					</View>

					{/* Stats Card */}
					<View style={styles.card}>
						<Text style={styles.cardTitle}>EcoStep Statistics</Text>
						<View style={styles.statsGrid}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{user.points || 0}</Text>
								<Text style={styles.statLabel}>Total Points</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{Math.floor((user.points || 0) / 100)}</Text>
								<Text style={styles.statLabel}>Steps (1000s)</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{((user.points || 0) * 0.0002).toFixed(2)}</Text>
								<Text style={styles.statLabel}>CO₂ Saved (kg)</Text>
							</View>
						</View>
					</View>

					{/* Badges Card */}
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Badges & Achievements</Text>
						{user.badges && user.badges.length > 0 ? (
							<View style={styles.badgesContainer}>
								{user.badges.map((badge, index) => (
									<View key={index} style={styles.badge}>
										<Text style={styles.badgeText}>{badge}</Text>
									</View>
								))}
							</View>
						) : (
							<View style={styles.noBadges}>
								<Text style={styles.noBadgesText}>No badges yet</Text>
								<Text style={styles.noBadgesSubtext}>Start walking to earn your first badge!</Text>
							</View>
						)}
					</View>

					{/* Quick Actions */}
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Quick Actions</Text>
						<TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Dashboard')}>
							<Text style={styles.actionButtonText}>Go to Dashboard</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Leaderboard')}>
							<Text style={styles.actionButtonText}>View Leaderboard</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	scrollContainer: { flexGrow: 1 },
	container: { padding: 16, paddingBottom: 32 },
	header: { 
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center', 
		marginBottom: 24 
	},
	title: { fontSize: 32, fontWeight: 'bold', color: '#14532d' },
	logoutButton: { 
		backgroundColor: '#dc2626', 
		paddingHorizontal: 16, 
		paddingVertical: 8, 
		borderRadius: 8 
	},
	logoutText: { color: '#fff', fontWeight: '600' },
	card: { 
		backgroundColor: '#ffffffcc', 
		borderRadius: 14, 
		padding: 20, 
		marginBottom: 16,
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8
	},
	cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#14532d', marginBottom: 16 },
	infoRow: { 
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		marginBottom: 12 
	},
	label: { fontSize: 16, color: '#374151', fontWeight: '500' },
	value: { fontSize: 16, color: '#14532d', fontWeight: '600' },
	statsGrid: { 
		flexDirection: 'row', 
		justifyContent: 'space-around' 
	},
	statItem: { alignItems: 'center' },
	statNumber: { fontSize: 28, fontWeight: 'bold', color: '#16a34a' },
	statLabel: { fontSize: 14, color: '#6b7280', marginTop: 4 },
	badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	badge: { 
		backgroundColor: '#16a34a', 
		paddingHorizontal: 12, 
		paddingVertical: 6, 
		borderRadius: 20 
	},
	badgeText: { color: '#fff', fontWeight: '600', fontSize: 14 },
	noBadges: { alignItems: 'center', paddingVertical: 20 },
	noBadgesText: { fontSize: 18, color: '#6b7280', marginBottom: 8 },
	noBadgesSubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
	actionButton: { 
		backgroundColor: '#16a34a', 
		padding: 14, 
		borderRadius: 10, 
		marginBottom: 12,
		alignItems: 'center'
	},
	actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
	loading: { fontSize: 18, color: '#6b7280', textAlign: 'center' },
	error: { fontSize: 18, color: '#dc2626', textAlign: 'center', marginBottom: 16 },
	button: { 
		backgroundColor: '#16a34a', 
		padding: 14, 
		borderRadius: 10, 
		alignItems: 'center' 
	},
	buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
