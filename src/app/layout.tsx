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
  themeColor: "#8e5cd9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&family=Varela+Round&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="sky" aria-hidden="true">
          <span className="cloud c1" />
          <span className="cloud c2" />
          <span className="cloud c3" />
        </div>
        <NavBar />
        <main className="container">{children}</main>
        <footer className="footer">נבנה באהבה ללומדים הצעירים ✨ כל ההתקדמות נשמרת במכשיר שלכם</footer>
      </body>
    </html>
  );
}
