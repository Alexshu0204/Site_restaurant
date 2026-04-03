import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../lib/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    acceptedTerms: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) return;

    try {
      setStatus("loading");
      
      await api.post("/contacts", {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        subject: "Message depuis le site internet",
        message: formData.message,
      });

      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        acceptedTerms: false,
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1715]">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-mono text-3xl uppercase tracking-widest text-white md:text-4xl">
              Infos & Contact
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-stone-500"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* LEFT COLUMN: Map & Information */}
            <div className="flex-1 space-y-8 text-stone-300">
              
              {/* Map Placeholder / Card */}
              <div className="h-64 w-full overflow-hidden rounded-lg bg-stone-800 border border-white/10 relative">
                <img 
                  src="https://v2cdn0.centralappstatic.com/provider/mapbox/io?u=aHR0cHM6Ly9hcGkubWFwYm94LmNvbS9zdHlsZXMvdjEvbWFwYm94L2RhcmstdjEwL3N0YXRpYy9waW4tcytmYWZhZmEoMi4yOTYxODcyLDQ4Ljg3NTg0MSkvMi4yOTYxODcyLDQ4Ljg3NTU5MSwxMywwLDAvMTIwMHg0MDBAMng/bG9nbz1mYWxzZQ==" 
                  alt="Carte de Le Général"
                  className="w-full h-full object-cover"
                />
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=48.875841,2.2961872"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black font-sans font-semibold text-sm px-6 py-2 rounded shadow-lg hover:bg-gray-200 transition-colors"
                >
                  ITINÉRAIRE
                </a>
              </div>

              {/* Address & Phone */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-mono uppercase tracking-widest mb-1">Le Général</h3>
                    <p className="font-sans text-stone-400">17 Av. de Wagram<br/>75017 Paris</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+33143803412" className="font-sans font-medium text-white hover:text-stone-300 transition-colors">
                    +33 1 43 80 34 12
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Contact Form */}
            <div className="flex-1">
              <h2 className="mb-8 font-mono text-2xl uppercase tracking-widest text-white">Nous contacter</h2>
              
              {status === "success" ? (
                <div className="bg-green-900/40 border border-green-500/50 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-white mb-2">Message envoyé !</h3>
                  <p className="text-stone-300">Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.</p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-6 font-mono text-sm uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="firstName" className="font-sans text-sm font-semibold text-stone-300">Prénom *</label>
                      <input 
                        type="text" 
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-transparent border border-stone-600 rounded px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="lastName" className="font-sans text-sm font-semibold text-stone-300">Nom *</label>
                      <input 
                        type="text" 
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-transparent border border-stone-600 rounded px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-sans text-sm font-semibold text-stone-300">Adresse e-mail *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-transparent border border-stone-600 rounded px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-sans text-sm font-semibold text-stone-300">Numéro de téléphone *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🇫🇷</span>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full bg-transparent border border-stone-600 rounded pl-12 pr-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-sans text-sm font-semibold text-stone-300">Message *</label>
                    <textarea 
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-transparent border border-stone-600 rounded px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors resize-y"
                    />
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="acceptedTerms"
                      name="acceptedTerms"
                      required
                      checked={formData.acceptedTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-stone-600 bg-transparent accent-white text-black outline-none focus:ring-1 focus:ring-white"
                    />
                    <label htmlFor="acceptedTerms" className="font-sans text-sm text-stone-400">
                      J'accepte que mes données personnelles soient utilisées dans le cadre de ma demande et je confirme avoir lu la <Link to="/protection-des-donnees" className="text-white underline hover:text-stone-300">politique de confidentialité</Link>.*
                    </label>
                  </div>

                  {status === "error" && (
                    <div className="text-red-500 font-sans text-sm">
                      Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === "loading" || !formData.acceptedTerms}
                    className="w-full bg-white text-black font-mono font-bold uppercase tracking-[0.2em] py-4 px-8 rounded hover:bg-stone-300 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4"
                  >
                    {status === "loading" ? "Envoi en cours..." : "ENVOYER LE MESSAGE"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}