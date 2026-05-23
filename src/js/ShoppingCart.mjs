import { renderListWithTemplate, getLocalStorage  } from "./utils.mjs";

function cartItemTemplate(item) {
    return `
    <li class="cart-card divider" data-id="${item.Id}">
    <a href="#" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
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
}

export default class ShoppingCart {
    constructor (listElement) {
        this.listElement = listElement;
        this.items = [];
    }

    init() {
        this.items = getLocalStorage("so-cart") || [];
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
