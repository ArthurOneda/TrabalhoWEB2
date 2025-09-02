import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../utils/api";

function ViewPage() {
  const navigate = useNavigate();
  const [curriculos, setCurriculos] = useState([]);

  useEffect(() => { carregar(); }, []);
  const carregar = async () => {
    const res = await api.get("/");
    setCurriculos(res.data);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Não será possível reverter!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.delete(`/${id}`);
        carregar();
        Swal.fire('Deletado!', 'O currículo foi removido.', 'success');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currículos</h1>
      {curriculos.map(c => (
        <div key={c.id} className="border p-4 mb-2 rounded flex justify-between items-center shadow">
          <div>
            <p className="font-bold">{c.nome}</p>
            <p className="text-gray-600">{c.resumo || "Resumo não informado"}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => navigate(`/curriculo/${c.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded">Editar</button>
            <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-3 py-1 rounded">Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewPage;
