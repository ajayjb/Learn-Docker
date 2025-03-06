import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).send("Hi there new world!");
});

app.get("/getPassword", (req, res) => {
  return res.status(200).send({ password: process.env.DB_PASSWORD });
});

app.get("/getToken", (req, res) => {
  return res.status(200).send({ token: process.env.APP_TOKEN });
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
