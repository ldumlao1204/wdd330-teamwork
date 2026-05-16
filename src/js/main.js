import ProductList from "./ProductList.mjs";

(async () => {
    const productList = new ProductList("tents");
    await productList.init();
})();