// Purpose: This module is responsible for displaying the details of a single product. It retrieves the product data based on the product ID from the URL and renders it on the page.
import { setLocalStorage, getLocalStorage, renderCartCount, alertMessage } from "./utils.mjs";


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {}; // Initialize product as an empty object
        this.dataSource = dataSource;
    }

    async init() {
        console.log("Fetching product with ID:", this.productId);
        this.product = await this.dataSource.findProductById(this.productId);
        console.log("Product loaded:", this.product);  // Add this
        if (!this.product) {
            console.error("Product not found");
            return;
        }
        this.renderProductDetails();
        console.log("Rendering complete");  // Add this

        const addButton = document.getElementById("addToCart");
        if (addButton) {
            addButton.addEventListener("click", this.addProductToCart.bind(this));
        }
    }

    renderProductDetails() {
        document.getElementById("Brand").textContent = this.product.Brand.Name;
        document.getElementById("NameWithoutBrand").textContent = this.product.NameWithoutBrand;
        document.getElementById("Image").src = this.product.Images.PrimaryLarge;
        document.getElementById("ListPrice").textContent = `$${this.product.SuggestedRetailPrice.toFixed(2)}`;
        document.getElementById("FinalPrice").textContent = `$${this.product.FinalPrice.toFixed(2)}`;

        const discount = this.product.SuggestedRetailPrice - this.product.FinalPrice;
        const discountPercent = Math.round((discount / this.product.SuggestedRetailPrice) * 100);

        if (discount > 0) {
            document.getElementById("Discount").textContent = `You save: $${discount.toFixed(2)} (${discountPercent}% off!)`;
        } else {
            document.getElementById("FinalPrice").textContent = "";
        }

        document.getElementById("Colors").textContent = this.product.Colors.map(color => color.ColorName).join(" | ");
        document.getElementById("DescriptionHtmlSimple").innerHTML = this.product.DescriptionHtmlSimple;
    }

    async addProductToCart() {
        let cartContents = getLocalStorage("so-cart") || [];
        if (!Array.isArray(cartContents)) {
            cartContents = [];
        }
        cartContents.push(this.product);
        setLocalStorage("so-cart", cartContents);
        renderCartCount();
        alertMessage(`${this.product.NameWithoutBrand} added to cart!`, false);
    }

}