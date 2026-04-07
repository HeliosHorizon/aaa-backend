import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.js";

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

export default router;