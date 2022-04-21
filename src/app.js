import express from "express";
import { Server } from "socket.io";
import { normalize, schema } from "normalizr";
import moment from "moment";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import productRouter from "./routes/products.js";

import ProductManager from "./Manager/ProductManager.js";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const productService = new ProductManager();

const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
const io = new Server(server);

app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://Diego:123@codercluster18335.oxenh.mongodb.net/mySessionsDB?retryWrites=true&w=majority",
      ttl: 20,
    }),
    secret: "mongosecretclavesecreta",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", productRouter);

app.use("/home", express.static(__dirname + "./public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const log = [];
const indexLog = [];
const generalLog = {
  id: "200",
  name: "General chat",
  log: log,
};

io.on("connection", async (socket) => {
  console.log("a user connected");
  let products = await productService.getAll();
  io.emit("productLog", products);
  socket.on("sendProduct", async (data) => {
    await productService.add(data);
    let products = await productService.getAll();
    io.emit("productLog", products);
  });
});

io.on("connection", (socket) => {
  socket.emit("msgLog", indexLog);
  socket.on("message", async (dataChat) => {
    console.log(dataChat);
    dataChat.time = moment().format("HH:mm:ss DD/MM/YYYY");
    indexLog.push(dataChat);
    io.emit("msgLog", indexLog);
  });
  socket.on("userInfo", (data) => {
    data.text.time = moment().format("HH:mm:ss DD/MM/YYYY");
    // console.log(data)
    log.push(data);
    // console.log(JSON.stringify(normalizedData, null, '\t'));
  });
});

const author = new schema.Entity("author");
const chatSchema = new schema.Entity("generalChat", {
  author: author,
  messages: [author],
});

const normalizedData = normalize(generalLog, chatSchema);
