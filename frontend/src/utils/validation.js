import { z } from "zod";

export const curriculoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.object({
    cep: z.string(),
    rua: z.string(),
    numero: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
  }),
  resumo: z.string().max(300, "Resumo muito longo"),
  experiencia: z.array(z.object({
    cargo: z.string(),
    empresa: z.string(),
    dataInicio: z.string(),
    dataFim: z.string().optional(),
    descricao: z.string(),
  })),
  formacao: z.array(z.object({
    curso: z.string(),
    instituicao: z.string(),
    anoConclusao: z.string(),
  })),
  idiomas: z.array(z.object({
    idioma: z.string(),
    nivel: z.enum(["Básico", "Intermediário", "Avançado", "Fluente"])
  })),
});
