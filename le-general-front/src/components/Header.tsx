import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import DrawerSideNavbar from "../components/DrawerSideNavbar";

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showNavbar, setShowNavbar] = useState(false);
  const shouldShowNavbar = !isHomePage || showNavbar;

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const handleScroll = () => {
      setShowNavbar(window.scrollY > 480);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <>
      <AnnouncementBar />
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="relative h-24">
          <DrawerSideNavbar />
          <nav
            className={`absolute inset-0 flex items-center justify-center bg-[#231f1d] text-white text-[32px] font-mono transition-all duration-500 ease-in-out ${
              shouldShowNavbar
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
          >
            <Link to="/" className="hover:text-gray-400 transition-colors duration-200">
              LE GÉNÉRAL
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

