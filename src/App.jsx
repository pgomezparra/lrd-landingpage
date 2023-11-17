// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Landing from "./views/Landing";
import Header from "./components/Header";
import Institution from "./views/Institution.jsx";
import News from "./views/News.jsx";
import Admissions from "./views/Admissions.jsx";

function App() {
  return (
      <>
        <div className="layout">
          <Header/>
          <section className="layout__container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/institution" element={<Institution />} />
              <Route path="/news" element={<News />} />
              <Route path="/admissions" element={<Admissions />} />
              {/*<Route path="*" element={<NotFound />} />*/}
            </Routes>
          </section>
        </div>
      </>
  );
}

export default App;