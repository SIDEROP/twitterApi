import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUpload = async (file) => {
  try {
    const resl = await cloudinary.uploader.upload(file.path);
    if (!resl) return console.log("File not uploaded :");
    console.log("File uploaded successfully:");
    fs.unlinkSync(file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
    return resl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const cloudinaryDestroy = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    if (res.result === "ok") {
      console.log("File deleted successfully");
      return true;
    } else {
      console.log("File deletion failed:", res.result);
      return false;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Function to update a file in Cloudinary
export const cloudinaryUpdate = async (publicId, newFile) => {
  try {
    const destroySuccess = await cloudinaryDestroy(publicId);

    if (!destroySuccess) {
      console.log("Failed to update file: existing file deletion failed");
      return null;
    }

    const uploadResult = await cloudinaryUpload(newFile);

    if (!uploadResult) {
      console.log("Failed to update file: new file upload failed");
      return null;
    }

    console.log("File updated successfully");
    return uploadResult;
  } catch (error) {
    console.error("Error updating file:", error);
    return null;
  }
};

export default cloudinaryUpload;
