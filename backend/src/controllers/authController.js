const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

function signToken(user) {
	return jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	);
}

async function register(req, res) {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Name, email and password are required' });
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'Email already registered' });
		}
		const passwordHash = await User.hashPassword(password);
		const user = await User.create({ name, email, passwordHash });
		const token = signToken(user);
		return res.status(201).json({
			user: { id: user._id, name: user.name, email: user.email, role: user.role },
			token,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}
		const user = await User.findOne({ email }).select('+passwordHash');
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		// Update lastLogin field
		user.lastLogin = new Date();
		await user.save();
		const token = signToken(user);
		return res.json({
			user: { id: user._id, name: user.name, email: user.email, role: user.role, lastLogin: user.lastLogin },
			token,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
}

async function me(req, res) {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			points: user.points,
			badges: user.badges,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
}

async function forgotPassword(req, res) {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: 'Email is required' });
		
		const user = await User.findOne({ email }).select('_id email');
		if (!user) {
			return res.json({ message: 'If that email exists, a reset link was sent' });
		}
		
		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
		
		await User.updateOne(
			{ _id: user._id }, 
			{ resetPasswordToken: token, resetPasswordExpires: expires }
		);
		
		// For React Native app, we'll include instructions to navigate to ResetPassword screen
		const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:8085';
		const resetUrl = `${appBaseUrl}/reset?token=${token}`;
		
		await sendEmail({
			to: user.email,
			subject: 'EcoStep Password Reset',
			text: `Reset your password: ${resetUrl}`,
			html: `
				<h2>EcoStep Password Reset</h2>
				<p>Click the link below to reset your password:</p>
				<p><a href="${resetUrl}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
				<p>Or copy this link: ${resetUrl}</p>
				<p><strong>Note:</strong> If you're using the EcoStep mobile app, please copy the token from the URL and use it in the app's Reset Password screen.</p>
				<p>Token: <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${token}</code></p>
				<p>This link expires in 30 minutes.</p>
			`,
		});
		
		return res.json({ message: 'If that email exists, a reset link was sent' });
	} catch (err) {
		console.error('Forgot password error:', err);
		return res.status(500).json({ message: 'Failed to process request' });
	}
}

async function validateResetToken(req, res) {
	try {
		const { token } = req.params;
		const user = await User.findOne({ 
			resetPasswordToken: token, 
			resetPasswordExpires: { $gt: new Date() } 
		}).select('_id');
		
		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token' });
		}
		return res.json({ valid: true });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to validate token' });
	}
}

async function resetPassword(req, res) {
	try {
		const { token } = req.params;
		const { password } = req.body;
		
		if (!password) {
			return res.status(400).json({ message: 'Password is required' });
		}
		
		const user = await User.findOne({ 
			resetPasswordToken: token, 
			resetPasswordExpires: { $gt: new Date() } 
		}).select('_id');
		
		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token' });
		}
		
		const passwordHash = await User.hashPassword(password);
		await User.updateOne(
			{ _id: user._id }, 
			{ 
				passwordHash, 
				resetPasswordToken: undefined, 
				resetPasswordExpires: undefined 
			}
		);
		
		return res.json({ message: 'Password reset successful' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to reset password' });
	}
}

module.exports = { register, login, me, forgotPassword, validateResetToken, resetPassword };


