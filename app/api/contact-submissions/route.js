import { NextResponse } from 'next/server';
import { getConfiguredFormDestinationEmail, isValidEmailAddress, sendMailMessage } from '@/lib/form-mailer';

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeField(field, index) {
  if (!isPlainObject(field)) {
    throw new Error(`Field ${index + 1} is invalid.`);
  }

  const label = String(field.label || '').trim();
  const value = String(field.value || '').trim();

  if (!label || !value) {
    throw new Error(`Field ${index + 1} must include a label and value.`);
  }

  return { label, value };
}

function buildSubmissionText({ formType, fields, sourcePath }) {
  const lines = [
    `Form: ${formType}`,
  ];

  if (sourcePath) {
    lines.push(`Source: ${sourcePath}`);
  }

  lines.push('');

  fields.forEach((field) => {
    lines.push(`${field.label}:`);
    lines.push(field.value);
    lines.push('');
  });

  return lines.join('\n').trim();
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must contain valid JSON.' }, { status: 400 });
  }

  if (!isPlainObject(body)) {
    return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
  }

  try {
    const formType = String(body.formType || '').trim();
    const subject = String(body.subject || '').trim();
    const replyTo = String(body.replyTo || '').trim();
    const sourcePath = String(body.sourcePath || '').trim();
    const rawFields = Array.isArray(body.fields) ? body.fields : [];
    const fields = rawFields.map(normalizeField).filter(Boolean);
    const destination = getConfiguredFormDestinationEmail();

    if (!formType) {
      throw new Error('formType is required.');
    }

    if (!subject) {
      throw new Error('subject is required.');
    }

    if (!fields.length) {
      throw new Error('At least one field is required.');
    }

    if (replyTo && !isValidEmailAddress(replyTo)) {
      throw new Error('replyTo must be a valid email address.');
    }

    if (!destination) {
      throw new Error('FORM_DESTINATION_EMAIL is not configured.');
    }

    await sendMailMessage({
      to: destination,
      subject,
      text: buildSubmissionText({ formType, fields, sourcePath }),
      replyTo,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send message.';
    const isValidationError =
      message.includes('required')
      || message.includes('must be')
      || message.includes('invalid')
      || message.includes('configured');

    if (!isValidationError) {
      console.error('Unexpected error sending contact submission.', error);
    }

    return NextResponse.json(
      { error: isValidationError ? message : 'Unable to send message.' },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
