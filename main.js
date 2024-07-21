import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Data } from "./models/user.js";
import { BookData } from "./models/Book.js";

const app = express();
const port = 3000;
app.use(express.json());
app.set("view engine", "ejs");

let connection = await mongoose.connect(
  "mongodb+srv://webcrew09:vQEVfG7m2MSAt1CW@cluster0.vmw5fhx.mongodb.net/UserAuth?retryWrites=true&w=majority"
);

app.use(express.static(".\\Views"));

//browsers requests
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/publish", (req, res) => {
  res.render("publish");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/book_display", (req, res) => {
  res.render("book_display");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});
//browsers requests

//sign up request
app.post("/generate", async (req, res) => {

  try {
    let { username, email, password } = req.body;

    // Check if email or username already exists
    const existingUser = await Data.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const data = new Data({ username, email, password });
    await data.save();
    res.json({
      success: true,
      message: "Signup successful! Login to continue.",
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ success: false, message: "Error signing up" });
  }
});
//sign up request

//login request
app.post("/authenticate", async (req, res) => {

  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await Data.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // If username and password are correct, return a JSON response with a redirect link
    console.log("Username:", username);

    const avatarurl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;
    console.log(avatarurl)
    // Inside the "/authenticate" endpoint
    // If username and password are correct, return a JSON response with the username and a redirect link
    res.json({
      success: true,
      message: "Login successful!",
      username: username,
      redirect: "/",
      avatarurl: avatarurl,
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error authenticating user" });
  }
});
//login request

app.post("/Publish", async (req, res) => {

  
  try {
    let { BookTitle, BookAuthor, BookDesc } = req.body;

    // Check if email or username already exists
    const existingBook = await Data.findOne({ $or: { BookTitle }});
    if (existingBook) {
      return res
        .status(400)
        .json({ success: false, message: "Book Title already exists" });
    }

    const data = new BookData({ BookTitle, BookAuthor, BookDesc  });
    await data.save();
    res.json({
      success: true,
      message: "Signup successful! Login to continue.",
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ success: false, message: "Error signing up" });
  }
});

//port handling
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//port handling
