import { useState, useEffect } from "react";
import AnnouncementBar from "./AnnouncementBar";
import DrawerSideNavbar from "../components/DrawerSideNavbar";

export default function Header() {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const hanbdleScroll = () => {
      if (window.scrollY > 480) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", hanbdleScroll);
    return () => window.removeEventListener("scroll", hanbdleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <AnnouncementBar />
      <div className="relative h-24">
        <DrawerSideNavbar />
        <nav
          className={`absolute inset-0 flex items-center justify-center bg-[#231f1d] text-white text-[32px] font-mono transition-all duration-500 ease-in-out ${
            showNavbar
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          LE GÉNÉRAL
        </nav>
      </div>
    </div>
  );
}

