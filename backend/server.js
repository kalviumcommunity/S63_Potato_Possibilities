require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
connectDB();

// Base route
app.get("/", (req, res) => {
  res.send("Potato Possibilities API is now running!");
});

// Dishes route
app.use("/api/dishes", require("./routes/dishes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
