import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ViewPage() {
  const navigate = useNavigate();
  const [curriculos, setCurriculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => { 
    carregar(); 
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setCurriculos(res.data);
    } catch (err) {
      Swal.fire('Erro', 'Falha ao carregar currículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, nome) => {
    Swal.fire({
      title: 'Tem certeza?',
      html: `Deseja realmente deletar o currículo de <b>${nome}</b>?<br>Esta ação não poderá ser revertida!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/${id}`);
          carregar();
          Swal.fire('Deletado!', 'O currículo foi removido com sucesso.', 'success');
        } catch (err) {
          Swal.fire('Erro!', 'Falha ao deletar o currículo.', 'error');
        }
      }
    });
  };

  const formatDate = (id) => {
    try {
      return new Date(parseInt(id)).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  const filteredAndSortedCurriculos = curriculos
    .filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.resumo && c.resumo.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return parseInt(b.id) - parseInt(a.id);
      } else {
        return parseInt(a.id) - parseInt(b.id);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <Header />
        <div className="flex justify-center items-center h-96 flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-8 py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              📋 Meus Currículos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gerencie todos os seus currículos criados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{curriculos.length}</div>
                <h3 className="text-lg font-semibold text-gray-700">Total de Currículos</h3>
                <p className="text-gray-500 text-sm mt-1">Criados até agora</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {curriculos.length ? formatDate(curriculos[0].id) : "-"}
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Última Atualização</h3>
                <p className="text-gray-500 text-sm mt-1">Data mais recente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Buscar por nome ou resumo..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="oldest">Mais Antigos</option>
                </select>
              </div>
              <button 
                onClick={() => navigate("/criar-curriculo")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
              >
                + Novo Currículo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {filteredAndSortedCurriculos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'Nenhum currículo encontrado' : 'Nenhum currículo criado ainda'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? 'Tente usar outros termos de busca' 
                    : 'Comece criando seu primeiro currículo'
                  }
                </p>
                {!searchTerm && (
                  <button 
                    onClick={() => navigate("/criar-curriculo")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
                  >
                    Criar Primeiro Currículo
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedCurriculos.map(c => (
                  <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{c.nome}</h3>
                        <p className="text-gray-600 mt-1">
                          {c.resumo || "Resumo não informado"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          📅 Criado em: {formatDate(c.id)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/curriculo/${c.id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id, c.nome)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-lg"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ViewPage;