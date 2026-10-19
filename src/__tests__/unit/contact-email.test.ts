import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ContactValidationError,
  DuplicateSubmissionError,
  buildAcknowledgementEmail,
  buildOwnerNotificationEmail,
  processContactSubmission,
  resetDuplicateSubmissionCacheForTests,
  validateContactPayload,
  type MailEnvelope,
  type MailTransport,
} from "../../lib/contactEmail";

const validPayload = {
  name: "Joshua",
  email: "visitor@example.com",
  subject: "Frontend Project",
  message: "I want to discuss a portfolio build.",
};

function createTransport(failOnSendIndex?: number) {
  const sent: MailEnvelope[] = [];
  const transport: MailTransport = {
    send: vi.fn(async (mail: MailEnvelope) => {
      sent.push(mail);
      if (failOnSendIndex && sent.length === failOnSendIndex) {
        throw new Error("simulated delivery failure");
      }
    }),
  };

  return { sent, transport };
}

describe("contact email flow", () => {
  beforeEach(() => {
    resetDuplicateSubmissionCacheForTests();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  it("validates a valid contact submission", () => {
    const cleanPayload = validateContactPayload(validPayload);

    expect(cleanPayload).toMatchObject({
      name: "Joshua",
      email: "visitor@example.com",
      subject: "Frontend Project",
      message: "I want to discuss a portfolio build.",
    });
    expect(cleanPayload.submittedAt).toBeTruthy();
  });

  it("rejects invalid email addresses", () => {
    expect(() => validateContactPayload({ ...validPayload, email: "broken-email" })).toThrow(ContactValidationError);
  });

  it("rejects missing required fields", () => {
    expect(() => validateContactPayload({ ...validPayload, message: "" })).toThrow(ContactValidationError);
  });

  it("builds the owner notification with Reply-To set to the visitor email", () => {
    const cleanPayload = validateContactPayload(validPayload);
    const email = buildOwnerNotificationEmail(cleanPayload, "ByteProwler <contact@example.com>", "owner@example.com");

    expect(email.to).toBe("owner@example.com");
    expect(email.replyTo).toBe("visitor@example.com");
    expect(email.subject).toContain("Frontend Project");
    expect(email.html).toContain("Portfolio contact received");
  });

  it("builds a visitor acknowledgement without including the full message body", () => {
    const cleanPayload = validateContactPayload(validPayload);
    const email = buildAcknowledgementEmail(cleanPayload, "ByteProwler <contact@example.com>", "https://byteprowler.dev");

    expect(email.to).toBe("visitor@example.com");
    expect(email.subject).toContain("Signal received");
    expect(email.html).toContain("MESSAGE_RECEIVED");
    expect(email.html).not.toContain("I want to discuss a portfolio build.");
  });

  it("sends owner notification and visitor acknowledgement for valid submissions", async () => {
    const { sent, transport } = createTransport();

    const result = await processContactSubmission(validPayload, {
      mailTransport: transport,
      now: 1000,
      ownerEmail: "owner@example.com",
      portfolioUrl: "https://byteprowler.dev",
      senderEmail: "ByteProwler <contact@example.com>",
    });

    expect(result.success).toBe(true);
    expect(result.acknowledgementSent).toBe(true);
    expect(sent).toHaveLength(2);
    expect(sent[0].to).toBe("owner@example.com");
    expect(sent[0].replyTo).toBe("visitor@example.com");
    expect(sent[1].to).toBe("visitor@example.com");
  });

  it("returns success when the visitor acknowledgement fails after owner notification succeeds", async () => {
    const { sent, transport } = createTransport(2);

    const result = await processContactSubmission(validPayload, {
      mailTransport: transport,
      now: 2000,
      ownerEmail: "owner@example.com",
      portfolioUrl: "https://byteprowler.dev",
      senderEmail: "ByteProwler <contact@example.com>",
    });

    expect(result.success).toBe(true);
    expect(result.acknowledgementFailed).toBe(true);
    expect(result.acknowledgementSent).toBe(false);
    expect(sent).toHaveLength(2);
  });

  it("blocks obvious duplicate submissions inside the cooldown window", async () => {
    const { transport } = createTransport();
    const options = {
      mailTransport: transport,
      ownerEmail: "owner@example.com",
      senderEmail: "ByteProwler <contact@example.com>",
    };

    await processContactSubmission(validPayload, { ...options, now: 3000 });

    await expect(processContactSubmission(validPayload, { ...options, now: 3500 })).rejects.toThrow(
      DuplicateSubmissionError
    );
  });
});
