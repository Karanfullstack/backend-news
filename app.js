import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
const app = express();

// middlewares
dotenv.config();
app.use(express.json());
// static path

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

// Routes
import AuthRoute from "./routes/api.js";
app.use("/api", AuthRoute);

const PORT = process.env.PORT || 3000;
// server
app.listen(PORT, () => {
	console.log("Server is running on port 8000");
});
