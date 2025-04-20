// auth.js
import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// DOM elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");

// Sign Up
signUpBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      message.textContent = `✅ Signed up: ${userCredential.user.email}`;
    })
    .catch((err) => {
      message.textContent = `❌ ${err.message}`;
    });
});

// Sign In
signInBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      message.textContent = `✅ Signed in: ${userCredential.user.email}`;
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch((err) => {
      message.textContent = `❌ ${err.message}`;
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      message.textContent = "👋 Logged out!";
    })
    .catch((err) => {
      message.textContent = `❌ ${err.message}`;
    });
});

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    logoutBtn.classList.remove("hidden");
    signInBtn.classList.add("hidden");
    signUpBtn.classList.add("hidden");
    message.textContent = `👤 Logged in: ${user.email}`;
  } else {
    logoutBtn.classList.add("hidden");
    signInBtn.classList.remove("hidden");
    signUpBtn.classList.remove("hidden");
    message.textContent = `🔐 Not logged in`;
  }
});
