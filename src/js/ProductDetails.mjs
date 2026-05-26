// Purpose: This module is responsible for displaying the details of a single product. It retrieves the product data based on the product ID from the URL and renders it on the page.
import { setLocalStorage, getLocalStorage } from "./utils.mjs";


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

    renderProductDetails() {
        document.getElementById("Brand").textContent = this.product.Brand.Name;
        document.getElementById("NameWithoutBrand").textContent = this.product.NameWithoutBrand;
        document.getElementById("Image").src = this.product.Images.PrimaryLarge;
        document.getElementById("ListPrice").textContent = `$${this.product.ListPrice.toFixed(2)}`;
        document.getElementById("FinalPrice").textContent = `$${this.product.FinalPrice.toFixed(2)}`;

        const discount = this.product.ListPrice - this.product.FinalPrice;
        const discountPercent = Math.round((discount / this.product.ListPrice) * 100);

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
    }

}