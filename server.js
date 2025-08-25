import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";
import cors from "cors";
import http from "http";

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Create a task
app.post("/task", async (req, res) => {
  const { title, color } = req.body;
  const task = await prisma.task.create({
    data: { title, color },
  });
  res.json(task);
});

app.get("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to retrieve task");
  }
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.put("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { title, color },
    });

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.put("/task/completed/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { completed },
    });

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE
app.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

const PORT = parseInt(process.env.PORT || "4000", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port 4000 🚀🚀🚀`);
});
