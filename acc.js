// account.js
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM elements
const userCartList = document.getElementById("user-cart-list");
const userCartTotal = document.getElementById("user-cart-total");

let cart = [];

// Update cart UI
function updateCartUI() {
  console.log("Updating account cart UI:", cart);
  userCartList.innerHTML = "";
  let total = 0;

  if (!cart || cart.length === 0) {
    userCartList.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach((item, index) => {
      if (item && item.name && item.price) {
        total += item.price;
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.name} - ₹${item.price.toFixed(2)}
          <button onclick="removeFromCart(${index})">❌</button>
        `;
        userCartList.appendChild(li);
      }
    });
  }

  userCartTotal.textContent = total.toFixed(2);
  console.log(`Account cart total: ₹${total.toFixed(2)}`);
}

// Remove item from cart
window.removeFromCart = function (index) {
  console.log(`Removing account item at index: ${index}`);
  const user = auth.currentUser;
  if (user) {
    const cartRef = ref(database, `users/${user.uid}/cart`);
    cart.splice(index, 1);
    set(cartRef, cart)
      .then(() => {
        console.log("Account cart updated:", cart);
        updateCartUI();
      })
      .catch((error) => {
        console.error("Error removing item:", error);
        alert("Failed to remove item.");
      });
  } else {
    console.log("User not authenticated for removal");
    alert("Please sign in to modify your cart.");
    window.location.href = "login.html";
  }
};

// Load cart on page load
onAuthStateChanged(auth, (user) => {
  console.log("Account auth state changed");
  if (user) {
    const uid = user.uid;
    const cartRef = ref(database, `users/${uid}/cart`);
    console.log(`Fetching account cart for user: ${uid}`);

    onValue(
      cartRef,
      (snapshot) => {
        console.log("Account cart snapshot:", snapshot.val());
        cart = snapshot.exists() ? snapshot.val() : [];
        if (!Array.isArray(cart)) {
          console.warn("Account cart is not an array, resetting");
          cart = [];
          set(cartRef, cart);
        }
        updateCartUI();
      },
      (error) => {
        console.error("Error fetching account cart:", error);
        alert("Failed to load cart data.");
      }
    );
  } else {
    console.log("No user logged in, redirecting");
    alert("Please sign in to view your cart.");
    window.location.href = "login.html";
  }
});
