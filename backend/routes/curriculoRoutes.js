import express from "express";
import {
  getCurriculos,
  getCurriculoById,
  createCurriculo,
  updateCurriculo,
  deleteCurriculo
} from "../controllers/curriculoController.js";

const router = express.Router();

router.get("/", getCurriculos);
router.get("/:id", getCurriculoById);
router.post("/", createCurriculo);
router.put("/:id", updateCurriculo);
router.delete("/:id", deleteCurriculo);

export default router;
