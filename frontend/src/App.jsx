import { BrowserRouter, Route, Routes } from "react-router";

import Cadastro from "./components/Cadastro/Cadastro";
import Home from "./components/Home/Home";
import Pedidos from "./components/Pedidos/Pedidos";
import Perfil from "./components/Perfil/Perfil";
import EditarPerfil from "./components/Perfil/EditarPerfil";
import Estoque from "./components/Produtos/Estoque";
import CadastroProduto from "./components/Produtos/CadastroProduto";
import Users from "./components/Users/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-route" element={<Cadastro />} />
        <Route path="/pedidos-route" element={<Pedidos />} />
        <Route path="/perfil-route" element={<Perfil />} />
        <Route path="/editar-perfil-route" element={<EditarPerfil />} />
        <Route path="/estoque-route" element={<Estoque />} />
        <Route path="/cadastro-produto-route" element={<CadastroProduto />} />
        <Route path="/users-route" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
