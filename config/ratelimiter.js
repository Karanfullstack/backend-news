import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
	windowMs: 60 * 1000, // to one minute
	max: 100, // limit each IP to 100 requests per windowMs
	message: {
		status: 429,
		message: "Too many requests, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});
