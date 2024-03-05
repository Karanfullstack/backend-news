import express from "express";
import dotenv from "dotenv";
const app = express();

// middlewares
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import AuthRoute from "./routes/api.js";
app.use("/api", AuthRoute);

const PORT = process.env.PORT ||	3000;
// server
app.listen(PORT, () => {
	console.log("Server is running on port 8000");
});
