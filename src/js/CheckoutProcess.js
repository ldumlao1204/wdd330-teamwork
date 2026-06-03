import { getLocalStorage, loadHeaderFooter, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Create an instance of ExternalServices to use in the submitOrder function
const externalServices = new ExternalServices();

// CheckoutOrder class to manage the checkout process
export default class CheckoutOrder {
    constructor(listElement) {
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
        if (!this.items || this.items.length === 0) {
            this.total = 0;
            const cartTotalElement = document.getElementById("cart-total");
            if (cartTotalElement) {
                cartTotalElement.textContent = `Cart Total: $0.00`;
            }
            return;
        }
        try {
            this.total = this.items.reduce((sum, item) => {
                const price = parseFloat(item.FinalPrice) || 0;
                const quantity = parseInt(item.quantity) || 1;
                return sum + (price * quantity);
            }, 0);
            const cartTotalElement = document.getElementById("cart-total");
            if (cartTotalElement) {
                cartTotalElement.textContent = `Cart Total: $${this.total.toFixed(2)}`;
            }
        }
        catch (error) {
            console.error("Error calculating total:", error);
        }
    }

    renderOrderDetails() {
        if (!document.getElementById("sub-total") || !document.getElementById("tax") || !document.getElementById("shipping-estimate") || !document.getElementById("order-total")) {
            console.warn("One or more order detail elements not found. Skipping order details rendering.");
            return;
        }
        try {
            document.getElementById("sub-total").textContent = `Subtotal: $${this.total.toFixed(2)}`;
            const tax = this.total * this.taxRate;
            document.getElementById("tax").textContent = `Tax (${(this.taxRate * 100).toFixed(0)}%): $${tax.toFixed(2)}`;
            const totalQuantity = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const shipping = this.total > 0 ? 10 + ((totalQuantity - 1) * 2) : 0.00; // Flat shipping rate of $10 plus 10% of the total if there are items in the cart
            document.getElementById("shipping-estimate").textContent = `Shipping: $${shipping.toFixed(2)}`;
            const orderTotal = this.total + tax + shipping;
            document.getElementById("order-total").textContent = `Order Total: $${orderTotal.toFixed(2)}`;
        }
        catch (error) {
            console.error("Error rendering order details:", error);
        }
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
        const totalQty = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);


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
            orderTotal: (this.total + (this.total * this.taxRate) + (this.total > 0 ? 10 + ((totalQty - 1) * 2) : 0.00)).toFixed(2),
            shipping: (this.total > 0 ? 10 + ((totalQty - 1) * 2) : 0.00),
            tax: (this.total * this.taxRate).toFixed(2)
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

        // API will return:
        //{
        //     message: "Order Placed"
        //     orderId: 3,
        // }
    }
}

async function submitOrder() {
    if (!document.getElementById("checkout-form")) {
        console.warn("Checkout form not found. Skipping order submission setup.");
        return;
    }
    try {
        const form = document.getElementById("checkout-form");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                const orderData = await checkout.packageItems();
                console.log("Order data:", orderData);

                const response = await externalServices.checkout(orderData);
                console.log("Success:", response);

                // Store the order ID in localStorage to display on the success page
                localStorage.setItem("confirmationOrderId", response.orderId);
                localStorage.removeItem("so-cart");
                // Redirect to the success page
                window.location.href = "/checkout/success.html";

            } catch (error) {
                console.error("Error:", error);

                let errorMessage = "An error occurred. Please try again.";

                if (error.message) {
                    if (typeof error.message === "string") {
                        errorMessage = error.message;
                    } else if (typeof error.message === "object") {
                        // Combine all validation errors
                        errorMessage = Object.values(error.message);
                    }
                }

                alertMessage(errorMessage);
            }
        });
    }
    catch (error) {
        console.error("Error setting up order submission:", error);
    }
}

async function loadConfirmationDetails() {
    const orderId = localStorage.getItem("confirmationOrderId");
    if (orderId) {
        document.getElementById("confirmation-order-id").textContent = orderId;
        localStorage.removeItem("confirmationOrderId"); // Clear it after displaying
    }
}

// initiate checkout promise functions
submitOrder();
loadConfirmationDetails();

// Create an instance and initialize it
const checkout = new CheckoutOrder(/* element for renderList */);
checkout.init(); // This calls renderOrderDetails()

// Initialize header and footer
loadHeaderFooter();