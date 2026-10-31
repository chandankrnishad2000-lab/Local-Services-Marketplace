const nodemailer = require('nodemailer');

function configuredTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function sendOtpEmail({ to, code, expiresInMinutes }) {
  const transporter = configuredTransport();
  if (!transporter) {
    const error = new Error('Email delivery has not been configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to,
    subject: `${process.env.OTP_EMAIL_SUBJECT || 'Your LocalPulse sign-in code'}`,
    text: `Your LocalPulse sign-in code is ${code}. It expires in ${expiresInMinutes} minutes. If you did not request this code, you can safely ignore this email.`,
    html: `<p>Your LocalPulse sign-in code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in ${expiresInMinutes} minutes. If you did not request it, you can safely ignore this email.</p>`
  });
}

module.exports = { sendOtpEmail };
