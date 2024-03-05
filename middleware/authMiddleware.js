import Utility from "../utility/Utility.js";

export const authMiddleware = (req, res, next) => {
	const header = req.headers?.authorization;
	if (header === null || header === undefined) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
	const token = header.split(" ")[1];
	const user = Utility.verifyToken(token);

	if (!user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	req.user = user;
	next();
};
