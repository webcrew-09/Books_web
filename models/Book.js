import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  BookTitle: String,
  BookAuthor: String,
  BookDesc: String,
});

export const BookData = mongoose.model("Books", BookSchema);