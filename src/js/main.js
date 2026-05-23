import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs"  

const dataSource = new ProductData("tents");

async function init() {
    const listElement = document.querySelector(".product-list");
    const productList = new ProductList("tents", dataSource, listElement);
    await productList.init();  // this loads the product date from JSON
    productList.render();  // this renders the product on the page using the template literal approach
    console.log(productList.products); //logs the products for debugging
}

init(); 

loadHeaderFooter();