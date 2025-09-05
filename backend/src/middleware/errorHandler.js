function notFound(req, res, next) {
	res.status(404);
	res.json({ message: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message || 'Server Error',
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
	});
}

module.exports = { notFound, errorHandler };


