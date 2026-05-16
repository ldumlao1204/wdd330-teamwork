import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

console.log(dataSource.findProductById(productId));

(async () => {
  const product = new ProductDetails(productId, dataSource);
  await product.init();
})();