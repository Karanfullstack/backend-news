import prisma from "../database/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import Utility from "../utility/Utility.js";

export default class AuthController {
	// @register controller
	static async register(req, res) {
		try {
			const body = req.body;
			const validator = vine.compile(registerSchema);
			const payload = await validator.validate(body);

			// check if user alredy exists
			const user = await prisma.user.findUnique({
				where: {
					email: payload.email,
				},
			});

			// If user already exists, return an error
			if (user) {
				return res.status(400).json({
					errors: {
						email: "Email already taken please user another one",
					},
				});
			}
			// hash password
			payload.password = await Utility.hashPassword(payload.password);
			const newUser = await prisma.user.create({
				data: payload,
			});

			return res.status(200).json({
				status: 200,
				message: "User created successfully",
				data: newUser,
			});
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ error: error.messages });
			}
		}
	}
}
