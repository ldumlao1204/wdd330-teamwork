// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}
//
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export function renderCartCount() {
  // This function assumes that the cart is stored in localStorage under the key "so-cart" and that it's an array of items.
  const cart = getLocalStorage("so-cart") || [];
  const cartCountElement = qs("#cart-count");
  const totalCount = cart.length;

  // Optional: Hide the cart count if there are no items in the cart
  if (totalCount === 0) {
    cartCountElement.style.display = "none";
  } else {
    cartCountElement.style.display = "block";
  }

  // Optional: Add a simple animation to draw attention to the cart count when it changes
  cartCountElement.classList.remove("cart-count-pop");
  void cartCountElement.offsetWidth; // Trigger a reflow to restart the animation
  cartCountElement.classList.add("cart-count-pop");

  // Update the cart count display after the animation
  cartCountElement.textContent = totalCount;
}

export function alertMessage(message, scroll=true) {
  const alert = document.createElement("div");
  const main = document.querySelector("main");

  alert.classList.add("alert");
  
  // Handle both string messages and arrays of errors
  if (Array.isArray(message)) {
    const ul = document.createElement("ul");
    message.forEach(error => {
      const li = document.createElement("li");
      li.textContent = error;
      ul.appendChild(li);
    });
    alert.appendChild(ul);
  } else {
    alert.textContent = message;
  }
  
  alert.addEventListener("click", function(e) {
    if (e.currentTarget === alert) {
      main.removeChild(alert);
    }
  });
  
  // Insert at the TOP of main instead of the end
  main.insertAdjacentElement("afterbegin", alert);
  
  if (scroll) {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
}

export function removeAllAlerts() {
  const main = document.querySelector("main");
  const alerts = main.querySelectorAll(".alert");
  alerts.forEach(alert => main.removeChild(alert));
}

export async function loadHeaderFooter() {

  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  renderCartCount();
}