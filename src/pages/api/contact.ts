import type { NextApiRequest, NextApiResponse } from "next";
import {
  ContactValidationError,
  DuplicateSubmissionError,
  processContactSubmission,
} from "../../lib/contactEmail";

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
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const result = await processContactSubmission(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ContactValidationError || error instanceof DuplicateSubmissionError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    console.error("[CONTACT_API_ERROR]", error instanceof Error ? error.message : error);
    return res.status(500).json({
      success: false,
      message: "CONTACT_TRANSMISSION_FAILED",
    });
  }
}
