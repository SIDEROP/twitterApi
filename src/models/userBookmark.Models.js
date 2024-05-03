import mongoose from "mongoose";

// Bookmark Schema
const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);