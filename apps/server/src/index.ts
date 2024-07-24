import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
  modelPath: path.join(
    __dirname,
    "../models",
    "Meta-Llama-3.1-8B-Instruct-Q8_0.gguf"
  ),
});
const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("There is a new connection");

  socket.on("message", async (msg) => {
    console.log("Received message:", msg);
    try {
      const reply = await session.prompt(msg);
      console.log("Sending reply:", reply);
      socket.emit("response", reply);
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("response", "An error occurred while processing your message.");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
