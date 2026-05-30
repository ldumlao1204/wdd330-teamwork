import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs"

loadHeaderFooter();

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, listElement);
productList.init();
