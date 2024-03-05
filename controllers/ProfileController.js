export class ProfileController {
	static async index(req, res) {
		try {
			const user = req.user;
			return res.json({ success: true, status: 200, user });
		} catch (error) {
			return res.status(500).json({ message: "Error in Profile Controller" });
		}
	}

	static async store(req, res) {}

	static async show(req, res) {}

	static async update(req, res) {}

	static async destroy(req, res) {}
}
