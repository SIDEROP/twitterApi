import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";
import cloudinaryUpload from "../utils/cloudinary.js";

// userRegistered
export let userRegistered = async (req, res) => {
  let img_url =
    "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg";

  try {
    const { name, username, email, password } = req.body;

    if ([name, username, email, password].some((val) => val?.trim() == ""))
      return res.status(404).json({ message: "Invalid username and password" });
    if (!(username || password))
      return res.status(404).json({ message: "Invalid username and password" });

    let existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (req.file) {
      let resl = await cloudinaryUpload(req?.file);
      if (resl) {
        img_url = resl.secure_url;
      }
    }

    let newUser = new User({
      name,
      username,
      email,
      password,
      img_url,
      bio: "",
      lastLogin: new Date(),
      following: [],
      followers: [],
    });

    let savedUser = await newUser.save();
    return res
      .status(202)
      .json({ message: "User registered successfully", data: savedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// userLogin
export let userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((val) => val?.trim() === ""))
      return res.status(404).json({ message: "invalid email and password" });
    if (!(email || password))
      return res.status(404).json({ message: "invalid email and password" });

    const resDb = await User.findOne({ email });
    if (!resDb) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await resDb.isPasswordCompare(password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid password" });
    }
    let token = await resDb.isTokenJwt();
    let { img_url, name, username } = resDb;
    res.status(202).json({
      success: true,
      data: { img_url, name, username, email: resDb.email },
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// userProtected
export const userProtected = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(401).json({ message: "Token not provided" });

    jwt.verify(token, `${process.env.TOKEN_SECRET}`, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      const { username, password } = decoded;
      const userDb = await User.findOne({ username, password }).populate([
        {
          path: "following",
          select: "name username  img_url",
        },
        {
          path: "followers",
          select: "name username  img_url",
          options: { sort: { createdAt: -1 } },
        },
      ]);
      if (!userDb) {
        return res
          .status(404)
          .json({ user: false, message: "User not found", success: false });
      }
      let {
        _id,
        name,
        email,
        img_url,
        bio,
        lastLogin,
        following,
        followers,
        createdAt,
      } = userDb;

      return res.status(200).json({
        user: true,
        data: {
          _id,
          name,
          username,
          email,
          img_url,
          bio,
          lastLogin,
          following,
          followers,
          createdAt,
        },
        message: "User protected",
        success: true,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// follow and unfollow toggleFollow
export const toggleFollow = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.toggleFollow(otherUserId);
    return res.status(200).json({ message: "Follow successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint for user search
export const searchApi = async (req, res) => {
  try {
    const { userName } = req.params;
    if (!userName) {
      return res
        .status(400)
        .json({ message: "userName parameter is required" });
    }
    const users = await User.find(
      {
        username: { $regex: userName },
      },
      { password: 0, bio: 0, lastLogin: 0, email: 0 }
    );
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
