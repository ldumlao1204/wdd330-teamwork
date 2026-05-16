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

        // add listener to Add to Cart button
        document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    }

    async renderProductDetails() {
        // Check if product data is valid and has required properties before rendering
        if (!this.product || !this.product.Id || !this.product.Brand || !this.product.NameWithoutBrand) {
            console.error("Product not found");
            console.log("Product data:", this.product);
            return;
        }

        if (this.product) {
            document.getElementById("Brand").textContent = this.product.Brand.Name;
            document.getElementById("NameWithoutBrand").textContent = this.product.NameWithoutBrand;
            document.getElementById("Image").src = this.product.Image;
            document.getElementById("ListPrice").textContent = `$${this.product.ListPrice.toFixed(2)}`;
            document.getElementById("Colors").textContent = this.product.Colors.map(color => color.ColorName).join(" | ");
            console.log(this.product.Colors.map(color => color.ColorName).join(" | "));
            document.getElementById("DescriptionHtmlSimple").innerHTML = this.product.DescriptionHtmlSimple;
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
        // Check if product is valid before adding to cart
        if (!this.product || !this.product.Id) {
            console.error("No product to add to cart");
            return;
        }

        // Add product to cart and log the action
        this.addProductToCart();
        console.log("Product added to cart:", this.product);
    }

}