import { Schema, model, models } from "mongoose";

const GameSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).slice(2, 10).toUpperCase(),
  },
  attemptQutions: [
    {
      questioId: Number,
      feedback: {
        type: String,
        enum: ["notAttempted", "correct", "incorrect"],
        default: "notAttempted",
      },
    },
  ],
  expiresAt: { type: Date, default: () => Date.now() + 24 * 3600 * 1000 },
});

// Check if the model exists before creating a new one
export default models.Game || model("Game", GameSchema);
