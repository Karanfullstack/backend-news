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

   // hash password 
   payload.password = await Utility.hashPassword(payload.password)
   return res.json({payload})
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ error: error.messages });
			}
		}
	}
}
