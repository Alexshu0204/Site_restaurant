import { useState } from 'react';;

export default function AnnouncementBar() {
  const [show, setShow] = useState(true);

  // if 'show' is false, we don't return anything (the banner disappears)
  if (!show) return null;

  return (
    <div className="bg-[#8b0000] text-white py-2 px-4 flex items-center relative z-[110] ">
      <div className="flex-1 text-center">
        <p className="text-[15px] tracking-[0.2em] font-mono uppercase">
          OUVERT 7J/7 24H/24 MÊME LES JOURS FÉRIÉS !
        </p>
      </div>
      <button 
        onClick={() => setShow(false)} 
        className="absolute right-4 hover:opacity-70 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}