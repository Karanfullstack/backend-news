import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/ratelimiter.js";

// initialize app
const app = express();

// middlewares
dotenv.config();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(helmet());
app.use(limiter);
app.use(
	cors({
		origin: "http://localhost:3000",

		// credentials: true, only for cookies and sessions purproses.
	})
);

// Routes
import AuthRoute from "./routes/http.js";
app.use("/api", AuthRoute);

const PORT = process.env.PORT || 3000;
// server
app.listen(PORT, () => {
	console.log("Server is running on port 8000");
});
