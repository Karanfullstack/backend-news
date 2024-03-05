import prisma from "../database/db.config.js";
import Utility from "../utility/Utility.js";
import fs from "fs";
export class ProfileController {
	static async index(req, res) {
		try {
			const user = req.user;
			return res.json({ success: true, status: 200, user });
		} catch (error) {
			return res.status(500).json({ message: "Error in Profile Controller" });
		}
	}

	// Update Profile Controller
	static async update(req, res) {
		try {
			const { id } = req.params;

			// check if profile is empty
			if (!req.files || Object.keys(req.files).length === 0) {
				return res
					.status(400)
					.json({ success: false, message: "Profile is required" });
			}

			// image validation
			const profile = req.files.profile;
			const message = Utility.validateImage(profile?.size, profile?.mimetype);
			if (message !== null) {
				return res.status(400).json({ message });
			}
			// if image is invalid
			const ext = profile.name.split(".").pop();
			const fileName = Date.now() + "." + ext;
			const path = process.cwd() + "/public/images/" + fileName;

			profile.mv(path, (err) => {
				if (err) {
					return res.status(500).json({
						message: "Error in uploading image",
					});
				}
			});

			// update profile
			await prisma.user.update({
				data: {
					profile: fileName,
				},
				where: {
					id: Number(id),
				},
			});
			return res.json({
				success: true,
				status: 200,
				message: "Profile Updated",
				profile: fileName,
			});
		} catch (error) {
			// how to remove file
			console.log(error);
			return res.status(500).json({ message: "Error in Profile Controller" });
		}
	}
}
