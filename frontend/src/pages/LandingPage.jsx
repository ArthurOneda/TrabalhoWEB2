import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  const formatarData = (id) => {
    try {
      return new Date(parseInt(id)).toLocaleDateString('pt-BR');
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-12 py-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Transforme sua carreira com o
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CV Builder
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Crie, edite e visualize currículos profissionais de forma simples e moderna. 
              Destaque seu talento com designs que impressionam recrutadores.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <button 
              onClick={() => navigate("/criar-curriculo")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <span>+</span>
              Criar Meu Currículo
            </button>
            <button 
              onClick={() => navigate("/visualizar-curriculos")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <span>📋</span>
              Visualizar Todos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">{curriculos.length}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Total de Currículos</h3>
                <p className="text-gray-600">Criados até agora</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-4">
                  {curriculos.length ? formatarData(curriculos[curriculos.length-1].id) : "-"}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Última Atualização</h3>
                <p className="text-gray-600">Data mais recente</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-4">{ultimos.length}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Currículos Recentes</h3>
                <p className="text-gray-600">Últimos adicionados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Últimos Currículos Criados</h2>
              {ultimos.length > 0 && (
                <button 
                  onClick={() => navigate("/visualizar-curriculos")}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center gap-1"
                >
                  Ver todos →
                </button>
              )}
            </div>

            {ultimos.length > 0 ? (
              <div className="space-y-6">
                {ultimos.map(c => (
                  <div key={c.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">{c.nome}</h3>
                        <p className="text-gray-600 mb-3">
                          {c.resumo || "Resumo não informado"}
                        </p>
                        <p className="text-sm text-gray-500">
                          📅 Criado em: {formatarData(c.id)}
                        </p>
                      </div>
                      <button 
                        onClick={() => navigate(`/curriculo/${c.id}`)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg whitespace-nowrap"
                      >
                        Visualizar / Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-7xl mb-6">📄</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Nenhum currículo criado ainda</h3>
                <p className="text-gray-500 mb-8 text-lg">Comece criando seu primeiro currículo agora mesmo!</p>
                <button 
                  onClick={() => navigate("/criar-curriculo")}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-xl"
                >
                  Criar Primeiro Currículo
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;