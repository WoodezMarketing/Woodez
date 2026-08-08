import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Marquee from "@/components/Marquee"
import Services from "@/components/Services"
import Creations from "@/components/Creations"
import Reveal from "@/components/Reveal"
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
        <Reveal />
        <Creations />
        <Services />
        <Comparison />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
