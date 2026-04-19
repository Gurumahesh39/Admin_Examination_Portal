const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const router = require("./Router/UserRouter");

dotenv.config();

const app = express();

/* MIDDLEWARE */

//CORS
app.use(cors({origin: "http://localhost:5173",credentials: true}));
// JSON
app.use(express.json());
//ROUTES
app.use("/api/v1", router);
//HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API running...");
});

/*  ERROR HANDLER */
app.use((err, req, res, next) => {
  console.log("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});


/*  DATABASE */
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);

    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.log("DB Error:", err);
  }
};

startServer();