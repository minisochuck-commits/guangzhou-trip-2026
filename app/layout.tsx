import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "广州行程 · 演示 | Guangzhou Visit Demo",
  description:
    "使用虚构访客和示例行程的三语广州接待工具：中文 / English / العربية。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  // 加到手机主屏后当独立应用打开，配合 sw.js 做到没网也能看
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "广州行程",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e4002b",
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
