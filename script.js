import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getFirestore, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Renamed to avoid 'db' conflict
const firestore = getFirestore(app);

// DOM elements
const cartCount = document.querySelector("#cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartDropdown = document.getElementById("cart-dropdown");
const checkoutPage = document.getElementById("checkout-page");
const checkoutProducts = document.getElementById("checkout-products");
const checkoutTotal = document.getElementById("checkout-total");

let cart = [];

// Firebase Setup (assuming you already have Firebase configured)
let user = null;
onAuthStateChanged(auth, (currentUser) => {
  user = currentUser;
  if (user) {
    console.log("User is logged in: ", user.uid);
    loadCart(user.uid);
  } else {
    console.log("No user is logged in.");
    cart = [];
    updateCartUI();
  }
});

// Toggle cart dropdown
window.toggleCart = function () {
  console.log("Toggling cart dropdown");
  cartDropdown.classList.toggle("hidden");
};

// Add item to cart
window.addToCart = function (name, price) {
  console.log(`Attempting to add to cart: ${name}, ₹${price}`);

  if (user) {
    const uid = user.uid;
    const cartRef = ref(database, `users/${uid}/cart`);

    // Fetch current cart
    onValue(
      cartRef,
      (snapshot) => {
        cart = snapshot.exists() ? snapshot.val() : [];
        if (!Array.isArray(cart)) {
          console.warn("Cart is not an array, resetting to empty");
          cart = [];
        }

        // Add new item
        cart.push({ name, price });

        // Save to Firebase
        set(cartRef, cart)
          .then(() => {
            console.log("Cart saved:", cart);
            updateCartUI();
          })
          .catch((error) => {
            console.error("Error saving cart:", error);
            alert("Failed to add item to cart.");
          });
      },
      { onlyOnce: true }
    );
  } else {
    console.log("User not authenticated");
    alert("Please sign in to add items to your cart.");
    window.location.href = "login.html";
  }
};

// Remove item from cart
window.removeFromCart = function (index) {
  console.log(`Removing item at index: ${index}`);
  if (user) {
    const uid = user.uid;
    const cartRef = ref(database, `users/${uid}/cart`);

    cart.splice(index, 1); // Remove item

    set(cartRef, cart)
      .then(() => {
        console.log("Cart updated after removal:", cart);
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

// Save product to Firestore (user wishlist)
function saveProduct(name, price) {
  if (user) {
    const userRef = doc(firestore, "users", user.uid);
    const savedItemsRef = collection(userRef, "savedItems");

    setDoc(doc(savedItemsRef), {
      name: name,
      price: price,
      savedAt: new Date(),
    })
      .then(() => {
        alert("Product saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving product: ", error);
      });
  } else {
    alert("You need to be logged in to save items!");
  }
}

// Attach the saveProduct function to the "Save" button on products
document.querySelectorAll('.shop-now-btn').forEach((button) => {
  button.addEventListener('click', (e) => {
    const productTitle = e.target.closest('.product-info').querySelector('.product-title').textContent;
    const productPrice = parseFloat(e.target.closest('.product-info').querySelector('.price').textContent.replace('₹', ''));
    saveProduct(productTitle, productPrice);
  });
});

// Update cart UI
function updateCartUI() {
  console.log("Updating cart UI:", cart);
  cartItems.innerHTML = "";
  let total = 0;

  if (!cart || cart.length === 0) {
    cartItems.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach((item, index) => {
      if (item && item.name && item.price) {
        total += item.price;
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.name} - ₹${item.price.toFixed(2)}
          <button onclick="removeFromCart(${index})">❌</button>
        `;
        cartItems.appendChild(li);
      }
    });
  }

  cartCount.textContent = cart.length;
  cartTotal.textContent = total.toFixed(2);
  console.log(`Cart count: ${cart.length}, Total: ₹${total.toFixed(2)}`);
}

// Go to checkout
window.goToCheckout = function () {
  console.log("Opening checkout:", cart);
  checkoutProducts.innerHTML = "";
  let total = 0;

  if (!cart || cart.length === 0) {
    checkoutProducts.innerHTML = "<div>Your cart is empty.</div>";
  } else {
    cart.forEach((item) => {
      if (item && item.name && item.price) {
        total += item.price;
        const div = document.createElement("div");
        div.innerHTML = `${item.name} - ₹${item.price.toFixed(2)}`;
        checkoutProducts.appendChild(div);
      }
    });
  }

  checkoutTotal.textContent = total.toFixed(2);
  checkoutPage.classList.remove("hidden");
  console.log("Checkout page opened");
};

window.addToCart = function (name, price) {
  console.log(`Attempting to add to cart: ${name}, ₹${price}`);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const cartRef = ref(database, `users/${uid}/cart`);
      console.log(`Authenticated user: ${uid}`);

      // Fetch current cart
      onValue(
        cartRef,
        (snapshot) => {
          cart = snapshot.exists() ? snapshot.val() : [];
          if (!Array.isArray(cart)) {
            console.warn("Cart is not an array, resetting to empty");
            cart = [];
          }

          // Add new item
          cart.push({ name, price });

          // Save to Firebase
          set(cartRef, cart)
            .then(() => {
              console.log("Cart saved:", cart);
              updateCartUI();
            })
            .catch((error) => {
              console.error("Error saving cart:", error);
              alert("Failed to add item to cart.");
            });
        },
        { onlyOnce: true }
      );
    } else {
      console.log("User not authenticated");
      alert("Please sign in to add items to your cart.");
      window.location.href = "login.html";
    }
  });
};


// Close checkout
window.closeCheckout = function () {
  console.log("Closing checkout");
  checkoutPage.classList.add("hidden");
};

// Load cart from Firebase
function loadCart(uid) {
  const cartRef = ref(database, `users/${uid}/cart`);
  console.log(`Fetching cart for user: ${uid}`);

  onValue(
    cartRef,
    (snapshot) => {
      console.log("Cart snapshot:", snapshot.val());
      cart = snapshot.exists() ? snapshot.val() : [];
      if (!Array.isArray(cart)) {
        console.warn("Cart is not an array, resetting");
        cart = [];
        set(cartRef, cart); // Reset the cart in Firebase
      }
      updateCartUI();
    },
    (error) => {
      console.error("Error fetching cart:", error);
      alert("Failed to load cart data.");
    }
  );
}
