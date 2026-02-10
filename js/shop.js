const API = "https://fakestoreapi.com/products";
const RATE = 80; // dollar to rupee convert

// ---------- Helpers ----------
const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const setCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const priceINR = (p) => Math.round(p * RATE);

// ---------- PRODUCTS PAGE ----------
const productsContainer = document.getElementById("products");

if (productsContainer) {
    fetch(API)
        .then(res => res.json())
        .then(products => renderProducts(products));
}

function renderProducts(products) {
    productsContainer.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.image}" />
            <h3>${p.title}</h3>
            <p>₹ ${priceINR(p.price)}</p>
            <button onclick="viewProduct(${p.id})">View Product</button>
        </div>
    `).join("");
}

function viewProduct(id) {
    localStorage.setItem("productId", id);
    window.location.href = "product.html";
}

// ---------- PRODUCT DETAIL PAGE ----------
const detailContainer = document.getElementById("productDetail");

if (detailContainer) {
    const id = localStorage.getItem("productId");
    fetch(`${API}/${id}`)
        .then(res => res.json())
        .then(p => {
            detailContainer.innerHTML = `
                <img src="${p.image}" />
                <div class="product-info">
                    <h2>${p.title}</h2>
                    <p>${p.description}</p>
                    <h3>₹ ${priceINR(p.price)}</h3>
                    <button onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `;
        });
}

function addToCart(id) {
    const cart = getCart();
    cart.push(id);
    setCart(cart);

    // alert hata do
    window.location.href = "cart.html";
}


// ---------- CART PAGE ----------
const cartContainer = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

if (cartContainer) loadCart();

function loadCart() {
    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = "<h3>Your cart is empty 😢</h3>";
        return;
    }

    Promise.all(cart.map(id =>
        fetch(`${API}/${id}`).then(res => res.json())
    )).then(products => {
        let total = 0;

        cartContainer.innerHTML = products.map(p => {
            total += priceINR(p.price);
            return `
                <div class="cart-card">
                    <img src="${p.image}" />
                    <div class="cart-info">
                        <h4>${p.title}</h4>
                        <p>₹ ${priceINR(p.price)}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${p.id})">Remove</button>
                </div>
            `;
        }).join("");

        totalPriceEl.innerText = "Total: ₹" + total;
    });
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item !== id);
    setCart(cart);
    location.reload();
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

// ---------- CHECKOUT PAGE ----------
const summaryTotal = document.getElementById("summaryTotal");
const checkoutForm = document.getElementById("checkoutForm");

if (summaryTotal) {
    const cart = getCart();

    Promise.all(cart.map(id =>
        fetch(`${API}/${id}`).then(res => res.json())
    )).then(products => {
        const total = products.reduce((sum, p) => sum + priceINR(p.price), 0);
        summaryTotal.innerText = "Total: ₹" + total;
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("🎉 Order Placed Successfully!");
        localStorage.removeItem("cart");
        window.location.href = "products.html";
    });
}
