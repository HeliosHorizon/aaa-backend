import Transaction from "../models/Transection.js";
import Project from "../models/Project.js";
import { parseText } from "../services/parser.js";
import User from "../models/User.js";

// ADD TRANSACTION
export async function addTransaction(req, res) {
  try {
    const {
      input,
      projectId,
      source,
      name,
      address,
      type // sell / purchase
    } = req.body;

    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.usage[source] >= user.limits[source]) {
      return res.status(400).json({ message: `${source} limit reached` });
    }

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🧠 Parse ONLY product fields
    const parsed = parseProduct(input);

    const transaction = await Transaction.create({
      userId,
      projectId,

      name,
      address,

      quantity: parsed.quantity,
      particular: parsed.particular,
      rate: parsed.rate,
      amount: parsed.amount,

      type, // dropdown controlled

      source
    });

    user.usage[source] += 1;
    await user.save();

    res.json({ message: "Transaction added", transaction });

  } catch (error) {
    res.status(500).json({ message: "Failed to add transaction" });
  }
}
