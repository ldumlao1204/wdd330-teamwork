import {getLocalStorage, loadHeaderFooter} from "./utils.mjs";

export default class CheckoutOrder {
    constructor (listElement) {
        this.listElement = listElement;
        this.items = [];
        this.total = 0;
        this.taxRate = 0.06; // Assuming a 6% tax rate
        this.orderTotal = 0;
    }

    init() {
        this.items = getLocalStorage("so-cart") || [];
        this.calculateTotal();
        this.renderOrderDetails();
    }

    calculateTotal() {
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

    renderOrderDetails() {
        document.getElementById("sub-total").textContent = `Subtotal: $${this.total.toFixed(2)}`;
        const tax = this.total * this.taxRate;
        document.getElementById("tax").textContent = `Tax (${(this.taxRate * 100).toFixed(0)}%): $${tax.toFixed(2)}`;
        const shipping = this.total > 0 ? 10 + (this.items.length * 2) : 0.00; // Flat shipping rate of $10 plus 10% of the total if there are items in the cart
        document.getElementById("shipping-estimate").textContent = `Shipping: $${shipping.toFixed(2)}`;
        const orderTotal = this.total + tax + shipping;
        document.getElementById("order-total").textContent = `Order Total: $${orderTotal.toFixed(2)}`;
    }
}

// Create an instance and initialize it
const checkout = new CheckoutOrder(/* element for renderList */);
checkout.init(); // This calls renderOrderDetails()

loadHeaderFooter();