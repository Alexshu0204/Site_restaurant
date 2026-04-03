import Header from "../components/Header";
import Footer from "../components/Footer";

const partners = [
  {
    name: "Deliveroo",
    logo: "/deliveroo.svg",
    url: "https://deliveroo.fr/fr/menu/paris/paris-17eme-neuilly-porte-maillot/le-general-by-night",
    bgColor: "bg-[#00ccbc]",
  },
  {
    name: "Uber Eats",
    logo: "/uber-eats.svg",
    url: "https://www.ubereats.com/fr/store/le-general/ffxaJe0CQOWbCJc-Sjtvxw?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMlNhaW50LVAlQzMlQTlyYXklMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJDaElKSTBtdGtDWlo5VWNSd0lUcnk2ODhDUVElMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIyZ29vZ2xlX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBNDQuOTQ0ODE2JTJDJTIybG9uZ2l0dWRlJTIyJTNBNC44NDE5MDI5OTk5OTk5OTklN0Q%3D",
    bgColor: "bg-white",
  },
];

export default function Delivery() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715]">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Titre */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-mono text-3xl uppercase tracking-widest text-white md:text-4xl">
              Livraison
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-stone-500"></div>
          </div>

          {/* Sous-titre */}
          <p className="mb-12 text-center font-mono uppercase tracking-widest text-stone-400 text-sm">
            Disponible chez un de nos partenaires
          </p>

          {/* Cartes partenaires */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-6 border border-white/10 bg-white/5 p-10 rounded-lg transition-all hover:bg-white/10 hover:border-white/30"
              >
                <div className={`flex items-center justify-center rounded-lg p-4 w-40 h-20 ${partner.bgColor}`}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="font-mono text-sm uppercase tracking-widest text-white group-hover:text-stone-300 transition-colors">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}