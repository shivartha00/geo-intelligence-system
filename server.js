require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/youtube", async (req, res) => {
  const keyword = req.query.q;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}&maxResults=10&type=video&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "YouTube API failed",
    });
  }
});

app.post("/save-topic", async (req, res) => {
 console.log(req.body);
 
  try {
    const {
      topic,
      search_interest,
      competition,
      upload_pressure,
      opportunity,
    } = req.body;

    const { data, error } = await supabase
      .from("topic_snapshots")
      .insert([
        {
          topic,
          search_interest,
          competition,
          upload_pressure,
          opportunity,
        },
      ]);

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      error: "Database insert failed",
    });
  }
});

app.get("/topics", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("topic_snapshots")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Fetch failed",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});