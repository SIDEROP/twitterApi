import { Bookmark } from "../models/userBookmark.Models.js";
import { User } from "../models/userModels.js";

// add or remove bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingBookmark = await Bookmark.findOne({
      user: userId,
      post: postId,
    });
    if (existingBookmark) {
      // Bookmark exists, remove it
      await Bookmark.findOneAndDelete({ user: userId, post: postId });
      return res.status(200).json({ message: "Bookmark removed successfully" });
    } else {
      // Bookmark doesn't exist, add it
      const newBookmark = await Bookmark.create({ user: userId, post: postId });
      return res
        .status(201)
        .json({ message: "Bookmark added successfully", data: newBookmark });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get user bookmarks
export const getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bookmarks = await Bookmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "post",
        select: "user content img_url video_url likes comments views",
        populate: [
          {
            path: "user",
            select: "name username img_url",
          },
          {
            path: "comments",
            select: "user name username content likes replies",
            populate: {
              path: "user",
              select: "name username img_url",
            },
          },
        ],
      });

    return res.status(200).json({ data:bookmarks });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
