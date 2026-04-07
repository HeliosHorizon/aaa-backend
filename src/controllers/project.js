import Project from "../models/Project.js";
import Transaction from "../models/Transection.js";

// CREATE PROJECT
export async function createProject(req, res) {
  try {
    const { name, fields } = req.body;

    const project = await Project.create({
      userId: req.user.userId,
      name,
      fields: fields || ["amount", "category", "description"]
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET ALL PROJECTS
export async function getProjects(req, res) {
  try {
    const projects = await Project.find({
      userId: req.user.userId
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET SINGLE PROJECT
export async function getProjectById(req, res) {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// UPDATE PROJECT
export async function updateProject(req, res) {
  try {
    const { name, fields } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, fields },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// DELETE PROJECT


export async function deleteProject  (req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Delete project
    await Project.findOneAndDelete({ _id: id, userId });

    // 🔥 Delete all related transactions
    await Transaction.deleteMany({ projectId: id });

    res.json({ message: "Project and transactions deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};