import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    alert("User is signed in");
    // ...
  } else {
    alert("User is NOT signed in");
  }
});
