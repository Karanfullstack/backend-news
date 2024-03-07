import { newsValidation } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";
import Utility from "../utility/Utility.js";
export class NewsController {
	// Create News Controller
	static async store(req, res) {
		try {
			const user = req.user;
			const body = req.body;
			const validator = vine.compile(newsValidation);
			const payload = await validator.validate(body);

			// Image validation
			if (!req.files || Object.keys(req.files).length === 0) {
				return res
					.status(400)
					.json({ success: false, error: { message: "Image is required" } });
			}
			const image = req.files?.image;
			const message = Utility.validateImage(image?.size, image?.mimetype);
			if (message !== null) {
				return res.status(400).json({ error: message });
			}
			const ext = image.name.split(".").pop();
			const fileName = Date.now() + "." + ext;
			const path = process.cwd() + "/public/images/" + fileName;

			image.mv(path, (err) => {
				if (err) {
					return res
						.status(500)
						.json({ error: { message: "Error in uploading image" } });
				}
			});

			return res.json({ ...payload, image: fileName });
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ error: error.messages });
			}
		}
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
