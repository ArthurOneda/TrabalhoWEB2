import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

function LandingPage() {
  const navigate = useNavigate();
  const [curriculos, setCurriculos] = useState([]);
  const [ultimos, setUltimos] = useState([]);

  useEffect(() => {
    async function carregar() {
      const res = await api.get("/");
      setCurriculos(res.data);
      setUltimos(res.data.slice(-3).reverse());
    }
    carregar();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">CV Builder</h1>
      <p className="text-center mb-8">Crie, edite e visualize seus currículos de forma simples e moderna.</p>

      <div className="flex justify-center space-x-4 mb-8">
        <button onClick={() => navigate("/criar-curriculo")} className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">Criar Meu Currículo</button>
        <button onClick={() => navigate("/visualizar-curriculos")} className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">Visualizar Currículos</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total de Currículos</h2>
          <p className="text-2xl mt-2">{curriculos.length}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <h2 className="font-semibold">Última Atualização</h2>
          <p className="mt-2">{curriculos.length ? new Date(parseInt(curriculos[curriculos.length-1].id)).toLocaleDateString() : "-"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <h2 className="font-semibold">Currículos Recentes</h2>
          <p className="mt-2">{ultimos.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Últimos Currículos Criados</h2>
        {ultimos.length ? ultimos.map(c => (
          <div key={c.id} className="border p-4 mb-2 rounded flex justify-between items-center shadow">
            <div>
              <p className="font-bold">{c.nome}</p>
              <p className="text-gray-600">{c.resumo || "Resumo não informado"}</p>
            </div>
            <button onClick={() => navigate(`/curriculo/${c.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Visualizar / Editar</button>
          </div>
        )) : <p>Nenhum currículo criado ainda.</p>}
      </div>
    </div>
  );
}

export default LandingPage;
