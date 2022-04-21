import fs from "fs";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// const fs = require('fs');
const productPath = __dirname + "./files/products.json";

class ProductManager {
  getAll = async () => {
    if (fs.existsSync(productPath)) {
      try {
        const getProducts = await fs.promises.readFile(Path, "utf-8");
        const products = JSON.parse(getProducts);
        return {
          status: "succes",
          payload: products,
        };
      } catch (error) {
        return {
          status: "error",
          error: error,
        };
      }
    }
  };
  addProduct = async (product) => {
    if (fs.existsSync(productPath)) {
      try {
        let getProducts = await fs.promises.readFile(productPath, "utf-8");
        let products = JSON.parse(getChamps);
        if (products.length === 0) {
          product.id = 1;
          products.push(product);
          await fs.promises.writeFile(
            productPath,
            JSON.stringify(products, null, 2)
          );
          return {
            status: "success",
            message: "Product added",
          };
        }
        product.id = products[products.length - 1].id + 1;
        products.push(product);
        await fs.promises.writeFile(
          productPath,
          JSON.stringify(products, null, 2)
        );
        return {
          status: "success",
          message: "Product added",
        };
      } catch (error) {
        return {
          status: "error",
          error: error,
        };
      }
    } else {
      try {
        product.id = 1;
        await fs.promises.writeFile(
          productPath,
          JSON.stringify([product], null, 2)
        );
        return {
          status: "success",
          message: "Array created!",
        };
      } catch (error) {
        return {
          status: "error",
          error: error,
        };
      }
    }
  };
}

export default ProductManager;
