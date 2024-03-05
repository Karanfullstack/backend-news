import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

// Custom Error Reporter
vine.errorReporter = () => new CustomErrorReporter();
export const loginSchema = vine.object({
	email: vine.string().email(),
	password: vine.string().minLength(2).maxLength(191).confirmed(),
});
