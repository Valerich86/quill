import type { Metadata } from "next";
import "./globals.css";
import { font_default } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    template: "Quill | %s",
    default: "Quill",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font_default.className} antialiased bg-primary`}
      >
        {children}
      </body>
    </html>
  );
}
