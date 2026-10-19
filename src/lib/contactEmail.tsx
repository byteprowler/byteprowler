import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import nodemailer from "nodemailer";
import ContactAcknowledgement from "../../emails/ContactAcknowledgement";
import ContactOwnerNotification from "../../emails/ContactOwnerNotification";

export interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

export interface CleanContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface MailEnvelope {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export interface ContactProcessResult {
  success: true;
  message: string;
  acknowledgementSent: boolean;
  acknowledgementFailed?: boolean;
}

export interface MailTransport {
  send: (mail: MailEnvelope) => Promise<void>;
}

const DUPLICATE_WINDOW_MS = 1000 * 20;
const duplicateSubmissionCache = new Map<string, number>();

function stripTags(value: unknown) {
  return String(value ?? "").replace(/<[^>]*>/g, "").trim();
}

function normalizeMessage(value: unknown) {
  return stripTags(value).slice(0, 4000);
}

export function validateContactPayload(payload: ContactPayload): CleanContactPayload {
  const cleanName = stripTags(payload.name).slice(0, 120);
  const cleanEmail = stripTags(payload.email).slice(0, 254).toLowerCase();
  const cleanSubject = stripTags(payload.subject).slice(0, 180);
  const cleanMessage = normalizeMessage(payload.message);

  if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
    throw new ContactValidationError("INTEGRITY_ERR: Missing mandatory transmission signature attributes.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new ContactValidationError("DECRYPT_ERR: Invalid target email protocol formatting.");
  }

  return {
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
    submittedAt: new Date().toISOString(),
  };
}

export class ContactValidationError extends Error {
  statusCode = 400;
}

export class DuplicateSubmissionError extends Error {
  statusCode = 429;
}

export function getSubmissionFingerprint(payload: CleanContactPayload) {
  return [
    payload.email,
    payload.subject.toLowerCase(),
    payload.message.slice(0, 240).toLowerCase(),
  ].join("::");
}

export function assertNotDuplicateSubmission(payload: CleanContactPayload, now = Date.now()) {
  const fingerprint = getSubmissionFingerprint(payload);
  const previous = duplicateSubmissionCache.get(fingerprint);

  for (const [key, timestamp] of duplicateSubmissionCache.entries()) {
    if (now - timestamp > DUPLICATE_WINDOW_MS) {
      duplicateSubmissionCache.delete(key);
    }
  }

  if (previous && now - previous < DUPLICATE_WINDOW_MS) {
    throw new DuplicateSubmissionError("DUPLICATE_SIGNAL: This message was already received recently.");
  }

  duplicateSubmissionCache.set(fingerprint, now);
}

export function resetDuplicateSubmissionCacheForTests() {
  duplicateSubmissionCache.clear();
}

export function buildOwnerNotificationEmail(payload: CleanContactPayload, from: string, to: string): MailEnvelope {
  const submittedAt = new Date(payload.submittedAt).toUTCString();
  const html = renderEmail(
    <ContactOwnerNotification
      message={payload.message}
      subject={payload.subject}
      submittedAt={submittedAt}
      visitorEmail={payload.email}
      visitorName={payload.name}
    />
  );

  const text = `
=== PORTFOLIO CONTACT TRANSMISSION ===
Sender: ${payload.name}
Email: ${payload.email}
Subject: ${payload.subject}
Timestamp: ${submittedAt}

Payload Message:
----------------------------------------
${payload.message}
----------------------------------------
This form submission was securely processed by your Byteprowler portfolio API.
`;

  return {
    from,
    replyTo: payload.email,
    to,
    subject: `[Portfolio Link] ${payload.subject}`,
    text,
    html,
  };
}

export function buildAcknowledgementEmail(payload: CleanContactPayload, from: string, portfolioUrl?: string): MailEnvelope {
  const submittedAt = new Date(payload.submittedAt).toUTCString();
  const html = renderEmail(
    <ContactAcknowledgement
      portfolioUrl={portfolioUrl}
      subject={payload.subject}
      submittedAt={submittedAt}
      visitorName={payload.name}
    />
  );

  const text = `
Signal received.

Hi ${payload.name},

Thanks for reaching out through my portfolio.

I've received your message and will review it. I'll get back to you as soon as possible.

STATUS: MESSAGE_RECEIVED
CHANNEL: PORTFOLIO_CONTACT
SUBJECT: ${payload.subject}
SUBMITTED: ${submittedAt}

— ByteProwler
`;

  return {
    from,
    to: payload.email,
    subject: "Signal received — ByteProwler",
    text,
    html,
  };
}

export function renderEmail(element: React.ReactElement) {
  return `<!doctype html>${renderToStaticMarkup(element)}`;
}

export function createConfiguredMailTransport(): MailTransport | null {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    return createResendTransport(resendApiKey);
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    return {
      send: async (mail) => {
        await transporter.sendMail({
          from: mail.from,
          html: mail.html,
          replyTo: mail.replyTo,
          subject: mail.subject,
          text: mail.text,
          to: mail.to,
        });
      },
    };
  }

