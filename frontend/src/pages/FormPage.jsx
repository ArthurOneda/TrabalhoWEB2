import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { curriculoSchema } from "../utils/validation";
import { api } from "../utils/api";
import MaskedInput from "../components/MaskedInput";
import Header from "../components/Header";
import Footer from "../components/Footer";

function FormPage({ editMode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", resumo: "",
    endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
    experiencia: [], formacao: [], idiomas: []
  });

  const [loading, setLoading] = useState(editMode && id);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode && id) {
      const loadCurriculo = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/${id}`);
          setForm(res.data);
        } catch (err) {
          Swal.fire("Erro", "Falha ao carregar currículo", "error");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      loadCurriculo();
    }
  }, [editMode, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("endereco.")) {
      const key = name.split(".")[1];
      setForm(prev => ({ ...prev, endereco: { ...prev.endereco, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addItem = (campo, item) => {
    setForm(prev => ({ ...prev, [campo]: [...prev[campo], item] }));
    setErrors(prev => ({ ...prev, [campo]: null }));
  };

  const removeItem = (campo, index) => {
    setForm(prev => ({ 
      ...prev, 
      [campo]: prev[campo].filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
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
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(error => {
          const path = error.path.join('.');
          fieldErrors[path] = error.message;
        });
        setErrors(fieldErrors);
        Swal.fire("Erro", "Por favor, corrija os campos destacados", "error");
      } else {
        Swal.fire("Erro", err.message, "error");
      }
    }
  };

  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

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
              {editMode ? "✏️ Editar Currículo" : "📝 Criar Currículo"}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Preencha todas as informações abaixo para criar seu currículo profissional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">👤 Informações Pessoais</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nome ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="nome" 
                    placeholder="Digite seu nome completo" 
                    value={form.nome} 
                    onChange={handleChange} 
                  />
                  {renderError('nome')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="email" 
                    type="email"
                    placeholder="seu.email@exemplo.com" 
                    value={form.email} 
                    onChange={handleChange} 
                  />
                  {renderError('email')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                  <MaskedInput 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.telefone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    mask="(00) 00000-0000" 
                    name="telefone" 
                    placeholder="(00) 00000-0000" 
                    value={form.telefone} 
                    onChange={handleChange} 
                  />
                  {renderError('telefone')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CEP *</label>
                  <MaskedInput 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['endereco.cep'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    mask="00000-000" 
                    name="endereco.cep" 
                    placeholder="00000-000" 
                    value={form.endereco.cep} 
                    onChange={handleChange} 
                  />
                  {renderError('endereco.cep')}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rua *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['endereco.rua'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="endereco.rua" 
                    placeholder="Nome da rua" 
                    value={form.endereco.rua} 
                    onChange={handleChange} 
                  />
                  {renderError('endereco.rua')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Número *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['endereco.numero'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="endereco.numero" 
                    placeholder="Número" 
                    value={form.endereco.numero} 
                    onChange={handleChange} 
                  />
                  {renderError('endereco.numero')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['endereco.bairro'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="endereco.bairro" 
                    placeholder="Bairro" 
                    value={form.endereco.bairro} 
                    onChange={handleChange} 
                  />
                  {renderError('endereco.bairro')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['endereco.cidade'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="endereco.cidade" 
                    placeholder="Cidade" 
                    value={form.endereco.cidade} 
                    onChange={handleChange} 
                  />
                  {renderError('endereco.cidade')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors['endereco.estado'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    name="endereco.estado" 
                    placeholder="Estado" 
                    value={form.endereco.estado} 
                    onChange={handleChange} 
                    maxLength="2"
                  />
                  {renderError('endereco.estado')}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📝 Resumo Profissional</h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resumo *</label>
                <textarea 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.resumo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  name="resumo" 
                  value={form.resumo} 
                  onChange={handleChange} 
                  placeholder="Descreva brevemente sua experiência profissional, habilidades e objetivos de carreira..."
                  rows="4"
                ></textarea>
                <p className="text-gray-500 text-sm mt-1">Máximo 500 caracteres</p>
                {renderError('resumo')}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💼 Experiência Profissional</h2>
              </div>
              
              {form.experiencia.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Experiência #{index + 1}</h3>
                    <button 
                      type="button" 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                      onClick={() => removeItem('experiencia', index)}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa *</label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.empresa || ''}
                        onChange={(e) => {
                          const newExperiencia = [...form.experiencia];
                          newExperiencia[index] = { ...newExperiencia[index], empresa: e.target.value };
                          setForm(prev => ({ ...prev, experiencia: newExperiencia }));
                        }}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo *</label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.cargo || ''}
                        onChange={(e) => {
                          const newExperiencia = [...form.experiencia];
                          newExperiencia[index] = { ...newExperiencia[index], cargo: e.target.value };
                          setForm(prev => ({ ...prev, experiencia: newExperiencia }));
                        }}
                        placeholder="Seu cargo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Início *</label>
                      <input 
                        type="month"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.dataInicio || ''}
                        onChange={(e) => {
                          const newExperiencia = [...form.experiencia];
                          newExperiencia[index] = { ...newExperiencia[index], dataInicio: e.target.value };
                          setForm(prev => ({ ...prev, experiencia: newExperiencia }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Término</label>
                      <input 
                        type="month"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.dataFim || ''}
                        onChange={(e) => {
                          const newExperiencia = [...form.experiencia];
                          newExperiencia[index] = { ...newExperiencia[index], dataFim: e.target.value };
                          setForm(prev => ({ ...prev, experiencia: newExperiencia }));
                        }}
                        placeholder="Deixe em branco se atual"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição *</label>
                      <textarea 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.descricao || ''}
                        onChange={(e) => {
                          const newExperiencia = [...form.experiencia];
                          newExperiencia[index] = { ...newExperiencia[index], descricao: e.target.value };
                          setForm(prev => ({ ...prev, experiencia: newExperiencia }));
                        }}
                        placeholder="Descreva suas responsabilidades e conquistas..."
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
                onClick={() => addItem('experiencia', { 
                  empresa: '', 
                  cargo: '', 
                  dataInicio: '', 
                  dataFim: '', 
                  descricao: '' 
                })}
              >
                + Adicionar Experiência
              </button>
              {renderError('experiencia') && (
                <p className="text-red-500 text-sm mt-2">{errors.experiencia}</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🎓 Formação Acadêmica</h2>
              </div>
              
              {form.formacao.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Formação #{index + 1}</h3>
                    <button 
                      type="button" 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                      onClick={() => removeItem('formacao', index)}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instituição *</label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.instituicao || ''}
                        onChange={(e) => {
                          const newFormacao = [...form.formacao];
                          newFormacao[index] = { ...newFormacao[index], instituicao: e.target.value };
                          setForm(prev => ({ ...prev, formacao: newFormacao }));
                        }}
                        placeholder="Nome da instituição"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Curso *</label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.curso || ''}
                        onChange={(e) => {
                          const newFormacao = [...form.formacao];
                          newFormacao[index] = { ...newFormacao[index], curso: e.target.value };
                          setForm(prev => ({ ...prev, formacao: newFormacao }));
                        }}
                        placeholder="Nome do curso"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ano de Conclusão *</label>
                      <input 
                        type="number"
                        min="1900"
                        max="2030"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.anoConclusao || ''}
                        onChange={(e) => {
                          const newFormacao = [...form.formacao];
                          newFormacao[index] = { ...newFormacao[index], anoConclusao: e.target.value };
                          setForm(prev => ({ ...prev, formacao: newFormacao }));
                        }}
                        placeholder="Ex: 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Grau *</label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.grau || ''}
                        onChange={(e) => {
                          const newFormacao = [...form.formacao];
                          newFormacao[index] = { ...newFormacao[index], grau: e.target.value };
                          setForm(prev => ({ ...prev, formacao: newFormacao }));
                        }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Graduação">Graduação</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
                onClick={() => addItem('formacao', { 
                  instituicao: '', 
                  curso: '', 
                  anoConclusao: '', 
                  grau: '' 
                })}
              >
                + Adicionar Formação
              </button>
              {renderError('formacao') && (
                <p className="text-red-500 text-sm mt-2">{errors.formacao}</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🌍 Idiomas</h2>
              </div>
              
              {form.idiomas.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Idioma #{index + 1}</h3>
                    <button 
                      type="button" 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                      onClick={() => removeItem('idiomas', index)}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma *</label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.idioma || ''}
                        onChange={(e) => {
                          const newIdiomas = [...form.idiomas];
                          newIdiomas[index] = { ...newIdiomas[index], idioma: e.target.value };
                          setForm(prev => ({ ...prev, idiomas: newIdiomas }));
                        }}
                        placeholder="Ex: Inglês, Espanhol"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nível *</label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={item.nivel || ''}
                        onChange={(e) => {
                          const newIdiomas = [...form.idiomas];
                          newIdiomas[index] = { ...newIdiomas[index], nivel: e.target.value };
                          setForm(prev => ({ ...prev, idiomas: newIdiomas }));
                        }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Básico">Básico</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                        <option value="Fluente">Fluente</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
                onClick={() => addItem('idiomas', { idioma: '', nivel: '' })}
              >
                + Adicionar Idioma
              </button>
              {renderError('idiomas') && (
                <p className="text-red-500 text-sm mt-2">{errors.idiomas}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold text-lg"
              >
                💾 Salvar Currículo
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg transition-colors font-semibold text-lg shadow-lg"
              >
                ✖ Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FormPage;