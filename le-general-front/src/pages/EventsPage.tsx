import Footer from '../components/Footer';
import Header from '../components/Header';
import SectionText from '../components/SectionText';

const socialLinks = [
  {
    label: 'Suivez nous sur Facebook',
    href: 'https://www.facebook.com/LEGENERALCafeBarGrill/?locale=fr_FR',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Suivez nous sur Instagram',
    href: 'https://www.instagram.com/legeneralwagram/?hl=fr',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Retrouvez nous sur TripAdvisor',
    href: 'https://fr.tripadvisor.be/Restaurant_Review-g187147-d7259802-Reviews-Le_General-Paris_Ile_de_France.html',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
  {
    label: 'Retrouvez nous sur Yelp',
    href: 'https://www.yelp.com/biz/le-general-paris-2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#231f1d]">
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      <SectionText
        title="NOS ÉVÉNEMENTS"
        description="Abonnez-vous à notre newsletter et suivez-nous sur les médias sociaux pour être tenus au courant de nos événements et de nos nouvelles."
        className="px-0 pt-40 pb-20 md:pt-44"
        titleClassName="mb-6"
        descriptionClassName="max-w-2xl px-6 text-center text-stone-300 md:px-12"
      >
        <div className="mt-10 flex flex-col items-center gap-4 px-6 w-full max-w-sm">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-[#2d2622] px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-white transition-all duration-200 hover:border-white/30 hover:bg-[#3a3330]"
            >
              <span className="shrink-0 text-stone-300">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </SectionText>
      <Footer />
    </div>
  );
}
