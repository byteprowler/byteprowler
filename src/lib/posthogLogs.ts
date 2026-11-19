import { SeverityNumber } from "@opentelemetry/api-logs";
import { posthogLogProvider } from "../../instrumentation";

type PortfolioServiceOutcome =
  | { event: "portfolio_view_counter_recorded"; counted: boolean }
  | { event: "portfolio_view_counter_unavailable" }
  | {
      event: "contact_submission_processed";
      acknowledgement_sent: boolean;
      acknowledgement_failed: boolean;
    }
  | { event: "contact_submission_failed" };

const logger = posthogLogProvider.getLogger("byteprowler-posthog-logs");

export async function logPortfolioServiceOutcome(outcome: PortfolioServiceOutcome) {
  const failed = outcome.event.endsWith("_unavailable") || outcome.event.endsWith("_failed");

  logger.emit({
    body: outcome.event,
    severityNumber: failed ? SeverityNumber.ERROR : SeverityNumber.INFO,
    attributes: outcome,
  });
  await posthogLogProvider.forceFlush().catch(() => {});
}
