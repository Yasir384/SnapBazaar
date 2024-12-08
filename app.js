let products = [];

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    products = response

    const filterStatus = localStorage.getItem("filterStatus") || "all";
    const filteredProducts = filterStatus === "all"
      ? products
      : products.filter(item => item.category === filterStatus);

    render(filteredProducts); 
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function render(prods) {
  const div = document.querySelector(".container");

  if (div) {
    div.innerHTML = ""; 
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

function store(id) {
  localStorage.setItem("id", id); 
  window.location = "single.html"; 
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function additem(id) {
  let cartItem = products.find(item => item.id === id);

  if (!cartItem) {
    console.error(`Product with ID ${id} not found.`);
    return; 
  }

  let existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    let lineItem = {
      id: cartItem.id,
      title: cartItem.title,
      image: cartItem.image,
      price: cartItem.price,
      quantity: 1
    };
    cart.push(lineItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

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
  let quantity = parseInt(ele.value);

  if (isNaN(quantity) || quantity <= 0) {
    ele.value = cart.find(item => item.id === id).quantity;
    return;
  }

  let cartItem = cart.find(item => item.id === id);
  if (cartItem) {
    cartItem.quantity = quantity;

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
function updateCartCount() {
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartIcon = document.querySelector(".cart-count");
  if (cartIcon) {
    cartIcon.textContent = totalItems;
  }
}

function setFilters(status) {
  localStorage.setItem("filterStatus", status); 
  const filteredProducts = status === "all"
    ? products
    : products.filter(item => item.category === status);

  render(filteredProducts);
}

window.addEventListener("DOMContentLoaded", () => {
  render();
  updateCartPopup()
  updateCartCount(); 
});
