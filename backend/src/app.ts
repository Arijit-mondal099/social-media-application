import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";

const app = express();

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export default app;
