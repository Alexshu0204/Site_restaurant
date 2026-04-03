import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProtectionDonneesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715]">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-mono text-3xl uppercase tracking-widest text-white md:text-4xl">
              Politique de confidentialité
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-stone-500"></div>
          </div>

          <div className="space-y-10 text-stone-300 font-sans leading-relaxed">
            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">1. Responsable du traitement</h2>
              <p>
                Les données à caractère personnel collectées sur le site legeneralwagram.com sont traitées par la société RPM WAGRAM (enseigne "Le Général"), SAS au capital de [Capital] dont le siège social est situé au 17 Avenue de Wagram, 75017 Paris.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">2. Type de données collectées</h2>
              <p>
                Nous veillons à collecter uniquement les données strictement nécessaires à la finalité des traitements mis en œuvre (principe de minimisation des données) :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Via le formulaire de contact :</strong> Prénom, nom, adresse e-mail, numéro de téléphone, contenu du message.</li>
                <li><strong>Via le module de réservation :</strong> Les données nécessaires pour garantir votre table (coordonnées, nombre de personnes, date et heure, éventuelles allergies).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">3. Finalité de la collecte</h2>
              <p>
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Répondre à vos demandes de renseignements ou réclamations.</li>
                <li>Traiter et gérer vos réservations de table ou demandes de privatisation.</li>
                <li>La gestion technique du site (sécurité, protection anti-spam via notre back-end).</li>
              </ul>
              <p>Elles ne sont <strong>jamais</strong> vendues ou cédées à des tiers à des fins de prospection commerciale.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">4. Durée de conservation</h2>
              <p>
                Les données de contact sont conservées le temps nécessaire au traitement de la demande, et au maximum pendant 3 ans après le dernier contact émanant de vous. Les données de réservation sont conservées conformément aux obligations légales de tenue de registres commerciaux.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xl text-white uppercase tracking-widest">5. Vos droits (RGPD)</h2>
              <p>
                Conformément à la Loi "Informatique et Libertés" modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Droit d'accès et d'information.</li>
                <li>Droit de rectification (mettre à jour vos données).</li>
                <li>Droit à l'effacement (le "droit à l'oubli").</li>
                <li>Droit à la limitation du traitement.</li>
              </ul>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à tout moment en utilisant le <Link to="/contact" className="text-white underline">formulaire de contact</Link> ou par voie postale au siège social (17 Av. de Wagram, 75017 Paris).
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}