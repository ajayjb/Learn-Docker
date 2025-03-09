import express from "express";
import cors from "cors";
import fs from "fs";
import yaml from "js-yaml";
import morgan from "morgan";
import "dotenv/config";

const app = express();

app.use(cors());

app.use(morgan("combined"));

app.get("/", (req, res) => {
  return res.status(200).send("Hi there new world!");
});

app.get("/getPassword", (req, res) => {
  return res.status(200).send({ password: process.env.DB_PASSWORD });
});

app.get("/getToken", (req, res) => {
  return res.status(200).send({ token: process.env.APP_TOKEN });
});

app.get("/secrets", (req, res) => {
  const api_key = fs.readFileSync("/run/secrets/api_key", {
    encoding: "utf8",
    flag: "r",
  });
  const api_key_2 = fs.readFileSync("/api_key.txt", {
    encoding: "utf8",
    flag: "r",
  });
  console.log(api_key);
  return res.status(200).send({ api_key, api_key_2 });
});

app.get("/config", (req, res) => {
  const config = fs.readFileSync("/config.yaml", {
    encoding: "utf8",
    flag: "r",
  });

  const config_2 = fs.readFileSync("/my_config.yaml", {
    encoding: "utf8",
    flag: "r",
  });

  const config_3 = fs.readFileSync("/my_config", {
    encoding: "utf8",
    flag: "r",
  });

  const data = yaml.load(config);
  const data2 = yaml.load(config_2);
  const data3 = yaml.load(config_3);

  return res.status(200).send({ data, data2, data3 });
});

app.get("/volumes", (req, res) => {
  const file = "/my-data/test.txt";

  const readFile = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });

  return res.status(200).send({ readFile });
});

app.post("/volumes", (req, res) => {
  const file = "/my-data/test.txt";
  const dirPath = "/data";
  const content = "\n Customer " + new Date().getTime();

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (fs.existsSync(file)) {
    fs.appendFileSync(file, content, { encoding: "utf-8" });
  } else {
    fs.writeFileSync(file, content, { encoding: "utf-8" });
  }

  const readFile = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });

  return res.status(200).send({ readFile });
});

app.post("/check-health", (req, res) => {
  return res.status(200).send({});
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
