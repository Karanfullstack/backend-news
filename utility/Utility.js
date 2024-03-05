import bcrypt from "bcryptjs";

export default class Utility {
	// Hash Password Utitliy
	static async hashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}
}
