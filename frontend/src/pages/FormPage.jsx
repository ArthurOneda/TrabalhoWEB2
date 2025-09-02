import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { curriculoSchema } from "../utils/validation";
import { api } from "../utils/api";
import MaskedInput from "../components/MaskedInput";

function FormPage({ editMode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", resumo: "",
    endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
    experiencia: [], formacao: [], idiomas: []
  });

  // Carregar dados se editar
  useEffect(() => {
    if (editMode && id) {
      api.get(`/${id}`).then(res => setForm(res.data));
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("endereco.")) {
      const key = name.split(".")[1];
      setForm(prev => ({ ...prev, endereco: { ...prev.endereco, [key]: value } }));
    } else setForm(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (campo, item) => setForm(prev => ({ ...prev, [campo]: [...prev[campo], item] }));
  const removeItem = (campo, index) => setForm(prev => ({ ...prev, [campo]: prev[campo].filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      curriculoSchema.parse(form);
      if (editMode && id) {
        await api.put(`/${id}`, form);
        Swal.fire("Sucesso", "Currículo atualizado!", "success");
      } else {
        await api.post("/", form);
        Swal.fire("Sucesso", "Currículo criado!", "success");
      }
      navigate("/visualizar-curriculos");
    } catch (err) {
      Swal.fire("Erro", err.errors?.map(e => e.message).join("<br>") || err.message, "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? "Editar Currículo" : "Criar Currículo"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Informações Pessoais */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Informações Pessoais</h2>
          <input className="input" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <MaskedInput className="input" mask="(00) 00000-0000" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
          <MaskedInput className="input" mask="00000-000" name="endereco.cep" placeholder="CEP" value={form.endereco.cep} onChange={handleChange} />
          <input className="input" name="endereco.rua" placeholder="Rua" value={form.endereco.rua} onChange={handleChange} />
          <input className="input" name="endereco.numero" placeholder="Número" value={form.endereco.numero} onChange={handleChange} />
          <input className="input" name="endereco.bairro" placeholder="Bairro" value={form.endereco.bairro} onChange={handleChange} />
          <input className="input" name="endereco.cidade" placeholder="Cidade" value={form.endereco.cidade} onChange={handleChange} />
          <input className="input" name="endereco.estado" placeholder="Estado" value={form.endereco.estado} onChange={handleChange} />
        </div>

        {/* Resumo Profissional */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Resumo Profissional</h2>
          <textarea className="input" name="resumo" value={form.resumo} onChange={handleChange} placeholder="Resumo breve"></textarea>
        </div>

        {/* Experiência, Formação e Idiomas */}
        {["experiencia","formacao","idiomas"].map(campo => (
          <div key={campo} className="border p-4 rounded">
            <h2 className="font-semibold mb-2">{campo.charAt(0).toUpperCase()+campo.slice(1)}</h2>
            {form[campo].map((item,i) => (
              <div key={i} className="mb-2 border p-2 rounded flex justify-between">
                <p>{Object.values(item).join(" - ")}</p>
                <button type="button" className="text-red-500" onClick={() => removeItem(campo,i)}>Remover</button>
              </div>
            ))}
            <button type="button" className="text-blue-500" onClick={() => addItem(campo, {})}>Adicionar {campo}</button>
          </div>
        ))}

        <div className="flex space-x-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Salvar Currículo</button>
          <button type="button" onClick={() => navigate("/")} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
        </div>

      </form>
    </div>
  );
}

export default FormPage;
