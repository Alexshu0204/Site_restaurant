import Header from "../components/Header";
import Footer from "../components/Footer";

// Récupérés depuis legeneralwagram.com/fr
const reviews = [
  {
    id: 1,
    author: "M. Y",
    date: "il y a 6 mois",
    text: "Un immense bravo à Alexis, notre serveur au Général, Avenue de Wagram ! Son service a été tout simplement exceptionnel....",
    rating: 5,
  },
  {
    id: 2,
    author: "Saloua Sadik",
    date: "il y a 6 mois",
    text: "Super adresse ! Tout était délicieux, l’ambiance au top et le service adorable. Je reviendrai sans hésiter !",
    rating: 5,
  },
  {
    id: 3,
    author: "A m",
    date: "il y a 6 mois",
    text: "Endroit sympa avec happy hour pour boire ouvert 24/24. Réservation possible pour une dizaine de personnes. Bières et cocktails très...",
    rating: 5,
  },
  {
    id: 4,
    author: "Houman Soleimani Seresht",
    date: "il y a 6 mois",
    text: "The best place for taking late dinner after 12. Friendly staffs, nice serving and delicious foods. 100% recommended!",
    rating: 5,
  },
  {
    id: 5,
    author: "Daniil Sukhonos",
    date: "il y a 6 mois",
    text: "Good quality French cuisine. They have very attractive lunch option for a reasonable price.",
    rating: 5,
  },
  {
    id: 6,
    author: "Cevenn' Campers",
    date: "il y a 6 mois",
    text: "Un service top, des produits excellent, un prix raisonnable 👌",
    rating: 5,
  },
];

export default function AvisClientsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715]">
      {/* HEADER EXACTEMENT COMME SUR LES AUTRES PAGES */}
      <Header />

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-mono text-3xl uppercase tracking-widest text-white md:text-4xl">
              Avis clients
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-stone-500"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="flex flex-col border border-white/10 bg-white/5 p-6 rounded-lg transition-colors hover:bg-white/10"
              >
                {/* Utilisateur et Note */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar par défaut / Initiale */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-700 text-lg font-bold text-white shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-white">
                      {review.author}
                    </span>
                    <span className="text-xs text-stone-400 mb-1">
                      {review.date}
                    </span>
                    {/* Étoiles SVG (Google) */}
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Commentaire */}
                <p className="font-sans text-stone-300 italic flex-grow">
                  "{review.text}"
                </p>
                
                {/* Logo Google discret */}
                <div className="mt-4 flex justify-end">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone-500" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.757,3.951-5.445,3.951c-3.131,0-5.672-2.541-5.672-5.672s2.541-5.672,5.672-5.672c1.438,0,2.741,0.536,3.75,1.411l2.766-2.766C17.387,3.627,15.132,2.5,12.545,2.5c-5.467,0-9.889,4.422-9.889,9.889s4.422,9.889,9.889,9.889s9.889-4.422,9.889-9.889c0-0.671-0.065-1.321-0.188-1.951C22.247,10.239,12.545,10.239,12.545,10.239z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}