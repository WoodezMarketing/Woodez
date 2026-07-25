import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Marquee from "@/components/Marquee"
import Stats from "@/components/Stats"
import Services from "@/components/Services"
import Creations from "@/components/Creations"
import Comparison from "@/components/Comparison"
import Faq from "@/components/Faq"
import FinalCta from "@/components/FinalCta"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <Creations />
        <Comparison />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
