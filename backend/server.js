const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3000;

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.MONGODB_URI}${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log("🚀 ~ file: server.js ~ line 10 ~ MONGO_URL", MONGO_URL);

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

const Todo = require("./models/Todo");

app.get("/", async (req, res) => {
  res.send({
    message: "Welcome to Todo List APIs!",
  });
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json(result);
});

app.put("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
