import React from "react";

export interface ContactAcknowledgementProps {
  visitorName: string;
  subject: string;
  submittedAt: string;
  portfolioUrl?: string;
}

const shellStyle: React.CSSProperties = {
  margin: 0,
  backgroundColor: "#050608",
  color: "#f8fafc",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "32px 16px",
};

const cardStyle: React.CSSProperties = {
  maxWidth: 620,
  margin: "0 auto",
  backgroundColor: "#0b0f14",
  border: "1px solid rgba(163, 255, 18, 0.28)",
  borderRadius: 10,
  overflow: "hidden",
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export default function ContactAcknowledgement({
  portfolioUrl,
  submittedAt,
  subject,
  visitorName,
}: ContactAcknowledgementProps) {
  const safeName = visitorName || "there";

  return (
    <div style={shellStyle}>
      <div style={cardStyle}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "24px 26px" }}>
          <p style={{ ...monoStyle, color: "#a3ff12", fontSize: 12, fontWeight: 700, margin: "0 0 8px" }}>
            BYTEPROWLER // CONTACT_UPLINK
          </p>
          <h1 style={{ color: "#ffffff", fontSize: 28, lineHeight: "34px", margin: 0 }}>
            Signal received.
          </h1>
        </div>

        <div style={{ padding: "26px" }}>
          <p style={{ color: "#e5e7eb", fontSize: 16, lineHeight: "26px", margin: "0 0 18px" }}>
            Hi {safeName},
          </p>
          <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: "25px", margin: "0 0 18px" }}>
            Thanks for reaching out through my portfolio. I&apos;ve received your message and will review it.
            I&apos;ll get back to you as soon as possible.
          </p>

          <div
            style={{
              backgroundColor: "rgba(0, 243, 255, 0.06)",
              border: "1px solid rgba(0, 243, 255, 0.18)",
              borderRadius: 8,
              margin: "24px 0",
              padding: "16px",
            }}
          >
            <MetaRow label="STATUS" value="MESSAGE_RECEIVED" />
            <MetaRow label="CHANNEL" value="PORTFOLIO_CONTACT" />
            <MetaRow label="SUBJECT" value={subject} />
            <MetaRow label="SUBMITTED" value={submittedAt} />
          </div>

          {portfolioUrl && (
            <a
              href={portfolioUrl}
              style={{
                backgroundColor: "#a3ff12",
                borderRadius: 6,
                color: "#050608",
                display: "inline-block",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.08em",
                padding: "12px 16px",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Return to Portfolio
            </a>
          )}

          <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: "22px", margin: "28px 0 0" }}>
            — ByteProwler
          </p>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...monoStyle, color: "#00f3ff", fontSize: 11, fontWeight: 800, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 14, lineHeight: "22px" }}>{value}</div>
    </div>
  );
}
