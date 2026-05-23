const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
    );

    app.get("/youtube", async (req, res) => {
      const keyword = req.query.q;

        try {
            const response = await fetch(
                  `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                          keyword
                                )}&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`
                                    );

                                        const data = await response.json();

                                            res.json(data);

                                              } catch (err) {
                                                  res.status(500).json({
                                                        error: "API failed"
                                                            });
                                                              }
                                                              });

                                                              app.post("/save-topic", async (req, res) => {
                                                                try {

                                                                    const {
                                                                          topic,
                                                                                search_interest,
                                                                                      competition,
                                                                                            upload_pressure,
                                                                                                  opportunity
                                                                                                      } = req.body;

                                                                                                          const { data, error } = await supabase
                                                                                                                .from("topic_snapshots")
                                                                                                                      .insert([
                                                                                                                              {
                                                                                                                                        topic,
                                                                                                                                                  search_interest,
                                                                                                                                                            competition,
                                                                                                                                                                      upload_pressure,
                                                                                                                                                                                opportunity
                                                                                                                                                                                        }
                                                                                                                                                                                              ]);

                                                                                                                                                                                                  if (error) {
                                                                                                                                                                                                        return res.status(500).json({
                                                                                                                                                                                                                error: error.message
                                                                                                                                                                                                                      });
                                                                                                                                                                                                                          }

                                                                                                                                                                                                                              res.json({
                                                                                                                                                                                                                                    success: true,
                                                                                                                                                                                                                                          data
                                                                                                                                                                                                                                              });

                                                                                                                                                                                                                                                } catch (err) {
                                                                                                                                                                                                                                                    res.status(500).json({
                                                                                                                                                                                                                                                          error: "Save failed"
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