  return null;
}

export function createResendTransport(apiKey: string): MailTransport {
  return {
    send: async (mail) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: mail.from,
          html: mail.html,
          reply_to: mail.replyTo,
          subject: mail.subject,
          text: mail.text,
          to: mail.to,
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`RESEND_DELIVERY_ERR: ${response.status} ${body.slice(0, 160)}`);
      }
    },
  };
}

export async function processContactSubmission(
  rawPayload: ContactPayload,
  options: {
    mailTransport?: MailTransport | null;
    now?: number;
    ownerEmail?: string;
    portfolioUrl?: string;
    senderEmail?: string;
  } = {}
): Promise<ContactProcessResult> {
  const payload = validateContactPayload(rawPayload);
  assertNotDuplicateSubmission(payload, options.now);

  const mailTransport = options.mailTransport ?? createConfiguredMailTransport();
  const senderEmail = options.senderEmail || process.env.RESEND_FROM_EMAIL || process.env.SMTP_USER || "";
  const ownerEmail = options.ownerEmail || process.env.CONTACT_TO_EMAIL || process.env.RESEND_TO_EMAIL || process.env.SMTP_TO || process.env.SMTP_USER || "";
  const portfolioUrl = options.portfolioUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://byteprowler.vercel.app";

  if (!mailTransport || !senderEmail || !ownerEmail) {
    logContactSandbox(payload);
    return {
      success: true,
      acknowledgementSent: false,
      message: "Transmission Secure. Message queued successfully in central grid buffers.",
    };
  }

  const ownerMail = buildOwnerNotificationEmail(payload, senderEmail, ownerEmail);
  await mailTransport.send(ownerMail);

  let acknowledgementSent = false;
  let acknowledgementFailed = false;

  try {
    const acknowledgementMail = buildAcknowledgementEmail(payload, senderEmail, portfolioUrl);
    await mailTransport.send(acknowledgementMail);
    acknowledgementSent = true;
  } catch (error) {
    acknowledgementFailed = true;
    console.error("[CONTACT_ACKNOWLEDGEMENT_ERROR]", error instanceof Error ? error.message : error);
  }

  return {
    success: true,
    acknowledgementFailed,
    acknowledgementSent,
    message: "Transmission Secure. Message dispatched successfully.",
  };
}

function logContactSandbox(payload: CleanContactPayload) {
  console.log(`
======================================================================
[SANDBOX TELEMETRY LOG] TRANSMISSION SECURE: MESSAGE DISPATCH MOCKED
----------------------------------------------------------------------
Timestamp: ${payload.submittedAt}
Sender:    ${payload.name}
Email:     ${payload.email}
Subject:   ${payload.subject}
Message:   ${payload.message}
======================================================================
  `);
}
