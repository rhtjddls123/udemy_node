const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(__dirname, "..", "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (!err) {
      return cb(JSON.parse(fileContent));
    }
    cb([]);
  });
};

module.exports = class Product {
  constructor({ id, title, imageUrl, description, price }) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
        const updateProduct = [...products];
        updateProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
          if (err) console.error(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) console.error(err);
        });
      }
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static delete(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updateProduct = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
      cb();
    });
  }
};
