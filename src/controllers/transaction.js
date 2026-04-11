import Transaction from "../models/Transection.js";
import Project from "../models/Project.js";
import { parseText, parseProduct } from "../services/parser.js";
import User from "../models/User.js";

// ADD TRANSACTION
// export async function addTransaction(req, res) {
//   try {
//     const { input, projectId, source } = req.body;

//     const userId = req.user.userId;

//     // 🔐 Check user
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 📊 Check usage limits
//     if (user.usage[source] >= user.limits[source]) {
//       return res.status(400).json({
//         message: `${source} limit reached`
//       });
//     }

//     // 📁 Check project
//     const project = await Project.findOne({
//       _id: projectId,
//       userId
//     });

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // 🧠 Parse input
//     const parsed = parseText(input);

//     // 💾 Save transaction
//     const transaction = await Transaction.create({
//       userId,
//       projectId,
//       amount: parsed.amount,
//       category: parsed.category,
//       description: parsed.description,
//       type: parsed.type,
//       source
//     });

//     // 📈 Update usage
//     user.usage[source] += 1;
//     await user.save();

//     res.json({
//       message: "Transaction added",
//       transaction,
//       parsed
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to add transaction" });

//   }
// }
export async function getTransactions(req, res) {
  try {
    const { projectId } = req.params;
    const { category, startDate, endDate } = req.query;

    const userId = req.user.userId;

    let filter = { userId, projectId };

    // Optional filters
    if (category) {
      filter.category = category;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
}
export async function getSummary(req, res) {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const transactions = await Transaction.find({ userId, projectId });

    let income = 0;
    let expense = 0;

    transactions.forEach(tx => {
      if (tx.type === "sell") {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
}


// ==========================
// 🔍 PREVIEW PARSED DATA
// ==========================
export async function previewTransaction(req, res) {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const parsed = parseProduct(input);

    return res.json({
      message: "Preview generated",
      parsed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Preview failed" });
  }
}


// ==========================
// 💾 SAVE TRANSACTION
// ==========================
export async function saveTransaction(req, res) {
  try {
    const {
      projectId,
      source,
      name,
      address,
      type, // sell / purchase

      // 🔥 parsed (editable values from frontend)
      quantity,
      particular,
      rate,
      amount
    } = req.body;

    const userId = req.user.userId;

    // 🔐 Validate user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 📊 Usage limit
    if (user.usage[source] >= user.limits[source]) {
      return res.status(400).json({ message: `${source} limit reached` });
    }

    // 📁 Validate project
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 🧾 Basic validation
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required. Please correct the data."
      });
    }

    // 💾 Save
    const transaction = await Transaction.create({
      userId,
      projectId,

      name,
      address,

      quantity,
      particular,
      rate,
      amount,

      type,
      source
    });

    // 📈 Update usage
    user.usage[source] += 1;
    await user.save();

    res.json({
      message: "Transaction saved successfully",
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save transaction" });
  }
}
