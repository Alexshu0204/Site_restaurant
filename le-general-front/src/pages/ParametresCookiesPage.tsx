import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ParametresCookiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715]">
      <Header />

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-mono text-3xl uppercase tracking-widest text-white md:text-4xl">
              Paramètres des cookies
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-stone-500"></div>
          </div>

          <div className="space-y-10 text-stone-300 font-sans leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">Une approche respectueuse</h2>
              <p>
                Contrairement à la majorité des sites internet, nous avons fait le choix de respecter scrupuleusement votre vie privée en minimisant notre empreinte numérique.
              </p>
              <div className="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-lg font-semibold text-white">Nous ne vous traquons pas.</p>
                <p className="mt-2 text-stone-300">
                  Ce site web utilise <strong>uniquement</strong> des cookies ou technologies de stockage local strictement nécessaires à son fonctionnement (sécurité, session). Nous n'utilisons aucun cookie de suivi publicitaire, aucun cookie de statistiques invasif, ni de cookies de réseaux sociaux.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">Est-ce légalement suffisant ?</h2>
              <p>
                Oui. Selon les directives de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) et conformément au RGPD :
              </p>
              <p className="italic border-l-2 border-stone-500 pl-4 text-stone-400">
                "Si votre site ne dépose que des cookies strictement nécessaires à la fourniture du service (panier d'achat, authentification, équilibrage de charge, etc.), vous n'avez pas l'obligation de recueillir le consentement préalable de l'internaute sous forme de bandeau."
              </p>
              <p>
                Puisque nous n'insérons aucune publicité ciblée et ne revendons pas vos données de navigation à Google ou Meta, <strong>aucun bandeau de cookies intempestif ne viendra gêner votre lecture de notre menu</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">Technologies utilisées</h2>
              <p>
                Nous n'utilisons pas de cookies de session traditionnels. Pour assurer le fonctionnement sécurisé du site, nous utilisons des technologies de stockage local (Local Storage, Session Storage) et des jetons d'authentification cryptés (JWT) pour :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintenir la connexion sécurisée des utilisateurs autorisés (équipe du restaurant).</li>
                <li>Gérer vos sessions de réservation temporaires.</li>
                <li>Prévenir les cyber-attaques (protection anti-spam, limitation de requêtes).</li>
              </ul>
              <p>
                Vous pouvez néanmoins choisir de bloquer ces technologies via les paramètres natifs de votre navigateur, mais le site pourrait cesser de fonctionner correctement.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}