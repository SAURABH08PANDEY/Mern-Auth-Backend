const express = require("express");
require("express-async-errors");
const app = express();

//rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors=require("cors");

const port = process.env.PORT || 5000;
require("dotenv").config();
//database connection
const connectDB = require("./db/connect");

const authRouter = require("./routes/authRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
// app.use(express.static("./public"));
app.use(cors()); 

app.get("/", (req, res) => {
  res.send("mern auth!");
});

//only to test cookies
app.get("/api/v1", (req, res) => {
    // console.log(req.cookies);
    console.log(req.signedCookies);
  res.send("cookie-jar");
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port);
    console.log(`Server started on port ${port}`);
  } catch (err) {
    console.log(err);
  }
};
start();
