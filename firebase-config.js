// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// Your Firebase config (replace with your values)
export const firebaseConfig = {
  apiKey: "AIzaSyDcFJKbqXx50QEyQBCIwx23-MKayF55_g8",
  authDomain: "organicstore-5572f.firebaseapp.com",
  projectId: "organicstore-5572f",
  storageBucket: "organicstore-5572f.firebasestorage.app",
  messagingSenderId: "409284670984",
  appId: "1:409284670984:web:214c6f90fe96857dbb03bd",
  measurementId: "G-MRC7T3DZW4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
// const auth = getAuth(app);

// Export to use in other scripts
// export { db, auth };

// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// // const auth = getAuth(app);
// export { db, auth };
