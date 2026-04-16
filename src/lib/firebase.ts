import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwQuhiSGBxmPH7jiJMXNUQRQSYTEXHDJc",
  authDomain: "ecommerce-51ec8.firebaseapp.com",
  projectId: "ecommerce-51ec8",
  storageBucket: "ecommerce-51ec8.firebasestorage.app",
  messagingSenderId: "88939755637",
  appId: "1:88939755637:web:7eba3933a6a74888c5e03c",
  measurementId: "G-VWXRMJR2DP",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize analytics only in browser
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  });
}

export const SUPER_ADMIN_EMAIL = "sandhyaporapu7@gmail.com";
