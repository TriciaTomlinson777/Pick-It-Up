import nodemailer from 'nodemailer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getMailConfiguration() {
  const host = String(process.env.SMTP_HOST || '').trim();
  const port = Number(process.env.SMTP_PORT || '587');
  const user = String(process.env.SMTP_USER || '').trim();
  const pass = String(process.env.SMTP_PASS || '').trim();
  const from = String(process.env.SMTP_FROM || user).trim();
  const destination = String(process.env.FORM_DESTINATION_EMAIL || '').trim();

  return {
    host,
    port,
    user,
    pass,
    from,
    destination,
    isConfigured: Boolean(host && user && pass && from),
  };
}

function createTransport(configuration) {
  return nodemailer.createTransport({
    host: configuration.host,
    port: configuration.port,
    secure: configuration.port === 465,
    auth: {
      user: configuration.user,
      pass: configuration.pass,
    },
  });
}

export function isValidEmailAddress(value) {
  return EMAIL_PATTERN.test(String(value || '').trim());
}

export function getConfiguredFormDestinationEmail() {
  return getMailConfiguration().destination;
}

export async function sendMailMessage({ to, subject, text, replyTo }) {
  const configuration = getMailConfiguration();

  if (!configuration.isConfigured) {
    throw new Error('SMTP is not configured.');
  }

  if (!isValidEmailAddress(to)) {
    throw new Error('A valid destination email is required.');
  }

  const transporter = createTransport(configuration);
  const mailOptions = {
    from: configuration.from,
    to,
    subject: String(subject || '').trim() || 'Pick It Up Seattle form submission',
    text: String(text || '').trim(),
  };

  if (replyTo && isValidEmailAddress(replyTo)) {
    mailOptions.replyTo = String(replyTo).trim();
  }

  await transporter.sendMail(mailOptions);
}
