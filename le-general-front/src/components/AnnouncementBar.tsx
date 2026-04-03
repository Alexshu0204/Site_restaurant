import { useState } from 'react';

export default function AnnouncementBar() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed bottom-12 right-4 z-[110] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-white/10 bg-[#8b0000]/95 px-4 py-3 text-white shadow-2xl backdrop-blur sm:max-w-md">
      <div className="pr-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] sm:text-xs">
          OUVERT 7J/7 24H/24 MÊME LES JOURS FÉRIÉS !
        </p>
      </div>
      <button
        type="button"
        onClick={() => setShow(false)}
        aria-label="Fermer l'annonce"
        className="absolute right-3 top-2 text-sm transition-opacity hover:opacity-70"
      >
        ✕
      </button>
    </div>
  );
}