const User = require('../models/User');

async function listUsers(req, res) {
	const users = await User.find({}, 'name email role isActive points badges createdAt');
	return res.json(users);
}

async function toggleActive(req, res) {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) return res.status(404).json({ message: 'User not found' });
	user.isActive = !user.isActive;
	await user.save();
	return res.json({ id: user._id, isActive: user.isActive });
}

module.exports = { listUsers, toggleActive };


