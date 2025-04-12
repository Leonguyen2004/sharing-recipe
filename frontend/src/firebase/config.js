import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyB4UC8O9fjdSdE6xsIR_opWRVFFXQH2h-I",
    authDomain: "web-share-recipe.firebaseapp.com",
    projectId: "web-share-recipe",
    storageBucket: "web-share-recipe.firebasestorage.app",
    messagingSenderId: "231144387603",
    appId: "1:231144387603:web:6f343c5011c7032eb8fbe6",
    measurementId: "G-N0T0ZWC0D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
