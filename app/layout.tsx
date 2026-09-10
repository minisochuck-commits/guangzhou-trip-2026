import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "广州行程 Guangzhou Visit · 20 SEP – 07 OCT 2026",
  description:
    "MINISO Egypt 广州行程分享页：日程、吃住行与来华指南，中文 / English / العربية。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" dir="ltr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
