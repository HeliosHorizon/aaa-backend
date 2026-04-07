import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },

  amount: Number,
  category: String,
  description: String,

  extraFields: Object,

  type: {
  type: String,
  enum: ["income", "expense"]
},

  source: {
    type: String,
    enum: ["text", "voice", "image"],
    default: "text"
  },

  syncedToZoho: { type: Boolean, default: false }

}, { timestamps: true });

export default model("Transaction", transactionSchema);