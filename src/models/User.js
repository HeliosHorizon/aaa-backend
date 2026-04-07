import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true },

  zoho: {
    connected: { type: Boolean, default: false },
    orgId: String,
    access_token: String,
    refresh_token: String
  },

  usage: {
    text: { type: Number, default: 0 },
    voice: { type: Number, default: 0 },
    image: { type: Number, default: 0 }
  },

  limits: {
    text: { type: Number, default: 50 },
    voice: { type: Number, default: 20 },
    image: { type: Number, default: 20 }
  }

}, { timestamps: true });

export default model("User", userSchema);