import "@/styles/globals.css";
import type { Metadata } from "next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full bg-gray-100">
      <body className="h-full">{children}</body>
    </html>
  );
}

// https://beta.nextjs.org/docs/api-reference/metadata
export const metadata: Metadata = {
  title: {
    default: "sinsky",
    template: "%s - sinsky"
  },
  description: "こんにちは!sinskyです。PythonやTypeScriptを使用してWebサイトの開発を行うデベロッパーです。現在はGASを使って業務の自動化に取り組んでいます。柔軟な思考と問題解決能力に自信がありますので、課題解決に役立つプログラミング技術を提供できます。ご興味のある方はぜひお問い合わせください。",
  authors: { name: "sinsky" },
  creator: "sinsky",
  keywords: ["React", "Next.js", "Python", "Django", "Developer", "デベロッパー", "サイト開発", "Webアプリケーション", "自動化", "GoogleAppsScript", "GAS"],
  referrer: "origin-when-cross-origin",
  openGraph: {
    url: "https://sinsky.dev",
    title: "Home - sinsky",
    description: "こんにちは!sinskyです。PythonやTypeScriptを使用してWebサイトの開発を行うデベロッパーです。現在はGASを使って業務の自動化に取り組んでいます。柔軟な思考と問題解決能力に自信がありますので、課題解決に役立つプログラミング技術を提供できます。ご興味のある方はぜひお問い合わせください。",
    siteName: "sinsky's portfolio",
    locale: "ja_JP",
    type: "website",
  },
  robots: {
    index: true,
    follow: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "standard",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/sinsky.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "sinsky's profile",
    creator: "@sin_sky_",
  },
};
