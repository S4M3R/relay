import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "relay — the agent your agent sends to talk to people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mascotSrc =
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSI3NSAxMTAgMjUwIDI4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iYm9keUdyYWQiIGN4PSI1MCUiIGN5PSI0MCUiIHI9IjU1JSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MEE1RkEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSIjM0I4MkY2IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzRUIiIC8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyaW1MaWdodCIgY3g9IjMwJSIgY3k9IjIwJSIgcj0iNzAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMjU1LDI1NSwwLjE1KSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSJyZ2JhKDI1NSwyNTUsMjU1LDApIiAvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZXllR3JhZCIgY3g9IjQ1JSIgY3k9IjQwJSIgcj0iNTAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFlMjkzYiIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGYxNzJhIiAvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYm9keUhpZ2hsaWdodCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTIpIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9InJnYmEoMjU1LDI1NSwyNTUsMCkiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBMZWdzIC0tPgogIDxlbGxpcHNlIGN4PSIxNzAiIGN5PSIzNDUiIHJ4PSIxOCIgcnk9IjI4IiBmaWxsPSIjMjU2M0VCIiAvPgogIDxlbGxpcHNlIGN4PSIxNzAiIGN5PSIzNDUiIHJ4PSIxOCIgcnk9IjI4IiBmaWxsPSJ1cmwoI3JpbUxpZ2h0KSIgLz4KICA8ZWxsaXBzZSBjeD0iMTY4IiBjeT0iMzY4IiByeD0iMjIiIHJ5PSIxMiIgZmlsbD0iIzI1NjNFQiIgLz4KICA8ZWxsaXBzZSBjeD0iMjMwIiBjeT0iMzQ1IiByeD0iMTgiIHJ5PSIyOCIgZmlsbD0iIzI1NjNFQiIgLz4KICA8ZWxsaXBzZSBjeD0iMjMwIiBjeT0iMzQ1IiByeD0iMTgiIHJ5PSIyOCIgZmlsbD0idXJsKCNyaW1MaWdodCkiIC8+CiAgPGVsbGlwc2UgY3g9IjIzMiIgY3k9IjM2OCIgcng9IjIyIiByeT0iMTIiIGZpbGw9IiMyNTYzRUIiIC8+CgogIDwhLS0gTWFpbiBjbG91ZCBib2R5IC0tPgogIDxlbGxpcHNlIGN4PSIyMDAiIGN5PSIyNDAiIHJ4PSIxMTAiIHJ5PSIxMDUiIGZpbGw9InVybCgjYm9keUdyYWQpIiAvPgogIDxlbGxpcHNlIGN4PSIxNTUiIGN5PSIxNzAiIHJ4PSI1NSIgcnk9IjUwIiBmaWxsPSJ1cmwoI2JvZHlHcmFkKSIgLz4KICA8ZWxsaXBzZSBjeD0iMjQ1IiBjeT0iMTc1IiByeD0iNDgiIHJ5PSI0NSIgZmlsbD0idXJsKCNib2R5R3JhZCkiIC8+CiAgPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjE1NSIgcng9IjQ1IiByeT0iNDIiIGZpbGw9InVybCgjYm9keUdyYWQpIiAvPgogIDxlbGxpcHNlIGN4PSIxMjAiIGN5PSIyMjAiIHJ4PSI0MiIgcnk9IjUwIiBmaWxsPSJ1cmwoI2JvZHlHcmFkKSIgLz4KICA8ZWxsaXBzZSBjeD0iMjgwIiBjeT0iMjI1IiByeD0iNDAiIHJ5PSI0OCIgZmlsbD0idXJsKCNib2R5R3JhZCkiIC8+CiAgPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjMwMCIgcng9Ijk1IiByeT0iNTAiIGZpbGw9InVybCgjYm9keUdyYWQpIiAvPgoKICA8IS0tIEhpZ2hsaWdodHMgLS0+CiAgPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjI0MCIgcng9IjExMCIgcnk9IjEwNSIgZmlsbD0idXJsKCNib2R5SGlnaGxpZ2h0KSIgLz4KICA8ZWxsaXBzZSBjeD0iMTU1IiBjeT0iMTcwIiByeD0iNTUiIHJ5PSI1MCIgZmlsbD0idXJsKCNib2R5SGlnaGxpZ2h0KSIgLz4KICA8ZWxsaXBzZSBjeD0iMjQ1IiBjeT0iMTc1IiByeD0iNDgiIHJ5PSI0NSIgZmlsbD0idXJsKCNib2R5SGlnaGxpZ2h0KSIgLz4KICA8ZWxsaXBzZSBjeD0iMjAwIiBjeT0iMTU1IiByeD0iNDUiIHJ5PSI0MiIgZmlsbD0idXJsKCNib2R5SGlnaGxpZ2h0KSIgLz4KICA8ZWxsaXBzZSBjeD0iMjAwIiBjeT0iMjQwIiByeD0iMTEwIiByeT0iMTA1IiBmaWxsPSJ1cmwoI3JpbUxpZ2h0KSIgLz4KCiAgPCEtLSBBbnRlbm5hIGJ1bXBzIC0tPgogIDxlbGxpcHNlIGN4PSIxNzUiIGN5PSIxMjgiIHJ4PSIxMiIgcnk9IjE2IiBmaWxsPSIjM0I4MkY2IiAvPgogIDxlbGxpcHNlIGN4PSIxNzUiIGN5PSIxMjgiIHJ4PSIxMiIgcnk9IjE2IiBmaWxsPSJ1cmwoI2JvZHlIaWdobGlnaHQpIiAvPgogIDxlbGxpcHNlIGN4PSIxNzUiIGN5PSIxMjAiIHJ4PSI4IiByeT0iOCIgZmlsbD0iIzYwQTVGQSIgb3BhY2l0eT0iMC42IiAvPgogIDxlbGxpcHNlIGN4PSIyMjUiIGN5PSIxMzIiIHJ4PSIxMCIgcnk9IjE0IiBmaWxsPSIjM0I4MkY2IiAvPgogIDxlbGxpcHNlIGN4PSIyMjUiIGN5PSIxMzIiIHJ4PSIxMCIgcnk9IjE0IiBmaWxsPSJ1cmwoI2JvZHlIaWdobGlnaHQpIiAvPgogIDxlbGxpcHNlIGN4PSIyMjUiIGN5PSIxMjUiIHJ4PSI3IiByeT0iNyIgZmlsbD0iIzYwQTVGQSIgb3BhY2l0eT0iMC42IiAvPgoKICA8IS0tIEV5ZXMgLS0+CiAgPGVsbGlwc2UgY3g9IjE3MCIgY3k9IjIyOCIgcng9IjI0IiByeT0iMjYiIGZpbGw9InVybCgjZXllR3JhZCkiIC8+CiAgPGVsbGlwc2UgY3g9IjE2MyIgY3k9IjIxOCIgcng9IjYiIHJ5PSI3IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44NSIgLz4KICA8ZWxsaXBzZSBjeD0iMTc2IiBjeT0iMjM0IiByeD0iMyIgcnk9IjMuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIgLz4KICA8ZWxsaXBzZSBjeD0iMjMwIiBjeT0iMjI4IiByeD0iMjQiIHJ5PSIyNiIgZmlsbD0idXJsKCNleWVHcmFkKSIgLz4KICA8ZWxsaXBzZSBjeD0iMjIzIiBjeT0iMjE4IiByeD0iNiIgcnk9IjciIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjg1IiAvPgogIDxlbGxpcHNlIGN4PSIyMzYiIGN5PSIyMzQiIHJ4PSIzIiByeT0iMy41IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC40IiAvPgoKICA8IS0tIE1vdXRoIC0tPgogIDxwYXRoIGQ9Ik0gMTg4IDI2MiBRIDIwMCAyNzQgMjEyIDI2MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjUiIC8+CgogIDwhLS0gQ2hlZWsgYmx1c2ggLS0+CiAgPGVsbGlwc2UgY3g9IjE0NSIgY3k9IjI0OCIgcng9IjE0IiByeT0iOCIgZmlsbD0iIzYwQTVGQSIgb3BhY2l0eT0iMC4xNSIgLz4KICA8ZWxsaXBzZSBjeD0iMjU1IiBjeT0iMjQ4IiByeD0iMTQiIHJ5PSI4IiBmaWxsPSIjNjBBNUZBIiBvcGFjaXR5PSIwLjE1IiAvPgoKICA8IS0tIFNwZWN1bGFyIGhpZ2hsaWdodCAtLT4KICA8ZWxsaXBzZSBjeD0iMTg1IiBjeT0iMTY1IiByeD0iMzAiIHJ5PSIxMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMDgiIC8+Cjwvc3ZnPgo=";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Warm glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          }}
        />

        {/* Mascot + Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginBottom: 24,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascotSrc} alt="" width={140} height={140} />
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            relay
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#9A9590",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          the agent your agent sends to talk to people
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "#C4713B",
            letterSpacing: "0.1em",
          }}
        >
          relay.agustin.build
        </div>
      </div>
    ),
    { ...size }
  );
}
