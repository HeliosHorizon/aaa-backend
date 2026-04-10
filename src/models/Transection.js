import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },

  name: String,
address: String,

quantity: Number,
particular: String,
rate: Number,
amount: Number,

type: {
  type: String,
  enum: ["sell", "purchase"]
},

date: {
  type: Date,
  default: Date.now
},

syncedToZoho: { type: Boolean, default: false }

}, { timestamps: true });

export default model("Transaction", transactionSchema);