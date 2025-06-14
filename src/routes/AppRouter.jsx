import { Routes, Route } from "react-router-dom";
import AboutUs from "../pages/about-us/AboutUs";
import HowToUse from "../pages/how-to-use/HowToUse";
import NotFound from "../pages/not-found/NotFount";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import Inicio from "../pages/inicio/Inicio";
import Perfil from "../pages/perfil/Perfil";
import Explorer from "../pages/explorer/Explorer";
import App from "../App";
import CreateProject from "../pages/create-project/CreateProject";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/sobre-nosotros" element={<AboutUs />} />
      <Route path="/como-usar" element={<HowToUse />} />
      <Route path="/inicio-sesion" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/crear-proyecto" element={<CreateProject />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/explorar" element={<Explorer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
