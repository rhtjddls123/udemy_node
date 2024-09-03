const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }; // 파일이 없으면
      if (!err) {
        cart = JSON.parse(fileContent); // 파일이 있을경우
      }

      const existingProductIndex = cart.products.findIndex((v) => v.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updateProduct; // {id:'', qty: 1}

      if (existingProduct) {
        // 이미 현재 제품이 장바구니에 있을 경우
        updateProduct = { ...existingProduct };
        updateProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updateProduct;
      } else {
        // 제품이 새로 들어왔을 경우
        updateProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updateProduct];
      }

      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const updateCart = { ...JSON.parse(fileContent) };
      const product = updateCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updateCart.products = updateCart.products.filter((prod) => prod.id !== id);
      updateCart.totalPrice -= productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updateCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
