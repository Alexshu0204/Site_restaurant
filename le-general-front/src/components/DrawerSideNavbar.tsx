import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DrawerSideNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute left-4 top-1/2 z-[60] -translate-y-1/2 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* dark overlay behind the drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[120]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* side drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#231f1d] text-white z-[130] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* navigation links */}
        <nav className="flex flex-col mt-20 px-8 gap-6 font-mono uppercase tracking-widest text-lg">
          <Link to="/menu" onClick={() => setIsOpen(false)} className="hover:text-gray-400 transition-colors duration-200">
            Menu
          </Link>
          <Link to="/reservation" onClick={() => setIsOpen(false)} className="hover:text-gray-400 transition-colors duration-200">
            Réservation
          </Link>
        </nav>
      </div>
    </>
  );
}