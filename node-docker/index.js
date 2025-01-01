import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).send("Hi there new world!");
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
