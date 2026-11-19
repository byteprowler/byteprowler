import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

type LogAttributes = Record<string, boolean | number | string>;

function createLoggerProvider(): LoggerProvider | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV !== "production") {
      const missing = token ? "NEXT_PUBLIC_POSTHOG_HOST" : "NEXT_PUBLIC_POSTHOG_KEY";
      console.warn(`${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`);
    }
    return null;
  }

  try {
    const hostUrl = new URL(host);
    if (hostUrl.protocol !== "https:" || hostUrl.username || hostUrl.password) {
      throw new Error("Invalid PostHog ingestion host");
    }

    return new LoggerProvider({
      resource: resourceFromAttributes({ "service.name": "byteprowler-nextjs" }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL("/i/v1/logs", hostUrl).toString(),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeoutMillis: 2000,
          }),
        }),
      ],
    });
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured");
    }
    return null;
  }
}

export const posthogLoggerProvider = createLoggerProvider();
const posthogLogger = posthogLoggerProvider?.getLogger("byteprowler.posthog-logs");

export function emitPostHogLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes: LogAttributes
) {
  posthogLogger?.emit({ body, severityNumber, attributes });
}

export async function flushPostHogLogs() {
  await posthogLoggerProvider?.forceFlush();
}

export function register() {}

export { SeverityNumber };
