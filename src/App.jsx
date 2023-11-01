import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./views/Landing";
import Header from "./components/Header";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
  ]);

  return (
    <>
      <div className="layout">
        <Header />
        <section className="container">
          <RouterProvider router={router} />
        </section>
        <Footer />
      </div>
    </>
  );
}

export default App;
