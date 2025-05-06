// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth/cordova";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH-d1wzXo-uB6LXjF6W2xRuucxHYhErJU",
  authDomain: "blog-app-2b1a7.firebaseapp.com",
  projectId: "blog-app-2b1a7",
  storageBucket: "blog-app-2b1a7.firebasestorage.app",
  messagingSenderId: "96981221397",
  appId: "1:96981221397:web:75f581f58e9d2a6b150e1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const checkAuthState = (dispatch, setUser) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log("User is still logged in:", user);
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          isLogged: true,
        })
      );
    } else {
      console.log("No user is logged in");
    }
  });
};
