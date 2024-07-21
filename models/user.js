import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

export const Data = mongoose.model("Users", DataSchema);

