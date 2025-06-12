const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCw2EAp4CK3upZK6fP5K0xTpe1qWQFY9gA",
  authDomain: "hanapin-mo-ph.firebaseapp.com",
  projectId: "hanapin-mo-ph",
  storageBucket: "hanapin-mo-ph.appspot.com",
  messagingSenderId: "844810835839",
  appId: "1:844810835839:web:654001fe655cc1e6666c4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const email = 'admin@hanapinmo.ph';
const password = 'HanapinMo@2024'; // You should change this after first login

async function createAdmin() {
  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set admin role
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'admin',
      createdAt: new Date()
    });

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login.');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin(); 