const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const router = require("./Router/UserRouter");

dotenv.config({path: ".env"});

const hostname=process.env.HOST_NAME
const port=process.env.PORT

const mongooseDatabse=process.env.MONGODB

mongoose.connect(mongooseDatabse).then((conn)=>{console.log("Mongodb Is COnnected Succesufully")}).catch((err)=>{
  console.log("Mongodb Is not Connected",err)
})

const app = express();

app.use(cors({origin: "http://localhost:5173", credentials: true,}));

app.use(express.json());

app.use("/api/v1", router);


app.get("/", (req, res) => {
  res.send("API running...");
});

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.log("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port,hostname,() => {
  console.log(`Server started at http://${hostname}:${port}`);
});
