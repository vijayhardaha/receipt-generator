const express = require("express");
const cors = require("cors");
const app = express();
const nodeHtmlToImage = require("node-html-to-image");

// Middleware to enable CORS and parse request bodies
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Endpoint for capturing screenshots
app.post( "/api", async (req, res) => {
	try {
		const { html } = req.body;

		// Check if the request contains HTML content
		if (!html) {
			throw new Error("HTML content is missing.");
		}

		// Generate a screenshot using the getScreenshot function
		const image = await nodeHtmlToImage({
			html: html,
			type: "png"
		});

		// Send the screenshot as a base64-encoded image
		res.status(200).json({
			success: true,
			image: `data:image/png;base64,${image.toString("base64")}`,
		});
	} catch (error) {
		const message = error.message || "Server encountered an error.";
		res.status(200).json({ success: false, error: message, errorData: error });
	}
});

module.exports = app;
