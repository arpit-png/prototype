const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/predict-yield", (req, res) => {
  const { crop, area, rain, fertilizer } = req.body;

  // Input validation
  if (!crop) {
    return res.status(400).json({ error: "Crop type is required." });
  }
  if (typeof area !== "number" || isNaN(area) || area <= 0) {
    return res
      .status(400)
      .json({ error: "Land area must be a positive number." });
  }
  if (typeof rain !== "number" || isNaN(rain) || rain < 0) {
    return res
      .status(400)
      .json({ error: "Rainfall must be a non-negative number." });
  }
  if (typeof fertilizer !== "number" || isNaN(fertilizer) || fertilizer < 0) {
    return res
      .status(400)
      .json({ error: "Fertilizer used must be a non-negative number." });
  }

  const yieldPrediction = area * 10 + rain * 0.2 + fertilizer * 0.5;
  res.json({ yield: parseFloat(yieldPrediction.toFixed(2)) });
});

app.post("/api/recommend-crop", (req, res) => {
  const { N, P, K, temp, humidity, ph, rainfall } = req.body;

  // Input validation
  if (typeof N !== "number" || isNaN(N) || N < 0) {
    return res
      .status(400)
      .json({ error: "Nitrogen (N) must be a non-negative number." });
  }
  if (typeof P !== "number" || isNaN(P) || P < 0) {
    return res
      .status(400)
      .json({ error: "Phosphorus (P) must be a non-negative number." });
  }
  if (typeof K !== "number" || isNaN(K) || K < 0) {
    return res
      .status(400)
      .json({ error: "Potassium (K) must be a non-negative number." });
  }
  if (typeof temp !== "number" || isNaN(temp)) {
    return res
      .status(400)
      .json({ error: "Temperature must be a valid number." });
  }
  if (
    typeof humidity !== "number" ||
    isNaN(humidity) ||
    humidity < 0 ||
    humidity > 100
  ) {
    return res
      .status(400)
      .json({ error: "Humidity must be a number between 0 and 100." });
  }
  if (typeof ph !== "number" || isNaN(ph) || ph < 0 || ph > 14) {
    return res
      .status(400)
      .json({ error: "Soil pH must be a number between 0 and 14." });
  }
  if (typeof rainfall !== "number" || isNaN(rainfall) || rainfall < 0) {
    return res
      .status(400)
      .json({ error: "Rainfall must be a non-negative number." });
  }

  let crop;
  if (rainfall > 200 && N > 80 && P > 40 && humidity > 80) crop = "Rice";
  else if (temp > 25 && humidity < 70 && ph > 6 && ph < 7) crop = "Maize";
  else if (rainfall > 100 && temp > 20 && K > 40) crop = "Jute";
  else if (temp > 25 && humidity > 85 && rainfall > 100) crop = "Coconut";
  else if (temp > 18 && temp < 25 && rainfall < 80 && N > 80) crop = "Wheat";
  else if (ph > 6 && ph < 7.5 && temp > 20) crop = "Lentil";
  else if (humidity > 60 && temp > 21 && temp < 35) crop = "Cotton";
  else crop = "General Purpose Crop (e.g., Beans)";

  res.json({ crop });
});

app.listen(3000, () => console.log("Server running on port 3000"));
