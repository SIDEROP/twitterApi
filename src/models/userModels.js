import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    img_url: String,
    bio: String,
    lastLogin: Date,
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCompare = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.isTokenJwt = async function () {
  return jwt.sign(
    {
      username: this.username,
      password: this.password,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};


// Method to toggle following status between two users
userSchema.methods.toggleFollow = async function(otherUserId) {
  if (this.following.includes(otherUserId)) {
    this.following.pull(otherUserId);
    await this.save();
    await User.findByIdAndUpdate(otherUserId, { $pull: { followers: this._id } });
  } else {
    this.following.push(otherUserId);
    await this.save();
    await User.findByIdAndUpdate(otherUserId, { $push: { followers: this._id } });
  }
};

export const User = mongoose.model("User", userSchema);