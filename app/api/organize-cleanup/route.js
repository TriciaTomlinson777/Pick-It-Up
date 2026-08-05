import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatConfirmationMessage({
  organizerName,
  cleanupTitle,
  eventDate,
  startTime,
  meetingPlace,
}) {
  return `Hi ${organizerName},

Thank you for organizing a cleanup with Pick It Up Seattle!

Your cleanup has been posted and is now available for volunteers to view in Join a Cleanup.

Cleanup: ${cleanupTitle}
Date: ${eventDate}
Time: ${startTime}
Meeting Place: ${meetingPlace}

Your email address and phone number will remain private and will not appear publicly.

Thank you for helping make Seattle cleaner, one piece at a time!

Pick It Up Seattle
One Person. One Piece. One Cleaner City.`;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const cleanupTitle = String(body.cleanupTitle || '').trim();
    const eventDate = String(body.eventDate || '').trim();
    const startTime = String(body.startTime || '').trim();
    const meetingPlace = String(body.meetingPlace || '').trim();
    const organizerName = String(body.organizerName || '').trim();
    const organizerEmail = String(body.organizerEmail || '').trim();

    if (!cleanupTitle || !eventDate || !startTime || !meetingPlace || !organizerName || !organizerEmail) {
      return NextResponse.json({
        ok: true,
        message:
          'Cleanup saved successfully. Confirmation email skipped because submission data was incomplete.',
      });
    }

    if (!EMAIL_PATTERN.test(organizerEmail)) {
      return NextResponse.json({
        ok: true,
        message:
          'Cleanup saved successfully. Confirmation email skipped because organizer email was invalid.',
      });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (!host || !user || !pass || !from) {
      const message =
        'Cleanup saved successfully. Confirmation email skipped because SMTP is not configured.';
      console.info(message);
      return NextResponse.json({ ok: true, message });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from,
        to: organizerEmail,
        subject: 'Your Pick It Up Seattle Cleanup Has Been Posted',
        text: formatConfirmationMessage({
          organizerName,
          cleanupTitle,
          eventDate,
          startTime,
          meetingPlace,
        }),
      });
    } catch (emailError) {
      console.error('Cleanup saved, but confirmation email failed:', emailError);
      return NextResponse.json({
        ok: true,
        message:
          'Cleanup saved successfully. Confirmation email could not be sent at this time.',
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Cleanup email endpoint failed unexpectedly:', error);
    return NextResponse.json({
      ok: true,
      message:
        'Cleanup saved successfully. Confirmation email could not be processed.',
    });
  }
}
