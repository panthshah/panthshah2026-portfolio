import type { Metadata, Viewport } from "next";
import { Alegreya, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/footer/Footer";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { XRay } from "@/components/xray/XRay";
import { BOOT } from "@/lib/appearance";
import { idleBotSrc } from "@/lib/bot/idle";
import { SITE } from "@/lib/site";
import "./globals.css";

// Bricolage Grotesque (OFL, fontsource 5.3.0) fixed at what the statement uses: weight 500, the display cut (opsz 96),
// Latin only. 21 KB instead of the 75 KB variable font. To add a weight, make another instance the same way.
const bricolage = localFont({
  src: "../assets/fonts/bricolage-500-display.woff2",
  variable: "--font-bricolage",
  weight: "500",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// small labels only (the Fold8 panel), so it isn't preloaded
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// the footer clock's serif; it sits at the bottom of the page, so it isn't preloaded
const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

// Description is the home page statement for now; swap in a final one before launch.
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  openGraph: { siteName: "Panth Shah", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", creator: "@panthshah_" },
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
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} ${alegreya.variable}`}
      suppressHydrationWarning // the boot script sets the visitor's saved colours on <html> before React starts
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <Sidebar idleAvatar={idleBotSrc("nav")} />
        {/* beside the sidebar on desktop; below that, under the fixed top bar and lined up with its avatar */}
        <main className="px-5 pt-under-bar pb-9 lg:pt-shell lg:pr-5 lg:pl-rail">{children}</main>
        <Footer />
        <XRay />
      </body>
    </html>
  );
}
