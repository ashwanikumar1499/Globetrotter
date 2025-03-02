import { Schema, model, models } from "mongoose";

const DestinationSchema = new Schema({
  city: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  country: {
    type: String,
    required: true,
  },
  clues: {
    type: [String],
    validate: [arrayLimit, "Must have at least 2 clues"],
    required: true,
  },
  fun_fact: {
    type: [String],
    validate: [arrayLimit, "Must have at least 2 facts"],
    required: true,
  },
  trivia: {
    type: [String],
    validate: [arrayLimit, "Must have at least 2 trivia items"],
    required: true,
  },
});

function arrayLimit(arr: string[]) {
  return arr.length >= 2;
}

// Check if the model exists before creating a new one
export default models.Destination || model("Destination", DestinationSchema);
