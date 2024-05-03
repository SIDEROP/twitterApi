import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    img_url: String,
    video_url: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Method to toggle like for a post
postSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
      this.likes.push(userId);
  } else {
      this.likes.splice(index, 1);
  }
};


export const Post = mongoose.model("Post", postSchema);