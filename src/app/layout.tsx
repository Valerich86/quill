import Header from "@/components/ui/header";
import "./globals.css";
import { font_default } from "@/lib/fonts";
import type { Metadata } from "next";
import { verifySession } from "@/lib/auth";
import CookieBanner from "@/components/cookie-banner";

export const metadata: Metadata = {
  title: {
    template: "Quill | %s",
    default: "Quill",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await verifySession();

  return (
    <html lang="en">
      <body
        className={`${font_default.className} antialiased bg-primary overflow-x-hidden`}
      >
        <Header user={user}/>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
