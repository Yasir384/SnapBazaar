let products = [];

// Fetch products from the API
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    products = response

    // Apply filters from localStorage or default to "all"
    const filterStatus = localStorage.getItem("filterStatus") || "all";
    const filteredProducts = filterStatus === "all"
      ? products
      : products.filter(item => item.category === filterStatus);

    render(filteredProducts); // Render products
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Render products
function render(prods) {
  const div = document.querySelector(".container");

  if (div) {
    div.innerHTML = ""; // Clear container
    if (prods && prods.length) {
      prods.map((item) => {
        div.innerHTML += `
          <div class="shop-item">
            <div class="shop-item-main">
              <img src="${item.image}" alt="${item.title}" class="shop-item-image">
              <h2 class="shop-item-title">${item.title.slice(0, 15)}...</h2>
              <div class="shop-item-detail">
                <div class="content-overflow">
                  <p>${item.description.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
            <div class="shop-item-bottom">
              <div class="col-6 txt-cntr">
                <a class="btn" onclick="store(${item.id})">See More...</a>
              </div>
              <div class="col-6 txt-cntr">
                <a class="btn-add" onclick="additem(${item.id})">Add to Cart</a>
              </div>
            </div>
          </div>`;
      });
    } else {
      div.innerHTML = `<p>No products found for the selected filter.</p>`;
    }
  }
}

// Function to navigate to the product details page
function store(id) {
  localStorage.setItem("id", id); // Save product ID in localStorage
  window.location = "single.html"; // Navigate to the product page
}

// Initialize cart from localStorage or set it as an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function additem(id) {
  let cartItem = products.find(item => item.id === id);

  if (!cartItem) {
    console.error(`Product with ID ${id} not found.`);
    return; // Exit if the product is not found
  }

  // Check if the item already exists in the cart
  let existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    // Increment the quantity if the item already exists in the cart
    existingItem.quantity++;
  } else {
    // Add the product as a new line item in the cart
    let lineItem = {
      id: cartItem.id,
      title: cartItem.title,
      image: cartItem.image,
      price: cartItem.price,
      quantity: 1
    };
    cart.push(lineItem);
  }

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart count
  updateCartCount();
  updateCartPopup()
}

function removeCart(id) {
  cart = cart.filter(item => item.id !== id)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount();
  updateCartPopup()
}
function updateCart(id, ele) {
  // Get the new quantity value from the input field
  let quantity = parseInt(ele.value);

  // Validate that the quantity is a positive number
  if (isNaN(quantity) || quantity <= 0) {
    // If invalid, set the input field back to the previous valid quantity
    ele.value = cart.find(item => item.id === id).quantity;
    return;
  }

  // Find the cart item and update its quantity
  let cartItem = cart.find(item => item.id === id);
  if (cartItem) {
    cartItem.quantity = quantity;

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
  }
}


function updateCartPopup() {
  let cartCont = document.getElementById('cart-item-container')
  cartCont.innerHTML = ''
  cart.forEach(item => {
    cartCont.innerHTML += `<div class="cart-item">
                    <a class="cart-item-image">
                        <img width="100%" src="${item.image}">
                    </a>
                    <div class="cart-item-detail">
                        <a class="cart-item-name">${item.title}</a>
                        <span class="qty">Qty#</span>
                        <input type="number" class="cart-item-quantity" onchange="updateCart(${item.id}, this)" value=${item.quantity}>
                        <div class="close-btn" onclick="removeCart(${item.id})">&times;</div>
                    </div>
                </div>`
  });
}
// Update cart count badge
function updateCartCount() {
  // Calculate total items in the cart
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update the cart count in the navbar
  const cartIcon = document.querySelector(".cart-count");
  if (cartIcon) {
    cartIcon.textContent = totalItems;
  }
}

// Set filters and re-render products
function setFilters(status) {
  localStorage.setItem("filterStatus", status); // Save filter status to localStorage
  const filteredProducts = status === "all"
    ? products
    : products.filter(item => item.category === status);

  render(filteredProducts);
}

// Run the render function when the page loads
window.addEventListener("DOMContentLoaded", () => {
  render();
  updateCartPopup()
  updateCartCount(); // Update cart count on load
});
