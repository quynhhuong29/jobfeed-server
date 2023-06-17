require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require("./socketServer");
const { ExpressPeerServer } = require("peer");

const swaggerDefinition = {
  info: {
    title: "My API",
    version: "1.0.0",
    description: "My API documentation",
  },
  host: "localhost:5000",
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3005"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  SocketServer(socket);
});

// Create peer server
ExpressPeerServer(http, { path: "/" });

// Routes
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/jobRouter"));
app.use("/api", require("./routes/messageRouter"));
app.use("/api/comment", require("./routes/commentRouter"));
app.use("/api", require("./routes/companyRouter"));
app.use("/api", require("./routes/CVRouter"));
app.use("/api", require("./routes/industryRouter"));
app.use("/api", require("./routes/notifyRouter"));
app.use("/api/jobPost", require("./routes/jobPostRouter"));
app.use("/api", require("./routes/resumeRouter"));
app.use("/api", require("./routes/submitRouter"));

mongoose.connection.on("open", () => {
  console.log("Connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

const port = process.env.PORT || 5001;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
