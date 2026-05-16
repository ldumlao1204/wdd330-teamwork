import ProductData from "./ProductData.mjs";

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource || new ProductData(this.category);
    }
    async init() {
        const products = await this.dataSource.getData();
        this.renderList(products);
    }

    renderList(products) {
        const productList = document.querySelector(".product-list");

        products.forEach(product => {
            if (product && product.Id) {
                try {
                    const card = this.ProductCardTemplate(product);
                    if (card) {
                        productList.appendChild(card);
                    }
                } catch (error) {
                    console.error("Failed to create product card for:", product, error);
                }
            }
        });
    }

    ProductCardTemplate(product) {
    // Validate product data before creating the card
    if (!product ||
        !product.Id || 
        !product.Brand || 
        !product.NameWithoutBrand || 
        !product.Image || 
        !product.ListPrice) 
        {
        console.error("Invalid product data:", product);
        return null;
    }

    // Clone the template content
    const template = document.getElementById("product-template-card");
    const productCard = template.content.cloneNode(true);

    // Populate the cloned template with product data
    try {
        productCard.querySelector("#Image").src = product.Image;
        productCard.querySelector("#Image").alt = product.NameWithoutBrand;
        productCard.querySelector("#Brand").textContent = product.Brand.Name;
        productCard.querySelector("#NameWithoutBrand").textContent = product.NameWithoutBrand;
        productCard.querySelector("#ListPrice").textContent = `$${product.ListPrice.toFixed(2)}`;
        productCard.querySelector("a").href = `product_pages/?product=${product.Id}`;

    } catch (error) {
        console.error("Error populating product card:", error);
        return null;
    }

    return productCard;
    }
}