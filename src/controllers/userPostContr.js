import { Post } from "../models/userPostModels.js";
import { User } from "../models/userModels.js";

import cloudinaryUpload, {
  cloudinaryDestroy,
  cloudinaryUpdate,
} from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;
    res.send(req.files)
    // const { userId, content } = req.body;
    // let img_url = "";
    // let video_url = "";

    // const user = await User.findById(userId);
    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ message: "User not found", success: false });
    // }
    // if (req.files && req.files.image) {
    //   const imageFile = req.files.image[0];
    //   const imageRes = await cloudinaryUpload(imageFile);
    //   if (imageRes) {
    //     img_url = imageRes.secure_url;
    //   }
    // }

    // if (req.files && req.files.video) {
    //   const videoFile = req.files.video[0];
    //   const videoRes = await cloudinaryUpload(videoFile);
    //   if (videoRes) {
    //     video_url = videoRes.secure_url;
    //   }
    // }

    // const newPost = await Post.create({
    //   user: userId,
    //   content,
    //   img_url,
    //   video_url,
    //   likes: [],
    //   comments: [],
    // });

    // res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name username img_url",
      })
      .populate({
        path: "comments",
        select: "user name username content likes replies",
        populate: {
          path: "user",
          select: "name username img_url",
        },
      });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// getUserPost
export const getUserPost = async (req, res) => {
  try {
    let { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name username img_url",
      })
      .populate({
        path: "comments",
        select: "user name username content likes replies",
        populate: {
          path: "user",
          select: "name username img_url",
        },
        options: { sort: { createdAt: -1 } }
      });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


// updatePostById
export const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    let img_url = "";
    let video_url = "";

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const imageRes = await cloudinaryUpdate(
        post.img_url.split("/").pop().split(".")[0],
        imageFile
      );
      if (imageRes) {
        img_url = imageRes.secure_url;
      }
    } else {
      img_url = post.img_url;
    }

    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      const videoRes = await cloudinaryUpdate(
        post.video_url.split("/").pop().split(".")[0],
        videoFile
      );
      if (videoRes) {
        video_url = videoRes.secure_url;
      }
    } else {
      video_url = post.video_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content, img_url, video_url },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete a post by ID
export const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    if (post.img_url) {
      const publicId = post.img_url.split("/").pop().split(".")[0];
      await cloudinaryDestroy(publicId);
    }

    if (post.video_url) {
      const publicId = post.video_url.split("/").pop().split(".")[0];
      await cloudinaryDestroy(publicId);
    }

    await Post.findByIdAndDelete(postId);

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// like fun
export let likePost = async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const alreadyLiked = post.likes.includes(userId);
    if (!post.likes) {
      post.likes = [];
    }
    if (!post.likedByUsers) {
      post.likedByUsers = [];
    }
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      post.likedByUsers = post.likedByUsers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
      post.likedByUsers.push(userId);
    }
    await post.save();
    res.json({ message: "Post like status updated" });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Views
export const Views = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.views += 1;
    await post.save();
    res.json({ message: "Post views incremented successfully", post });
  } catch (error) {
    console.error("Error incrementing post views:", error);
    res.status(500).json({ error: "Server error" });
  }
};
