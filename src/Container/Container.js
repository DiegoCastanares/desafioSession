import fs from "fs";

/*
Schema
    product ={
        title: String (required), 
        price: Number (required),
        thumbnail: String
}
*/

const pathToProducts = "./files/products.json";

class Container {
  saveProduct = async (product) => {
    if (!product.title || !product.price)
      return { status: "error", error: "missing field" };

    try {
      if (fs.existsSync(pathToProducts)) {
        let data = await fs.promises.readFile(pathToProducts, "utf-8");
        let products = JSON.parse(data);
        let id = products[products.length - 1].id + 1;
        product.id = id;
        products.push(product);
        await fs.promises.writeFile(
          pathToProducts,
          JSON.stringify(products, null, 2)
        );
        return {
          status: "success",
          message: `Product saved id:${product.id}`,
        };
      } else {
        //el archivo no existe
        product.id = 1;
        await fs.promises.writeFile(
          pathToProducts,
          JSON.stringify([product], null, 2)
        );
        return {
          status: "success",
          message: `Product saved id:${product.id}`,
        };
      }
    } catch (error) {
      return { status: "error", message: error };
    }
  };

  updateById = async (id, product) => {
    try {
      if (fs.existsSync(pathToProducts)) {
        let data = await fs.promises.readFile(pathToProducts, "utf-8");
        let products = JSON.parse(data);
        let index = products.findIndex((p) => p.id == id);
        if (index == -1) {
          return { status: "error", message: "product not found" };
        } else {
          products[index] = product;
          product.id = id;
          await fs.promises.writeFile(
            pathToProducts,
            JSON.stringify(products, null, 2)
          );
          return {
            status: "success",
            message: `Product updated id:${product.id}`,
          };
        }
      } else {
        return { status: "error", message: "product not found" };
      }
    } catch (error) {
      return { status: "error", message: error };
    }
  };

  getById = async (id) => {
    if (!id) return { status: "error", error: "ID needed" };
    if (fs.existsSync(pathToProducts)) {
      let data = await fs.promises.readFile(pathToProducts, "utf-8");
      let products = JSON.parse(data);
      let product = products.find((p) => p.id === id);
      if (product) return { status: "success", payload: product };
      else return { status: "error", error: "Null" };
    }
  };

  getByRandomId = async () => {
    if (fs.existsSync(pathToProducts)) {
      let data = await fs.promises.readFile(pathToProducts, "utf-8");
      let products = JSON.parse(data);
      let rand = Math.floor(Math.random() * products.length);
      let rProduct = products[rand];
      return rProduct;
    }
  };

  getAll = async () => {
    if (fs.existsSync(pathToProducts)) {
      let data = await fs.promises.readFile(pathToProducts, "utf-8");
      let products = JSON.parse(data);
      if (products) return products;
      return { status: "error", message: "error" };
    }
  };

  deletebyId = async (id) => {
    if (!id) return { status: "error", error: "ID needed" };
    if (fs.existsSync(pathToProducts)) {
      let data = await fs.promises.readFile(pathToProducts, "utf-8");
      let products = JSON.parse(data);
      let product = products.find((p) => p.id === id);
      if (product) {
        let newProducts = products.filter((product) => product.id !== id);
        await fs.promises.writeFile(
          pathToProducts,
          JSON.stringify(newProducts, null, 2)
        );
        return { status: "success", message: "Product deleted" };
      } else {
        return { status: "error", error: "Product not found" };
      }
    }
  };

  deleteAll = async () => {
    if (fs.existsSync(pathToProducts)) {
      fs.unlinkSync(pathToProducts);
      return { status: "success", message: "All deleted" };
    } else {
      return { status: "error", error: "File not found" };
    }
  };
}

export default Container;
