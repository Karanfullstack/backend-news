import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => CustomErrorReporter();
export const newsValidation = vine.object({
	title: vine.string().maxLength(300).minLength(5),
	content: vine.string().minLength(10).maxLength(3000),
});
