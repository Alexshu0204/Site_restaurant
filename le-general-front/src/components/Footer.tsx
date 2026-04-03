import { Link } from 'react-router-dom';

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/LEGENERALCafeBarGrill/?locale=fr_FR',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/legeneralwagram/?hl=fr',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TripAdvisor',
    href: 'https://fr.tripadvisor.be/Restaurant_Review-g187147-d7259802-Reviews-Le_General-Paris_Ile_de_France.html',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.476 2 2 6.476 2 12s4.476 10 10 10 10-4.476 10-10S17.524 2 12 2zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 12 5zm0 2a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </svg>
    ),
  },
  {
    label: 'Yelp',
    href: 'https://www.yelp.com/biz/le-general-paris-2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.16 12.73l-3.34.77a1.13 1.13 0 0 1-1.35-1.34l.77-3.35a1.13 1.13 0 0 1 1.9-.55l2.57 2.57a1.13 1.13 0 0 1-.55 1.9zM11 4.5V7.8a1.13 1.13 0 0 0 1.73.95l2.86-1.73a1.13 1.13 0 0 0-.2-2.02L12.48 3.6A1.13 1.13 0 0 0 11 4.5zM9.2 9.2a1.13 1.13 0 0 0-1.9-.55L4.73 11.2a1.13 1.13 0 0 0 .55 1.9l3.34.77a1.13 1.13 0 0 0 1.35-1.35L9.2 9.2zm-.53 5.55-3.35.77a1.13 1.13 0 0 0-.55 1.9l2.57 2.57a1.13 1.13 0 0 0 1.9-.55l.77-3.34a1.13 1.13 0 0 0-1.34-1.35zm4.06 1.12a1.13 1.13 0 0 0-1.73.95v3.3a1.13 1.13 0 0 0 1.48.9l2.86-1a1.13 1.13 0 0 0 .2-2.02l-2.81-2.13z" />
      </svg>
    ),
  },
];

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Avis clients', to: '/avis-clients' },
  { label: 'Contact', to: '/contact' },
];

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Protection des données', to: '/protection-des-donnees' },
  { label: 'Paramètres des cookies', to: '/parametres-cookies' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#1a1715] text-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
        <div className="flex flex-col items-center gap-12 text-center md:flex-row md:items-start md:justify-between md:text-left">
          
          {/* Left / Logo */}
          <div className="flex justify-center md:justify-start shrink-0">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-white/5 p-1">
              <img 
                src="https://v2cdn0.centralappstatic.com/image/clip/588x587_logo_14db553e28984f489d9b99815f926bd9.webp?edge=600" 
                alt="Le Général" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Middle : address + phone + social icons */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=48.875841,2.2961872"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-stone-200 transition-colors hover:text-white"
            >
              17 Av. de Wagram, 75017 Paris
            </a>
            <a
              href="tel:+33143803412"
              className="text-[14px] font-medium text-stone-200 transition-colors hover:text-white"
            >
              +33 1 43 80 34 12
            </a>

            {/* Social icons */}
            <div className="mt-2 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-stone-300 transition-all duration-200 hover:bg-white/20 hover:text-white"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right : internal nav links */}
          <nav className="flex flex-col items-center md:items-end gap-3 text-sm">
            {navLinks.map((link) => (
              <Link
                 key={link.to}
                 to={link.to}
                 className="text-[15px] font-medium tracking-wide text-stone-200 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-6 pb-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-center text-xs text-stone-400 lg:flex-row lg:flex-wrap">
          <span>© Le Général {currentYear}</span>
          <span className="hidden lg:inline text-stone-600">•</span>
          {legalLinks.map((link, index) => (
            <div key={link.to} className="flex items-center gap-4">
              <Link
                to={link.to}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
              {index !== legalLinks.length - 1 && <span className="hidden lg:inline text-stone-600">•</span>}
            </div>
          ))}
          <span className="hidden lg:inline text-stone-600">•</span>
          <span className="text-stone-300">
            Créé par <span className="font-semibold text-white">Alex SHU, dév junior</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
