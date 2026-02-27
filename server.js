const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express(); // ✅ YOU MISSED THIS

// ✅ CORS MUST BE BEFORE ROUTES
app.use(cors({
  origin: "https://editzzz.vercel.app",
  credentials: true
}));

app.use(express.json());

// Make sure this is imported at top:
const adminRoutes = require("./routes/adminRoutes"); 

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  });