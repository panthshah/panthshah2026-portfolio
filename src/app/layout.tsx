import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { idleAvatarSvg } from "@/lib/bot/idle";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Description is the home page statement for now; swap in a final one before launch.
export const metadata: Metadata = {
  title: {
    default: "Panth Shah",
    template: "%s · Panth Shah",
  },
  description:
    "Hi, I am Panth, a data driven designer shaping experiences for B2B and B2C Enterprises. Currently at Samsung, previously Founderway and Northeastern.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111213" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Sidebar idleAvatar={idleAvatarSvg} />
        {/* beside the sidebar on desktop; below that, under the fixed top bar and lined up with its avatar */}
        <main className="px-5 pt-under-bar pb-9 lg:pt-shell lg:pr-5 lg:pl-rail">{children}</main>
      </body>
    </html>
  );
}
