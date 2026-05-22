import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

const listElement = document.querySelector(".product-list");
const cart = new ShoppingCart(listElement);
cart.init();
cart.render();

loadHeaderFooter();
