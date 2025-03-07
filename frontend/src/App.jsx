import { BrowserRouter, Route, Routes } from "react-router";
import Cadastro from "./components/Cadastro/Cadastro";
import Home from "./components/Home/Home";
import Pedidos from "./components/Pedidos/Pedidos";
import Perfil from "./components/Perfil/Perfil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-route" element={<Cadastro />} />
        <Route path="/pedidos-route" element={<Pedidos />} />
        <Route path="/perfil-route" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
