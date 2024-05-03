import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

// Method to toggle like for a post
commentSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
      this.likes.push(userId);
  } else {
      this.likes.splice(index, 1);
  }
};

export const Comment = mongoose.model("Comment", commentSchema);