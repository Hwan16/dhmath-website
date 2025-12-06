import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          padding: "72px 96px",
          background: "linear-gradient(135deg, #EEF2FF, #FDF2F8)",
          color: "#0f172a",
          fontFamily: "Pretendard, Inter, system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 9999,
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            color: "#4338ca",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          김다희 수학
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "9999px",
              backgroundColor: "#ec4899",
              display: "inline-block",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            고등 수학 전문 강사
            <br />
            김다희의 학습 아카이브
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "#334155",
              maxWidth: 780,
              lineHeight: 1.4,
            }}
          >
            아티클, 입시 전략, 온라인 강의, 일정까지 한눈에 확인하세요.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            color: "#6366F1",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366F1, #EC4899)",
              color: "#fff",
              fontSize: 22,
              boxShadow: "0 12px 30px rgba(99, 102, 241, 0.25)",
            }}
          >
            π
          </span>
          dahee math | dhmath
        </div>
      </div>
    ),
    size
  );
}
