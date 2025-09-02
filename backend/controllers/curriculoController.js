import fs from "fs";
const arquivo = "./curriculos.json";

const lerDados = () => JSON.parse(fs.readFileSync(arquivo, "utf-8"));
const salvarDados = (dados) => fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

export const getCurriculos = (req, res) => {
  const dados = lerDados();
  res.json(dados);
};

export const getCurriculoById = (req, res) => {
  const dados = lerDados();
  const curriculo = dados.find(c => c.id === req.params.id);
  if (!curriculo) return res.status(404).json({ message: "Currículo não encontrado" });
  res.json(curriculo);
};

export const createCurriculo = (req, res) => {
  const dados = lerDados();
  const novo = { id: Date.now().toString(), ...req.body };
  dados.push(novo);
  salvarDados(dados);
  res.status(201).json(novo);
};

export const updateCurriculo = (req, res) => {
  const dados = lerDados();
  const index = dados.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Currículo não encontrado" });
  dados[index] = { ...dados[index], ...req.body };
  salvarDados(dados);
  res.json(dados[index]);
};

export const deleteCurriculo = (req, res) => {
  let dados = lerDados();
  dados = dados.filter(c => c.id !== req.params.id);
  salvarDados(dados);
  res.json({ message: "Currículo deletado" });
};
