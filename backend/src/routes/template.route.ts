import { Router } from "express";
import { createTemplate, getAllTemplates, getTemplateById } from "../controllers/template.controller";
import upload from "../middleware/upload";

const templateRoutes = Router();

templateRoutes.get('/', getAllTemplates)
templateRoutes.get('/:id', getTemplateById)
templateRoutes.post('/create', upload.single('templateImage'), createTemplate)

export default templateRoutes;
