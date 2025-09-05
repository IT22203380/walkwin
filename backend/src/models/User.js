const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true, select: false },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
		isActive: { type: Boolean, default: true },
		points: { type: Number, default: 0 },
		badges: [{ type: String }],
		resetPasswordToken: { type: String, select: false },
		resetPasswordExpires: { type: Date, select: false },
		lastLogin: { type: Date },
	},
	{ timestamps: true }
);

userSchema.methods.comparePassword = async function (passwordPlain) {
	return bcrypt.compare(passwordPlain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (passwordPlain) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(passwordPlain, salt);
};

module.exports = mongoose.model('User', userSchema);


