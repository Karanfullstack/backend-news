import { newsValidation } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";
import Utility from "../utility/Utility.js";
import prisma from "../database/db.config.js";
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
			// Add image to payload and user_id
			payload.image = fileName;
			payload.user_id = user.id;

			const news = await prisma.news.create({
				data: payload,
			});
			return res.status(201).json({ success: true, data: news });
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ error: error.messages });
			}
		}
	}

	// Get News Controller
	static async index(req, res) {
		try {
			let page = req.query.page || 1;
			let limit = req.query.limit || 10;
			const searchQuery = req.query.search || "";
			if (page <= 0) {
				page = 1;
			}
			if (limit <= 0 || limit > 100) {
				limit = 10;
			}
			const offset = (page - 1) * limit;
			const news = await prisma.news.findMany({
				take: Number(limit),
				skip: Number(offset),
				where: {
					title: {
						contains: searchQuery.toLowerCase(),
					},
				},
				include: {
					user: {
						select: {
							id: true,
							email: true,
							name: true,
							profile: true,
						},
					},
				},
			});
			const data = news.map((item) => Utility.transformResponse(item));
			const newsCount = await prisma.news.count();
			const totalPages = Math.ceil(newsCount / limit);
			const hasMore = page < totalPages;
			return res.status(200).json({
				success: true,
				data,
				totalPages,
				currentPage: page,
				limit,
				hasMore,
			});
		} catch (error) {
			return res.status(500).json({ error: { message: error.message } });
		}
	}

	// Update News Controller
	static async update(req, res) {}

	// Delete News Controller
	static async destroy(req, res) {}

	// Get News By ID Controller
	static async show(req, res) {}
}

export default NewsController;
