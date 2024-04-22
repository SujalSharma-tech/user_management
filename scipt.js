const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.json());

const mongo_URL = process.env.MONGO_URL;
mongoose
  .connect(mongo_URL)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error(err);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.post("/users", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  User.findByIdAndUpdate(userId, updateData, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updateUser);
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
});
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  User.findByIdAndDelete(userId, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted success" });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
});

app.listen(8000, () => {
  console.log("Server Started");
});
