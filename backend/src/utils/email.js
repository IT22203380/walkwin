const nodemailer = require('nodemailer');

function getTransport() {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
	
	// Default to Gmail SMTP if no custom settings
	if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
		console.log('⚠️  Email not configured. Add to .env:');
		console.log('   SMTP_HOST=smtp.gmail.com');
		console.log('   SMTP_PORT=587');
		console.log('   SMTP_USER=your-email@gmail.com');
		console.log('   SMTP_PASS=your-app-password');
		console.log('   EMAIL_FROM=EcoStep <your-email@gmail.com>');
		console.log('   APP_BASE_URL=http://localhost:8085');
		return null;
	}
	
	return nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: Number(SMTP_PORT) === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASS },
	});
}

async function sendEmail({ to, subject, text, html }) {
	const from = process.env.EMAIL_FROM || 'no-reply@ecostep.local';
	const transport = getTransport();
	
	if (!transport) {
		console.log('📧 Email (simulated):', { to, subject, text, html });
		return { simulated: true };
	}
	
	try {
		const result = await transport.sendMail({ from, to, subject, text, html });
		console.log('📧 Email sent successfully to:', to);
		return result;
	} catch (error) {
		console.error('❌ Email send failed:', error.message);
		throw new Error(`Failed to send email: ${error.message}`);
	}
}

module.exports = { sendEmail };


