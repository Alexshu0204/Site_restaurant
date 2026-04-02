import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";

function App() {
  return (
    // = Rails network routes, but for React. It defines which page to show for which URL.
    <Router> 
      {/* = The train tracks */}
      <Routes>
        {/* = The train stations */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  )
}

export default App


/* The <Routes> component contains all the <Route path="..." element={...} /> components.
Each path corresponds to a URL, and each element corresponds to a React page.
To add a new page, you add a new <Route ... /> line here. */
