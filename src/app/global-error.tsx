"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          background: "#12100d",
          color: "#f7f0e5",
          fontFamily: "Tahoma, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 22, margin: 0 }}>تعذر تحميل الموقع</h1>
        <p style={{ fontSize: 14, opacity: 0.85, maxWidth: 360 }}>
          أوقف السيرفر، احذف مجلد .next، ثم شغّل: npm run build ثم npm run start
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            border: "none",
            background: "#c4a052",
            color: "#17120b",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
