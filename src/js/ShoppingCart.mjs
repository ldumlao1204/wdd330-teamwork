import { renderListWithTemplate, getLocalStorage, renderCartCount  } from "./utils.mjs";

function cartItemTemplate(item) {
    return `
    <li class="cart-card divider" data-id="${item.Id}">
    <a href="#" class="cart-card__image">
    <img src="${item.Images?.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="#">
    <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <div class="cart-card__remove">
    <button class="cart-card__remove-button">
    <span class="material-symbols-outlined">X</span>
    </button>
    </li>
    </div>`;
}

function removeItem(id) {
    let cartItems = getLocalStorage("so-cart") || [];
    cartItems = cartItems.filter(item => item.Id !== id);
    localStorage.setItem("so-cart", JSON.stringify(cartItems));
    renderCartCount();
}

export default class ShoppingCart {
    constructor (listElement) {
        this.listElement = listElement;
        this.items = [];
        this.total = 0;
    }

    init() {
        this.items = getLocalStorage("so-cart") || [];
        this.calculateTotal();
    }

    calculateTotal() {
        if (!this.items || this.items.length === 0) {
            this.total = 0;
            const cartTotalElement = document.getElementById("cart-total");
            if (cartTotalElement) {
                cartTotalElement.textContent = `There are no items in your cart.`;
            }

            const checkoutButton = document.getElementById("checkout-button");
            if (checkoutButton) {
                checkoutButton.style.display = "none";
            }
            return;
        }
        this.items.forEach(item => {
            item.quantity = 1;
        });
        this.total = this.items.reduce((sum, item) => {
            const price = parseFloat(item.FinalPrice) || 0;
            const quantity = parseInt(item.Quantity) || 1;
            return sum + (price * quantity);
        }, 0);
        const cartTotalElement = document.getElementById("cart-total");
        if (cartTotalElement) {
            cartTotalElement.textContent = `Cart Total: $${this.total.toFixed(2)}`;
        }
    }

    render() {
        this.renderList(this.items);
        this.setupEventListeners();
    }

    renderList(list) {
        renderListWithTemplate(cartItemTemplate, this.listElement, list, "afterbegin", true);
    }

    setupEventListeners() {
        this.listElement.addEventListener("click", (event) => {
            if (event.target.closest(".cart-card__remove-button")) {
                const card = event.target.closest(".cart-card");
                const itemId = card.getAttribute("data-id");
                removeItem(itemId);
                this.init(); // Refresh items from localStorage
                this.render();
            }
        });
    }
}
