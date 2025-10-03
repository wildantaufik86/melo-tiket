import { Router } from "express";
import { createTemplate, getAllTemplates, getTemplateById } from "../controllers/template.controller";
import upload from "../middleware/upload";
import createUploader from "../middleware/upload";
import validateRole from "../middleware/validateRole";

const templateRoutes = Router();

const templateUpload = createUploader("templateImage");

templateRoutes.get('/', getAllTemplates)
templateRoutes.get('/:id', getTemplateById)
templateRoutes.post('/create', templateUpload.single('templateImage'), validateRole("superadmin"), createTemplate)

export default templateRoutes;
