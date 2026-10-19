import React from "react";

export interface ContactOwnerNotificationProps {
  visitorName: string;
  visitorEmail: string;
  subject: string;
  message: string;
  submittedAt: string;
}

const monoStyle: React.CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export default function ContactOwnerNotification({
  message,
  submittedAt,
  subject,
  visitorEmail,
  visitorName,
}: ContactOwnerNotificationProps) {
  return (
    <div
      style={{
        backgroundColor: "#050608",
        color: "#f8fafc",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "28px 16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#0b0f14",
          border: "1px solid rgba(163, 255, 18, 0.32)",
          borderRadius: 10,
          margin: "0 auto",
          maxWidth: 680,
          overflow: "hidden",
        }}
      >
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "22px 24px" }}>
          <p style={{ ...monoStyle, color: "#a3ff12", fontSize: 12, fontWeight: 800, margin: "0 0 8px" }}>
            BYTEPROWLER_UPLINK // TRANSMISSION
          </p>
          <h1 style={{ color: "#ffffff", fontSize: 24, lineHeight: "30px", margin: 0 }}>
            Portfolio contact received
          </h1>
        </div>

        <div style={{ padding: 24 }}>
          <MetaRow label="TIMESTAMP" value={submittedAt} />
          <MetaRow label="SENDER" value={`${visitorName} <${visitorEmail}>`} />
          <MetaRow label="SUBJECT" value={subject} />

          <div
            style={{
              backgroundColor: "rgba(138, 43, 226, 0.12)",
              borderLeft: "3px solid #8a2be2",
              borderRadius: 6,
              color: "#ffffff",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 14,
              lineHeight: "22px",
              marginTop: 20,
              padding: 16,
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </div>

          <p style={{ color: "#9ca3af", fontSize: 12, lineHeight: "20px", margin: "22px 0 0" }}>
            Replying to this email should route directly to the visitor through the Reply-To header.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ ...monoStyle, color: "#00f3ff", fontSize: 11, fontWeight: 800, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 14, lineHeight: "22px" }}>{value}</div>
    </div>
  );
}
