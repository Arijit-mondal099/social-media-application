import fs from "fs";
import { imagekit } from "../configs/imagekit";

export const uploadFile = async (file: Express.Multer.File, folder: string) => {
  try {
    const fileData = fs.readFileSync(file.path); // read file as buffer

    const result = await imagekit.upload({
      file: fileData,
      fileName: file.filename,
      folder,
    });

    // Delete the file after upload
    fs.unlinkSync(file.path);

    return result;
  } catch (error) {
    // Attempt to delete the file even if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};
