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

	// Utility for Transform Response
	static transformResponse(data) {
		return {
			id: data.id,
			heading: data.title,
			news: data.content,
			user_id: data.user_id,
			image: `${process.env.APP_URL}/images/${data.image}`,
			created_at: data.created_at,
			updated_at: data.updated_at,
			reporter: {
				id: data.user.id,
				name: data.user.name,
				email: data.user.email,
				profile: data.user?.profile !== null ?	`${process.env.APP_URL}/images/${data.user.profile}` : null,
			},
		};
	}
}
