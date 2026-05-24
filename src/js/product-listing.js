import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs"
import { getParam } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData();

async function init() {
    const listElement = document.querySelector(".product-list");
    const productList = new ProductList(category, dataSource, listElement);
    await productList.init();
    productList.render();
    const categoryTitle = document.getElementById("section-category-title");
    if (category) {
        // Add 's' only if it doesn't already end in 's'
        const formattedCategory = "Top Products: " +category.charAt(0).toUpperCase() + category.slice(1);
        const displayName = formattedCategory.endsWith('s') ? formattedCategory : formattedCategory + 's';
        categoryTitle.textContent = displayName;
    } else {
        categoryTitle.textContent = "All Products";
    }
}
init(); 

loadHeaderFooter();