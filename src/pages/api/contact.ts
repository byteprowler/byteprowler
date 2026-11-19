import type { NextApiRequest, NextApiResponse } from "next";
import {
  ContactValidationError,
  DuplicateSubmissionError,
  processContactSubmission,
} from "../../lib/contactEmail";
import { emitPostHogLog, flushPostHogLogs, SeverityNumber } from "../../instrumentation";

interface ContactApiResponse {
  success?: boolean;
  message?: string;
  acknowledgementSent?: boolean;
  acknowledgementFailed?: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactApiResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    emitPostHogLog("contact_request_rejected", SeverityNumber.WARN, {
      route: "/api/contact",
      reason: "method_not_allowed",
    });
    await flushPostHogLogs().catch(() => {});
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const result = await processContactSubmission(req.body);
    emitPostHogLog("contact_submission_completed", SeverityNumber.INFO, {
      route: "/api/contact",
      ...(typeof result.acknowledgementSent === "boolean"
        ? { acknowledgement_sent: result.acknowledgementSent }
        : {}),
      ...(typeof result.acknowledgementFailed === "boolean"
        ? { acknowledgement_failed: result.acknowledgementFailed }
        : {}),
    });
    await flushPostHogLogs().catch(() => {});
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ContactValidationError || error instanceof DuplicateSubmissionError) {
      emitPostHogLog("contact_submission_rejected", SeverityNumber.WARN, {
        route: "/api/contact",
        reason: error instanceof ContactValidationError ? "validation_failed" : "duplicate_submission",
      });
      await flushPostHogLogs().catch(() => {});
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    emitPostHogLog("contact_submission_failed", SeverityNumber.ERROR, {
      route: "/api/contact",
      reason: "delivery_failed",
    });
    await flushPostHogLogs().catch(() => {});
    console.error("[CONTACT_API_ERROR]");
    return res.status(500).json({
      success: false,
      message: "CONTACT_TRANSMISSION_FAILED",
    });
  }
}
