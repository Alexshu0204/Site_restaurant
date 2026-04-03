import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MentionsLegalesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715]">
      <Header />

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-mono text-3xl uppercase tracking-widest text-white md:text-4xl">
              Mentions Légales
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-stone-500"></div>
          </div>

          <div className="space-y-10 text-stone-300 font-sans leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">1. Éditeur du site</h2>
              <p>
                Conformément aux dispositions de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Raison sociale :</strong> RPM WAGRAM (sous l'enseigne "Le Général")</li>
                <li><strong>Forme juridique :</strong> [À COMPLÉTER - ex: SAS, SARL, etc.]</li>
                <li><strong>Capital social :</strong> [À COMPLÉTER - ex: 10 000€]</li>
                <li><strong>Adresse du siège social :</strong> 17 Avenue de Wagram, 75017 Paris</li>
                <li><strong>Numéro RCS / SIRET :</strong> [À COMPLÉTER - ex: 123 456 789 RCS Paris]</li>
                <li><strong>Numéro de TVA Intracommunautaire :</strong> [À COMPLÉTER - ex: FR123456789]</li>
                <li><strong>Téléphone :</strong> +33 1 43 80 34 12</li>
                <li><strong>Email :</strong> [À COMPLÉTER - ex: contact@legeneralwagram.com]</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">2. Directeur de la publication</h2>
              <p>
                <strong>Nom du directeur de la publication :</strong> [À COMPLÉTER - Nom du responsable / dirigeant]<br />
                <em>(Le directeur de la publication est la personne responsable juridiquement du contenu du site)</em>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">3. Création du site</h2>
              <p>
                <strong>Développeur :</strong> Alex SHU, développeur junior<br />
                <strong>Contact technique :</strong> [Ton email ou LinkedIn, optionnel]
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">4. Hébergement</h2>
              <p>
                Le site est hébergé par :<br />
                <strong>Nom de l'hébergeur :</strong> [À COMPLÉTER - ex: Vercel Inc. / Heroku / AWS]<br />
                <strong>Adresse de l'hébergeur :</strong> [À COMPLÉTER]<br />
                <strong>Téléphone de l'hébergeur :</strong> [À COMPLÉTER]
              </p>
              <p className="text-sm italic text-stone-500">
                Rappel de l'ancien hébergeur si besoin : Amazon Web Services EMEA SARL, 5 RUE PLAETIS, LUXEMBOURG.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">5. Propriété intellectuelle</h2>
              <p>
                Le site internet et l'ensemble de son contenu (textes, images, logos, vidéos, structure, etc.) sont la propriété exclusive de RPM WAGRAM ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de RPM WAGRAM.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">6. Limitations de responsabilité</h2>
              <p>
                RPM WAGRAM ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au présent site web.
              </p>
              <p>
                Des espaces interactifs (espace contact) sont à la disposition des utilisateurs. RPM WAGRAM se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}