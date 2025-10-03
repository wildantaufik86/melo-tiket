import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, softDeleteCategoryHandler, updateCategory } from "../controllers/category.controller";
import authenticate from "../middleware/authenticate";
import validateRole from "../middleware/validateRole";

const categoryRoutes = Router();

categoryRoutes.get('/', getCategories);
categoryRoutes.get('/:id', getCategoryById);
categoryRoutes.post('/create', authenticate, validateRole("superadmin"), createCategory);
categoryRoutes.put('/update/:id', authenticate, validateRole("superadmin"), updateCategory);
categoryRoutes.delete('/:categoryId', authenticate, validateRole("admin", "superadmin"), softDeleteCategoryHandler);

export default categoryRoutes;
