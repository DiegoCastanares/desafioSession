import express from "express";
import fs from "fs";
import Container from "../Container/Container.js";
import session from "express-session";
const router = express.Router();
const userService = new Container();

import multer from "multer";

let upload = multer();

router.get("/", (req, res) => {
  // porductService.get()
  // .then(r=>res.render('products',{products:r.payload}))
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/home");
});

router.get("/login", (req, res) => {
  if (!req.session.user) return res.render("login");
  res.redirect("/");
});

router.post("/login", upload.fields([]), (req, res) => {
  let data = req.body;
  req.session.user = data.username;
  res.send(console.log("ok"));
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("logout");
});

//la ruta ./productos nos muesta un array con todos los productos del json
// router.get("/", (req, res) => {
//   userService.getAll().then((result) => res.send(result));
// });

//la ruta ./productos/:id nos muestra el producto con el id que le pasamos
// router.get("/:id", (req, res) => {
//   let id = parseInt(req.params.id);
//   userService.getById(id).then((result) => res.send(result));
// });

// la ruta ./productosRandom nos muestra un producto al azar del listado de productos.
// router.get("/productoRandom", (req, res) => {
//   userService.getByRandomId().then((result) => res.send(result));
// });

// router.post("/", (req, res) => {
//   let product = req.body;
//   userService.saveProduct(product).then((result) => res.send(result));
// });

// router.put("/:id", (req, res) => {
//   let id = parseInt(req.params.id);
//   let product = req.body;
//   userService.updateById(id, product).then((result) => res.send(result));
// });

// router.delete("/:id", (req, res) => {
//   let id = parseInt(req.params.id);
//   userService.deletebyId(id).then((result) => res.send(result));
// });

export default router;
