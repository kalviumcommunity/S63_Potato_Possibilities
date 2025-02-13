require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB"); // Import connectDB

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
connectDB();

app.get("/", (req, res) => {
  res.send("🥔 Potato Possibilities API is now running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
