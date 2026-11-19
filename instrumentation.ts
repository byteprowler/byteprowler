import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogLogsConfigured = Boolean(posthogToken && posthogHost);

if (!posthogLogsConfigured && process.env.NODE_ENV !== "production") {
  const missingVariable = posthogToken
    ? "NEXT_PUBLIC_POSTHOG_HOST"
    : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthogLogProvider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "byteprowler-portfolio" }),
  processors: posthogLogsConfigured
    ? [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost!.replace(/\/$/, "")}/i/v1/logs`,
            timeoutMillis: 2000,
            headers: {
              Authorization: `Bearer ${posthogToken}`,
              "Content-Type": "application/json",
            },
          }),
        }),
      ]
    : [],
});

export function register() {
  // The dedicated logger is obtained directly from this provider, avoiding the
  // version-sensitive global OpenTelemetry logger provider.
}
