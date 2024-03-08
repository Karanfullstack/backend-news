import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supportedMimeTypes } from "../constants/ImageType.js";
import fs from "fs";
export default class Utility {
	// Hash Password Utitliy
	static async hashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}

	// Compare Password Utility
	static async comparePassword(password, hash) {
		return await bcrypt.compare(password, hash);
	}

	// Generate Token Utility
	static generateToken(payload) {
		return jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
	}

	// Verify Token Utility
	static verifyToken(token) {
		return jwt.verify(token, process.env.SECRET);
	}

	// Utility for Image Validation
	static validateImage(size, mime) {
		const bytes = size / (1024 * 1024);
		if (bytes > 2) {
			return { message: "File size too large" };
		} else if (!supportedMimeTypes.includes(mime)) {
			return { message: "File type not supported" };
		}
		return null;
	}

	// Utility for Image Upload
	static uploadImage(image) {
		const ext = image.name.split(".").pop();
		const fileName = Date.now() + "." + ext;
		const path = process.cwd() + "/public/images/" + fileName;

		image.mv(path, (err) => {
			if (err) {
				throw new Error("Errror	uploading image");
			}
		});
		return fileName;
	}

	// Utility of Delete Image
	static deleteImage(fileName) {
		const path = process.cwd() + "/public/images/" + fileName;
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	}

	// Utility for Pagination
	static paginate(page, limit) {
		if (page <= 0) {
			page = 1;
		}
		if (limit <= 0 || limit > 100) {
			limit = 10;
		}
		const offset = (page - 1) * limit;
		return { offset, limit, page };
	}
}
