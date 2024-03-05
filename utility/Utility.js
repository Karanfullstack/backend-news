import bcrypt from "bcryptjs";

export default class Utility {
	// Hash Password Utitliy
	static async hashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}

	// Compare Password Utility
	static async comparePassword(password, hash) {
		return bcrypt.compare(password, hash, (err, imatch) => {
			if (err) throw err;
			return imatch;
		});
	}
}
