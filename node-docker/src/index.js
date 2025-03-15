import express from "express";
import cors from "cors";
import fs from "fs";
import yaml from "js-yaml";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.root_dirname = __dirname;

const app = express();

app.use(cors());

app.use(morgan("combined"));

app.use(express.json())

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  return res.sendFile(path.join(root_dirname, "assets/coming.html"));
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

app.get("/about", (req, res) => {
  return res.status(200).send({});
});

app.post("/user/create", async (req, res) => {
  console.log(req.body)
  return res.status(200).send({ data: await new UserModel(req.body).save() });
});

app.get("/user/get", async (req, res) => {
  return res.status(200).send({ data: await UserModel.find().lean() });
});

console.log(
  `mongodb://${process.env.MONGO_USER_NAME}:${process.env.DB_PASSWORD_MONGO}@${
    process.env.MONGO_HOST
  }:${Number(process.env.MONGO_PORT)}/${process.env.MONGO_DATABASE}`
);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER_NAME}:${
      process.env.DB_PASSWORD_MONGO
    }@${process.env.MONGO_HOST}:${Number(process.env.MONGO_PORT)}/${
      process.env.MONGO_DATABASE
    }?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((connection) => {
    console.log("Connected to database" + connection.connection.host);

    app.listen(Number(process.env.PORT), () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
