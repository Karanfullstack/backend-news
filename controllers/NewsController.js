import { newsValidation } from "../validations/newsValidation";
import vine from "@vinejs/vine";
class NewsController {
	// Create News Controller
	static async store(req, res) {
		const user = req.user;
		const body = req.body;
		const validator = vine.compile(newsValidation);
		const payload = validator.validate(body);

	}

	// Get News Controller
	static async index(req, res) {}

	// Update News Controller
	static async update(req, res) {}

	// Delete News Controller
	static async destroy(req, res) {}

	// Get News By ID Controller
	static async show(req, res) {}
}

export default NewsController;
