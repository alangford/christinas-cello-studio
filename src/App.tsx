import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import Recordings from "./pages/Recordings";
import Policies from "./pages/Policies";
import Faq from "./pages/Faq";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="student-testimonials" element={<Testimonials />} />
        <Route path="sample-recordings" element={<Recordings />} />
        <Route path="about-3" element={<Policies />} />
        <Route path="about-1" element={<Faq />} />
        <Route path="lessons" element={<Pricing />} />
        <Route path="contact-me" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
