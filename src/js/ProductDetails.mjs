// Purpose: This module is responsible for displaying the details of a single product. It retrieves the product data based on the product ID from the URL and renders it on the page.
import { setLocalStorage, getLocalStorage } from "./utils.mjs";


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
        if (!this.product) {
            console.error("Product data is not available.");
            return;
        }
        console.log("Starting to render. Product:", this.product);
        
        const brandElement = document.getElementById("Brand");
        const nameWithoutBrandElement = document.getElementById("NameWithoutBrand");
        const imageElement = document.getElementById("Image");
        const listPriceElement = document.getElementById("ListPrice");
        const colorsElement = document.getElementById("Colors");
        const descriptionElement = document.getElementById("DescriptionHtmlSimple");

        console.log("Brand element:", brandElement);
        console.log("NameWithoutBrand element:", nameWithoutBrandElement);
        console.log("Image element:", imageElement);
        console.log("ListPrice element:", listPriceElement);
        console.log("Colors element:", colorsElement);
        console.log("Description element:", descriptionElement);
        
        if (this.product.Brand) {
            console.log("Setting brand to:", this.product.Brand.Name);
            brandElement.textContent = this.product.Brand.Name;
        }
        if (this.product.NameWithoutBrand) {
            console.log("Setting name without brand to:", this.product.NameWithoutBrand);
            nameWithoutBrandElement.textContent = this.product.NameWithoutBrand;
        }
        if (this.product.Images?.PrimaryLarge) {
            console.log("Setting image to:", this.product.Images.PrimaryLarge);
            document.getElementById("Image").src = this.product.Images.PrimaryLarge;
        }
        if (this.product.ListPrice) {
            console.log("Setting list price to:", this.product.ListPrice);
            document.getElementById("ListPrice").textContent = `$${this.product.ListPrice.toFixed(2)}`;
        }
        if (this.product.Colors) {
            console.log("Setting colors to:", this.product.Colors);
            document.getElementById("Colors").textContent = this.product.Colors.map(color => color.ColorName).join(" | ");
        }
        if (this.product.DescriptionHtmlSimple) {
            console.log("Setting description to:", this.product.DescriptionHtmlSimple);
            document.getElementById("DescriptionHtmlSimple").innerHTML = this.product.DescriptionHtmlSimple;
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

}