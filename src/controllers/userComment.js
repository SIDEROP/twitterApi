import { Comment } from "../models/userCommet.Models.js";
import { Post } from "../models/userPostModels.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { user, post, content } = req.body;
    const newComment = new Comment({ user, post, content });
    const savedComment = await newComment.save();

    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ success: true, data: savedComment, post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    if (!updatedComment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }
    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      deletedComment.post,
      { $pull: { comments: commentId } },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Comment deleted and removed from post successfully",
        post: updatedPost,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false }); // Responding with an error message in case of an error
  }
};

// like comment
export let likeComment = async (req, res) => {
  try {
    const { userId, commentId } = req.params;
    const likeComment = await Comment.findById(commentId);
    if (!likeComment) {
      return res.status(404).json({ error: "Post not found" });
    }

    likeComment.toggleLike(userId);
    await likeComment.save();

    res.json({ message: "Post like status updated" });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
