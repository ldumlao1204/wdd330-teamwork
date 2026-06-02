import {getLocalStorage, loadHeaderFooter} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Create an instance of ExternalServices to use in the submitOrder function
const externalServices = new ExternalServices();

// CheckoutOrder class to manage the checkout process
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
        const shipping = this.total > 0 ? 10 + ((this.items.length - 1) * 2) : 0.00; // Flat shipping rate of $10 plus 10% of the total if there are items in the cart
        document.getElementById("shipping-estimate").textContent = `Shipping: $${shipping.toFixed(2)}`;
        const orderTotal = this.total + tax + shipping;
        document.getElementById("order-total").textContent = `Order Total: $${orderTotal.toFixed(2)}`;
    }

    cartItems() {
        return this.items.map(item => ({
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.quantity || 1
        }));
    }

    async packageItems() {
        const cartItems = this.cartItems();

        // Collect order details from the form
        const orderFormDetails = {
            orderDate: new Date().toISOString(),
            fname: document.getElementById("firstname").value,
            lname: document.getElementById("lastname").value,
            street: document.getElementById("street-address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            zip: document.getElementById("zip").value,
            cardNumber: document.getElementById("card-number").value,
            expiration: document.getElementById("expiration").value,
            code: document.getElementById("cvv").value,
            items: cartItems,
            orderTotal: (this.total + (this.total * this.taxRate) + (this.total > 0 ? 10 + (this.items.length * 2) : 0.00)).toFixed(2),
            shipping: (this.total > 0 ? 10 + ((this.items.length - 1) * 2) : 0.00),
            tax: (this.total * this.taxRate).toFixed(2) // Convert tax to string to match API expectations
        }

        // package the form details along with the cart items and order total into a single object for submission to the server
        return orderFormDetails;

        // API expects:
        // {
            // orderDate: '2021-01-27T18:18:26.095Z',
            // fname: "John",
            // lname: "Doe",
            // street: "123 Main",
            // city: "Rexburg",
            // state: "ID",
            // zip: "83440",
            // cardNumber: "1234123412341234",
            // expiration: "8/21",
            // code: "123",
            // items: [{
            //     id: "20CXG"
            //     name: "The North Face Pivoter 27 L Backpack"
            //     price: 39.99,
            //     quantity: 1
            // }, {
            //     id: "14GVF",
            //     name: "Marmot 5°F Rampart Down Sleeping Bag - 650 Fill, Mummy (For Men and Women)",
            //     price: 229.99,
            //     quantity: 1
            // }],
            // orderTotal: "298.18",
            // shipping: 12,
            // tax: "16.20"
            // }
    }
}

async function submitOrder() {
    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", async (e) => {  // ← Make this async
        e.preventDefault();
        try {
            const orderData = await checkout.packageItems();  // ← Add await
            console.log("Order data:", orderData);
            
            const response = await externalServices.checkout(orderData);  // ← Add await
            console.log("Success:", response);

            document.getElementById("confirmation-order-id").textContent = response.orderId;
            document.getElementById("success-message").style.display = "block";
            form.reset();  // Clear the form
        } catch (error) {
            console.error("Error:", error);
        }
    });
}

submitOrder();  // ← Call it at the end

// Create an instance and initialize it
const checkout = new CheckoutOrder(/* element for renderList */);
checkout.init(); // This calls renderOrderDetails()

// Initialize header and footer
loadHeaderFooter();