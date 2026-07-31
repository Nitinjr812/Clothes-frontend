import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/Home/Home";

// Routing will be added as more pages come online (POS, Inventory, etc.)
// via react-router-dom. For now this renders the public landing page.
function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  return <Home />;
}

export default App;