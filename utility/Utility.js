import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supportedMimeTypes } from "../constants/ImageType.js";
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

	// Utility to convert bytes to megabytes

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
}
