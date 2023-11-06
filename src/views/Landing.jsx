import Carrousel from "../components/Carrousel.jsx";
import News from "../components/News.jsx";
import Announcements from "../components/Announcements.jsx";
import Footer from "../components/Footer.jsx";

export default function Landing() {
  return (
    <div className="landing_container">
      <Carrousel />
      <News />
      <Announcements />
      <Footer />
    </div>
  );
}
