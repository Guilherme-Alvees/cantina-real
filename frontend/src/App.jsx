import { BrowserRouter, Route, Routes } from "react-router";
import Cadastro from "./components/Cadastro/Cadastro";
import Home from "./components/Home/Home";
import Pedidos from "./components/Pedidos/Pedidos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-route" element={<Cadastro />} />
        <Route path="/pedidos-route" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
