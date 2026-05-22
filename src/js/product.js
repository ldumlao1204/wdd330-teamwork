import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

(async () => {
    console.log(dataSource.findProductById(productId));
    const product = new ProductDetails(productId, dataSource);
    await product.init();
})();