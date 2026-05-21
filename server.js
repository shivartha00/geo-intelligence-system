const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/youtube", async (req, res) => {
  const keyword = req.query.q;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "API failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
