import Transaction from "../models/Transection.js";
import Project from "../models/Project.js";
import { parseProduct } from "../services/parser.js";
import User from "../models/User.js";

import { extractTextFromImage } from "../services/ocr.js";
import { extractFromImageWithAI } from "../services/aiVersion.js";


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
// ==========================
// 📸 IMAGE → PREVIEW
// ==========================
// export async function previewFromImage(req, res) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "Image is required" });
//     }

//     // 🧠 STEP 1: OCR
//     const text = await extractTextFromImage(req.file.buffer);

//     if (!text) {
//       return res.status(500).json({ message: "OCR failed" });
//     }

//     // 🧠 STEP 2: CLEAN + SPLIT LINES
//     const lines = text
//       .split("\n")
//       .map(l => l.trim())
//       .filter(l => l.length > 0);

//     let parsedRows = [];

//     // 🧠 STEP 3: PARSE EACH LINE
//     for (let line of lines) {
//       const lower = line.toLowerCase();

//       // ❌ skip unwanted lines
//       if (
//         lower.includes("total") ||
//         lower.includes("balance") ||
//         line.length < 3
//       ) continue;

//       const parsed = parseProduct(line);

//       // ❌ skip useless parsed rows
//       if (!parsed.amount && !parsed.quantity) continue;

//       parsedRows.push({
//         raw: line,
//         ...parsed
//       });
//     }

//     // 🧠 STEP 4: OPTIONAL NAME DETECTION (first line fallback)
//     let detectedName = null;

//     if (lines.length > 0) {
//       const firstLine = lines[0];

//       if (!firstLine.match(/\d/)) {
//         detectedName = firstLine;
//       }
//     }

//     return res.json({
//       message: "OCR preview generated",
//       rawText: text, // 🔥 useful for debugging
//       detectedName,
//       rows: parsedRows
//     });

//   } catch (error) {
//     console.error("OCR PREVIEW ERROR:", error);
//     res.status(500).json({ message: "Failed to process image" });
//   }
// }


export async function previewFromImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const userId = req.user.userId;

    // 🔐 check usage limit
    const user = await User.findById(userId);

    if (user.usage.image >= user.limits.image) {
      return res.status(400).json({
        message: "Image AI limit reached"
      });
    }

    // 🔥 convert image to base64
    const base64Image = req.file.buffer.toString("base64");

    // 🧠 AI extraction
    const aiRows = await extractFromImageWithAI(base64Image);

   if (!aiRows || !Array.isArray(aiRows) || aiRows.length === 0) {
  return res.status(400).json({
    message: "AI could not extract rows",
    debug: aiRows
  });
}

    // 📈 update usage
    user.usage.image += 1;
    await user.save();

    return res.json({
      message: "AI preview generated",
      source: "ai",
      rows: aiRows
    });

  } catch (error) {
    console.error("AI PREVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to process image" });
  }
}