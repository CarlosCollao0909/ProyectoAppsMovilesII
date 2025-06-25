import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBrIbx0m8frhW7aVnLWZRZ0KyE24M_2lxo",
  authDomain: "app-ventas-polleria.firebaseapp.com",
  projectId: "app-ventas-polleria",
  storageBucket: "app-ventas-polleria.firebasestorage.app",
  messagingSenderId: "630153195211",
  appId: "1:630153195211:web:2d1c2a795cfbbbfa2a354e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };