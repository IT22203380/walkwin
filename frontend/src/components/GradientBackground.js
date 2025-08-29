import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function GradientBackground({ children }) {
	return (
		<View style={styles.root}>
			<LinearGradient
				colors={[ '#ecfdf5', '#dcfce7' ]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={StyleSheet.absoluteFill}
			/>
			<View style={[styles.blob, styles.blob1]} />
			<View style={[styles.blob, styles.blob2]} />
			<View style={styles.centerCard}>{children}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1 },
	blob: {
		position: 'absolute',
		backgroundColor: '#86efac',
		opacity: 0.3,
		borderRadius: 9999,
	},
	blob1: { width: width * 0.7, height: width * 0.7, top: -width * 0.2, left: -width * 0.2 },
	blob2: { width: width * 0.6, height: width * 0.6, bottom: -width * 0.2, right: -width * 0.2 },
	centerCard: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
});


