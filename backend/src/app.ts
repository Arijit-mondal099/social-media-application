import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import chatRouter from "./routes/chat.routes";

const app = express();

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/chats", chatRouter);

export default app;
