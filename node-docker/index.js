import express from "express";
import cors from "cors";
import 'dotenv/config'

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  return res.status(200).send("Hi there new world!");
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
