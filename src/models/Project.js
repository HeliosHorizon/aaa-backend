import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },

  name: { type: String, required: true },

  fields: {
    type: [String],
    default: ["quantity", "rate", "amount","description"]
  }

}, { timestamps: true });

export default model("Project", projectSchema);