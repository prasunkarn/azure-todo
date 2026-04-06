// //server.js
// const client = require("prom-client");
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const TodoModel = require("./models/todoList");

// var app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to your MongoDB database (replace with your database URL)
// mongoose.connect("mongodb://127.0.0.1/todo");

// // Check for database connection errors
// mongoose.connection.on("error", (error) => {
//   console.error("MongoDB connection error:", error);
// });

// // Get saved tasks from the database
// app.get("/getTodoList", (req, res) => {
//   TodoModel.find({})
//     .then((todoList) => res.json(todoList))
//     .catch((err) => res.json(err));
// });

// // Add new task to the database
// app.post("/addTodoList", (req, res) => {
//   TodoModel.create({
//     task: req.body.task,
//     status: req.body.status,
//     deadline: req.body.deadline,
//   })
//     .then((todo) => res.json(todo))
//     .catch((err) => res.json(err));
// });

// // Update task fields (including deadline)
// app.post("/updateTodoList/:id", (req, res) => {
//   const id = req.params.id;
//   const updateData = {
//     task: req.body.task,
//     status: req.body.status,
//     deadline: req.body.deadline,
//   };
//   TodoModel.findByIdAndUpdate(id, updateData)
//     .then((todo) => res.json(todo))
//     .catch((err) => res.json(err));
// });

// // Delete task from the database
// app.delete("/deleteTodoList/:id", (req, res) => {
//   const id = req.params.id;
//   TodoModel.findByIdAndDelete({ _id: id })
//     .then((todo) => res.json(todo))
//     .catch((err) => res.json(err));
// });

// app.listen(3001, () => {
//   console.log("Server running on 3001");
// });
// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const client = require("prom-client");
const TodoModel = require("./models/todoList");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   🔥 PROMETHEUS METRICS
========================= */

// collect default system metrics
client.collectDefaultMetrics();

// 📊 Total HTTP requests (with labels)
const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// ⏱️ Request latency (VERY IMPORTANT)
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5], // latency buckets
});

// ❌ Error counter
const httpErrors = new client.Counter({
  name: "http_errors_total",
  help: "Total number of error responses",
  labelNames: ["method", "route", "status"],
});

// 📈 Business metrics
const todoCreated = new client.Counter({
  name: "todo_created_total",
  help: "Total number of todos created",
});

const todoDeleted = new client.Counter({
  name: "todo_deleted_total",
  help: "Total number of todos deleted",
});

/* =========================
   🔥 MIDDLEWARE (AUTO METRICS)
========================= */

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    const labels = {
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    };

    // total requests
    httpRequests.inc(labels);

    // latency
    httpRequestDuration.observe(labels, duration);

    // errors
    if (res.statusCode >= 400) {
      httpErrors.inc(labels);
    }
  });

  next();
});

/* =========================
   🔥 DATABASE CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/todo");

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

/* =========================
   🔥 API ROUTES
========================= */

// GET todos
app.get("/getTodoList", async (req, res) => {
  try {
    const todos = await TodoModel.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD todo
app.post("/addTodoList", async (req, res) => {
  try {
    const todo = await TodoModel.create({
      task: req.body.task,
      status: req.body.status,
      deadline: req.body.deadline,
    });

    todoCreated.inc(); // business metric

    res.json(todo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE todo
app.post("/updateTodoList/:id", async (req, res) => {
  try {
    const updated = await TodoModel.findByIdAndUpdate(
      req.params.id,
      {
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline,
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE todo
app.delete("/deleteTodoList/:id", async (req, res) => {
  try {
    const deleted = await TodoModel.findByIdAndDelete(req.params.id);

    todoDeleted.inc(); // business metric

    res.json(deleted);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   🔥 METRICS ENDPOINT
========================= */

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

/* =========================
   🚀 START SERVER
========================= */

app.listen(3001, () => {
  console.log("🚀 Server running on port 3001");
});
