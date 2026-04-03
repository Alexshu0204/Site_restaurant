import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import MainBookingPage from "./pages/MainBookingPage";
import EventsPage from "./pages/EventsPage";
import AvisClientsPage from "./pages/AvisClientsPage";
import Contact from "./pages/Contact";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import ProtectionDonneesPage from "./pages/ProtectionDonneesPage";
import ParametresCookiesPage from "./pages/ParametresCookiesPage";

function App() {
  return (
    // = Rails network routes, but for React. It defines which page to show for which URL.
    <Router> 
      {/* = The train tracks */}
      <Routes>
        {/* = The train stations */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservations" element={<MainBookingPage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/avis-clients" element={<AvisClientsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/protection-des-donnees" element={<ProtectionDonneesPage />} />
        <Route path="/parametres-cookies" element={<ParametresCookiesPage />} />
      </Routes>
    </Router>
  )
}

export default App


/* The <Routes> component contains all the <Route path="..." element={...} /> components.
Each path corresponds to a URL, and each element corresponds to a React page.
To add a new page, you add a new <Route ... /> line here. */
