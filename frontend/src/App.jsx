import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FormPage from "./pages/FormPage";
import ViewPage from "./pages/ViewPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/criar-curriculo" element={<FormPage editMode={false} />} />
        <Route path="/curriculo/:id" element={<FormPage editMode={true} />} />
        <Route path="/visualizar-curriculos" element={<ViewPage />} />
      </Routes>
    </Router>
  );
}
