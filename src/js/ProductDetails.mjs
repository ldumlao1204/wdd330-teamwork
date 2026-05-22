// Purpose: This module is responsible for displaying the details of a single product. It retrieves the product data based on the product ID from the URL and renders it on the page.
import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {}; // Initialize product as an empty object
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        console.log("here")

        // add listener to Add to Cart button
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    async renderProductDetails() {
        const product = await this.dataSource.findProductById(this.productId);

        if (product) {
            document.getElementById("Brand").textContent = product.Brand.Name;
            document.getElementById("NameWithoutBrand").textContent = product.NameWithoutBrand;
            document.getElementById("Image").src = product.Image;
            document.getElementById("ListPrice").textContent = `$${product.ListPrice.toFixed(2)}`;
            document.getElementById("Colors").textContent = product.Colors.map(color => color.ColorName).join(" | ");
            console.log(product.Colors.map(color => color.ColorName).join(" | "));
            document.getElementById("DescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
        } else {
            console.error("Product not found");
        }

    }

    async addProductToCart() {
        let cartContents = getLocalStorage("so-cart") || [];
        if (!Array.isArray(cartContents)) {
            cartContents = [];
        }
        cartContents.push(this.product);
        setLocalStorage("so-cart", cartContents);
    }

    // add to cart button event handler
    async addToCartHandler() {
        this.addProductToCart();
        console.log("Product added to cart:", this.product);
    }

}