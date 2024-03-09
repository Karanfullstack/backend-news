import { newsValidation } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";
import Utility from "../utility/Utility.js";
import prisma from "../database/db.config.js";
import { ResponseTransform } from "../response/response.js";
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

			// Upload image
			const fileName = Utility.uploadImage(image);

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

			const { offset } = Utility.paginate(page, limit);

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
			const data = news.map((item) => ResponseTransform.response(item));
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

	// Get News By ID Controller
	static async show(req, res) {
		try {
			const id = req.params.id;
			const news = await prisma.news.findUnique({
				where: {
					id: Number(id),
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
			if (!news) {
				return res.status(404).json({
					success: false,
					status: 404,
					error: { message: "News not found" },
				});
			}
			return res
				.status(200)
				.json({ success: true, data: ResponseTransform.response(news) });
		} catch (error) {
			return res.status(500).json({ error: { message: error.message } });
		}
	}

	// Update News Controller
	static async update(req, res) {
		try {
			const newsID = req.params.id;
			const user = req.user;
			const body = req.body;
			// const validator = vine.compile(newsValidation);
			// const payload = await validator.validate(body);

			const news = await prisma.news.findUnique({
				where: {
					id: Number(newsID),
				},
				include: {
					user: {
						select: {
							id: true,
						},
					},
				},
			});

			if (!news) {
				return res
					.status(404)
					.json({ success: false, message: "Not Post Found" });
			}

			if (news.user_id !== user.id) {
				return res
					.status(401)
					.json({ success: false, error: { message: "Unauthorized" } });
			}

			// Data to be update conditionally
			let data = {};
			if (body.title) data.title = body.title || news.title;
			if (body.content) data.content = body.content || news.content;

			const image = req.files?.image;
			let fileName = undefined;
			if (image) {
				const message = Utility.validateImage(image?.size, image?.mimetype);
				if (message !== null) {
					return res.status(400).json({ success: false, error: { message } });
				}

				// Upload Image
				fileName = Utility.uploadImage(image);
				console.log(fileName);
				// Delete Old Image
				Utility.deleteImage(news.image);
			}
			if (fileName) {
				data.image = fileName;
			}
			await prisma.news.update({
				data: data,
				where: {
					id: Number(newsID),
					user_id: Number(user.id),
				},
			});
			return res
				.status(200)
				.json({ success: true, message: "Updated Successfylly" });
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({
					success: false,
					message: error.messages,
				});
			} else {
				console.log(error);
				return res.status(500).json({ message: error });
			}
		}
	}

	// Delete News Controller
	static async destroy(req, res) {
		try {
			const { id } = req.params;
			const user = req.user;
			const news = await prisma.news.findUnique({
				where: {
					id: Number(id),
				},
			});

			if (!news) {
				return res
					.status(404)
					.json({ success: false, message: "No post found" });
			}
			if (news.user_id !== user.id) {
				return res
					.status(401)
					.json({ success: false, message: "Unauthorized" });
			}
			Utility.deleteImage(news.image);
			await prisma.news.delete({
				where: {
					id: Number(id),
				},
			});
			return res
				.status(201)
				.json({ success: true, message: "Post Deleted Sucessfully" });
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ success: false, message: error || "Something wrong happend" });
		}
	}
}

export default NewsController;
