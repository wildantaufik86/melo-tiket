import { Router } from "express";
import { createTemplate, getAllTemplates, getTemplateById } from "../controllers/template.controller";
import upload from "../middleware/upload";
import createUploader from "../middleware/upload";
import validateRole from "../middleware/validateRole";
import authenticate from "../middleware/authenticate";

const templateRoutes = Router();

const templateUpload = createUploader("templateImage");

templateRoutes.get('/', getAllTemplates)
templateRoutes.get('/:id', getTemplateById)
templateRoutes.post('/create', authenticate, templateUpload.single('templateImage'), validateRole("superadmin"), createTemplate)

export default templateRoutes;
