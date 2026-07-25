import Image from "next/image"
import { CONTACT, content } from "@/lib/content"

export default function Footer() {
  return (
    <footer className="bg-ink px-4 pt-16 pb-8 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-10 border-b-2 border-cream/15 pb-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Image
              src="/brand/wordmark-clear.svg"
              alt="Woodez"
              width={200}
              height={60}
              className="h-9 w-auto"
            />
            <p className="mt-5 leading-relaxed font-medium text-cream/70">{content.footer.tagline}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="display text-sm tracking-[0.14em] text-green">Navigation</h2>
              <ul className="mt-4 space-y-2.5">
                {content.nav.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-semibold text-cream/80 transition-colors hover:text-green"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="display text-sm tracking-[0.14em] text-green">Contact</h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-semibold text-cream/80 transition-colors hover:text-green"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.phoneHref}
                    className="font-semibold text-cream/80 transition-colors hover:text-green"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-cream/80 transition-colors hover:text-green"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Signature pleine largeur */}
        <p
          aria-hidden
          className="display mt-10 w-full text-center text-[clamp(3.5rem,18vw,14rem)] leading-none text-cream/10 select-none"
        >
          Woodez
        </p>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm font-semibold text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Woodez. {content.footer.rights}
          </p>
          <p>{content.footer.madeIn} 🍁</p>
        </div>
      </div>
    </footer>
  )
}
