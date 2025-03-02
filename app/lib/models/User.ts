import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
});

// Check if the model exists before creating a new one
export default models.User || model("User", UserSchema);
