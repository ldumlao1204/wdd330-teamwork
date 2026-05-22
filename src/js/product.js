import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

<<<<<<< HEAD
const product = new ProductDetails(productId, dataSource);
product.init();
=======
function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
(async () => {
    console.log(dataSource.findProductById(productId));
    const product = new ProductDetails(productId, dataSource);
    await product.init();
})();
>>>>>>> 70f2fed6c1823d2bd14ddbe4384a47deb5061f85
