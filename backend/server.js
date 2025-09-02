import express from "express";
import cors from "cors";
import curriculoRoutes from "./routes/curriculoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/curriculos", curriculoRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));