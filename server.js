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

app.post("/save-topic", async (req, res) => {

  console.log("BODY:", req.body);

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
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data,
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
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
