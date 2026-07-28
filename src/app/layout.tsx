import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/SmoothScroll"
import PageTransition from "@/components/PageTransition"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://woodez.ca"),
  title: "Woodez — Email & SMS marketing pour ecommerce",
  description:
    "On fait de vos emails votre meilleur vendeur. Stratégie qui convertit, design sur mesure — jamais un template recyclé.",
  openGraph: {
    title: "Woodez — Email & SMS marketing pour ecommerce",
    description:
      "On fait de vos emails votre meilleur vendeur. Stratégie qui convertit, design sur mesure.",
    locale: "fr_CA",
    type: "website",
  },
  icons: { icon: "/brand/mascot.svg" },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA" className={inter.variable}>
      <body>
        <SmoothScroll />
        <PageTransition />
        {children}
      </body>
    </html>
  )
}
