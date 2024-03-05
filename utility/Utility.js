import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
}
