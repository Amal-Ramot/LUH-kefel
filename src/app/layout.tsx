import type { Metadata, Viewport } from "next";
import { NavBar } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "לוח הכפל בכיף",
  description: "לומדים את לוח הכפל עם דמויות, סיפורים, טריקים ומשחקים",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6d4aff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&family=Rubik:wght@500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="aurora" aria-hidden="true">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
          <span className="blob b4" />
        </div>
        <div className="grid-bg" aria-hidden="true" />
        <NavBar />
        <main className="container">{children}</main>
        <footer className="footer">
          לוח הכפל בכיף · ההתקדמות נשמרת במכשיר שלכם בלבד · איורים:{" "}
          <a href="https://github.com/microsoft/fluentui-emoji" target="_blank" rel="noreferrer">
            Microsoft Fluent Emoji
          </a>{" "}
          (MIT)
        </footer>
      </body>
    </html>
  );
}
