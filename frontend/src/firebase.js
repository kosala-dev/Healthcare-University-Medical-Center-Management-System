import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMz8sVEox988AzWlzDN5SiuheYCqljqfE",
  authDomain: "unimedicare-uov.firebaseapp.com",
  projectId: "unimedicare-uov",
  storageBucket: "unimedicare-uov.firebasestorage.app",
  messagingSenderId: "268063532764",
  appId: "1:268063532764:web:f1112febb8dad385413619",
  measurementId: "G-RC4GJZHZ2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;