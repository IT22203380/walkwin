import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';

const { width, height } = Dimensions.get('window');

const slides = [
	{
		title: 'Walk & Win',
		desc: 'Turn your daily steps into points and eco-impact. Walk more, win more!',
		img: require('../../assets/walkandwin.webp'),
	},
	{
		title: 'Save CO₂',
		desc: 'See how your steps reduce carbon footprint and help the planet.',
		img: require('../../assets/co2.webp'),
	},
	{
		title: 'Badges & Leaderboard',
		desc: 'Earn badges, keep streaks, and climb the leaderboard with friends.',
		img: require('../../assets/Badges.jpg'),
	},
];

export default function OnboardingScreen({ navigation }) {
	const [index, setIndex] = useState(0);

	async function finish() {
		await AsyncStorage.setItem('onboardingCompleted', 'true');
		navigation.replace('Login');
	}

	function onNext() {
		if (index < slides.length - 1) setIndex(index + 1);
		else finish();
	}

	return (
		<GradientBackground>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={finish}>
						<Text style={styles.skip}>Skip</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.slide}>
					<Image source={slides[index].img} resizeMode="contain" style={styles.image} />
					<Text style={styles.title}>{slides[index].title}</Text>
					<Text style={styles.desc}>{slides[index].desc}</Text>
				</View>

				<View style={styles.dots}>
					{slides.map((_, i) => (
						<View key={i} style={[styles.dot, i === index && styles.dotActive]} />
					))}
				</View>

				<TouchableOpacity style={styles.button} onPress={onNext}>
					<Text style={styles.buttonText}>{index < slides.length - 1 ? 'Next' : 'Get Started'}</Text>
				</TouchableOpacity>
			</View>
		</GradientBackground>
	);
}

// Responsive image sizing: slightly smaller on short screens, capped on large screens
const baseWidth = height < 700 ? width * 0.5 : width * 0.6;
const imageWidth = Math.min(baseWidth, 280);

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, justifyContent: 'space-between' },
	header: { alignItems: 'flex-end' },
	skip: { color: '#166534', fontWeight: '600', fontSize: 16 },
	slide: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
	image: { width: imageWidth, height: imageWidth, marginBottom: 16 },
	title: { fontSize: 28, fontWeight: '800', color: '#14532d', textAlign: 'center', marginBottom: 10 },
	desc: { fontSize: 16, color: '#374151', textAlign: 'center', maxWidth: width * 0.85 },
	dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 },
	dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#bbf7d0' },
	dotActive: { backgroundColor: '#16a34a', width: 16 },
	button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center' },
	buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
