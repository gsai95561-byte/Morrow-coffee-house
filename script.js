const menuItems = [
  { id: "espresso", name: "Espresso", category: "hot", description: "A bold, beautiful little double shot.", price: 3.5, image: "photo-1510707577719-ae7c14805e3a", label: "The classic" },
  { id: "cappuccino", name: "Cappuccino", category: "hot", description: "Velvety microfoam, a little cocoa.", price: 4.75, image: "photo-1572442388796-11668a67e53d", label: "House favorite" },
  { id: "latte", name: "Latte", category: "hot", description: "Our signature espresso, steamed milk.", price: 5, image: "photo-1461023058943-07fcbe16d735", label: "Made with care" },
  { id: "americano", name: "Americano", category: "hot", description: "A long, lovely sip. Rich and smooth.", price: 4, image: "photo-1497515114629-f71d768fd07c", label: "Slow mornings" },
  { id: "iced-latte", name: "Iced latte", category: "cold", description: "Double espresso, cold milk, lots of ice.", price: 5.5, image: "photo-1517701604599-bb29b565090c", label: "A cool classic" },
  { id: "cold-brew", name: "Cold brew", category: "cold", description: "Steeped for 18 hours. Worth the wait.", price: 5, image: "photo-1517701550927-30cf4ba1dba5", label: "18-hour steep" },
  { id: "mocha-frappe", name: "Mocha frappé", category: "cold", description: "Chocolate, coffee, and a little daydream.", price: 6.25, image: "photo-1572490122747-3968b75cc699", label: "A sweet one" },
  { id: "sandwich", name: "Garden sandwich", category: "snacks", description: "Seasonal greens, whipped herbed feta.", price: 10.5, image: "photo-1528735602780-2552fd46c7af", label: "Made to order" },
  { id: "burger", name: "Morrow burger", category: "snacks", description: "Grass-fed beef, sharp cheddar, house pickles.", price: 14, image: "photo-1568901346375-23c9450c58cd", label: "A proper lunch" },
  { id: "fries", name: "Rosemary fries", category: "snacks", description: "Crispy, golden, with sea salt & rosemary.", price: 6, image: "photo-1573080496219-bb080dd4f877", label: "For the table" },
  { id: "cake", name: "Chocolate cake", category: "desserts", description: "Deep cocoa, silky frosting, no regrets.", price: 7, image: "photo-1578985545062-69928b1d9587", label: "Baked this morning" },
  { id: "brownie", name: "Fudgy brownie", category: "desserts", description: "Crackly top, soft middle, extra chocolate.", price: 4.5, image: "photo-1606313564200-e75d5e30476c", label: "A little treat" },
  { id: "croissant", name: "Butter croissant", category: "desserts", description: "Laminated by hand. Flaky in all the right ways.", price: 4, image: "photo-1555507036-ab1f4038808a", label: "Fresh every day" }
];

const imageUrl = (id, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const menuGrid = document.querySelector("#menu-grid");
const cart = new Map();
const categoryNames = { hot: "Hot coffee", cold: "Cold coffee", snacks: "Snacks", desserts: "Desserts" };

function renderMenu(category = "all") {
  const items = category === "all" ? menuItems : menuItems.filter((item) => item.category === category);
  menuGrid.innerHTML = items.map((item, index) => `
    <article class="menu-card" style="animation-delay:${index * 35}ms">
      <div class="menu-card-image">
        <img src="${imageUrl(item.image)}" alt="${item.name}" loading="lazy">
        <span class="menu-label">${item.label}</span>
      </div>
      <div class="menu-card-copy">
        <h3>${item.name}</h3>
        <p class="menu-description">${item.description}</p>
        <div class="menu-card-bottom">
          <span class="menu-price">$${item.price.toFixed(2)}</span>
          <button class="add-button" type="button" data-add="${item.id}" aria-label="Add ${item.name} to cart">+ Add to bag</button>
        </div>
      </div>
    </article>
  `).join("");
}

function updateCart() {
  const count = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((element) => { element.textContent = count; });
  document.querySelector(".cart-button").setAttribute("aria-label", `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`);
  document.querySelector(".cart-total strong").textContent = `$${total.toFixed(2)}`;

  const cartItems = document.querySelector(".cart-items");
  if (!cart.size) {
    cartItems.innerHTML = '<p class="cart-empty">Your bag\'s taking a little break.<br>Let\'s find it something lovely.</p>';
    return;
  }
  cartItems.innerHTML = [...cart.values()].map((item) => `
    <article class="cart-line">
      <img src="${imageUrl(item.image, 150)}" alt="">
      <div>
        <h3>${item.name}</h3><span>$${item.price.toFixed(2)} each</span>
        <div class="quantity-control">
          <button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Remove one ${item.name}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-quantity="${item.id}" data-change="1" aria-label="Add one ${item.name}">+</button>
        </div>
      </div>
      <strong class="cart-line-price">$${(item.price * item.quantity).toFixed(2)}</strong>
    </article>
  `).join("");
}

function setCartOpen(open) {
  const overlay = document.querySelector("[data-cart-overlay]");
  overlay.hidden = !open;
  document.body.classList.toggle("cart-open", open);
  if (open) document.querySelector(".cart-close").focus();
  else document.querySelector("[data-cart-open]").focus();
}

document.querySelector(".category-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  document.querySelectorAll(".category-tab").forEach((tab) => {
    const active = tab === button;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  renderMenu(button.dataset.category);
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const item = menuItems.find((entry) => entry.id === button.dataset.add);
  const current = cart.get(item.id);
  cart.set(item.id, { ...item, quantity: current ? current.quantity + 1 : 1 });
  updateCart();
  button.textContent = "Added ✓";
  window.setTimeout(() => { if (button.isConnected) button.textContent = "+ Add to bag"; }, 1100);
});

document.querySelector(".cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const item = cart.get(button.dataset.quantity);
  item.quantity += Number(button.dataset.change);
  if (item.quantity <= 0) cart.delete(item.id);
  updateCart();
});

document.querySelector("[data-cart-open]").addEventListener("click", () => setCartOpen(true));
document.querySelector(".cart-close").addEventListener("click", () => setCartOpen(false));
document.querySelector("[data-cart-overlay]").addEventListener("click", (event) => {
  if (event.target.matches("[data-cart-overlay]")) setCartOpen(false);
});
document.querySelector(".cart-checkout").addEventListener("click", () => {
  if (cart.size) {
    document.querySelector(".cart-footer > p").textContent = "Lovely choice. Place your order with our team at the counter.";
    document.querySelector(".cart-checkout").textContent = "See you soon ✓";
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!document.querySelector("[data-cart-overlay]").hidden) setCartOpen(false);
    if (document.querySelector(".navigation").classList.contains("is-open")) closeNavigation();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector(".form-status");
  if (!contactForm.reportValidity()) {
    status.textContent = "Please check your details and try again.";
    status.style.color = "#a23f36";
    return;
  }
  status.textContent = "Your note looks good. To send it, email hello@morrowcoffee.example.";
  status.style.color = "";
});

renderMenu();
updateCart();
