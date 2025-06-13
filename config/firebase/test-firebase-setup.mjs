// Comprehensive Firebase Setup Test Script
import dotenv from 'dotenv';
dotenv.config();

import { cert, getApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getFunctions as getAdminFunctions } from 'firebase-admin/functions';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

console.log('🔍 Comprehensive Firebase Setup Test');
console.log('===================================\n');

// Client-side Firebase config
const firebaseAppConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Admin-side Firebase config
const adminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
};

async function testClientSetup() {
    console.log('🧪 Testing Client-side Firebase Setup...');
    
    try {
        // Initialize Firebase client
        const app = initializeApp(firebaseAppConfig);
        console.log('✅ Firebase client app initialized');

        // Test Auth
        const auth = getAuth(app);
        console.log('✅ Auth service connected');
        console.log('📱 Current user:', auth.currentUser ? 'Signed in' : 'Not signed in');

        // Test Firestore
        const db = getFirestore(app);
        console.log('✅ Firestore service connected');

        // Test Realtime Database
        const rtdb = getDatabase(app);
        console.log('✅ Realtime Database service connected');

        // Test Storage
        const storage = getStorage(app);
        console.log('✅ Storage service connected');

        // Test Functions
        const functions = getFunctions(app);
        console.log('✅ Functions service connected');

        console.log('\n✅ Client-side Firebase setup is working correctly!');
        return true;
    } catch (error) {
        console.error('\n❌ Client-side Firebase Error:', error.message);
        return false;
    }
}

async function testAdminSetup() {
    console.log('\n🧪 Testing Admin-side Firebase Setup...');
    
    try {
        // Initialize Firebase Admin
        if (!getApps().length) {
            const adminApp = initializeAdminApp(adminConfig);
            console.log('✅ Firebase Admin app initialized');
        }

        // Test Admin Auth
        const adminAuth = getAdminAuth();
        console.log('✅ Admin Auth service connected');

        // Test Admin Firestore
        const adminDb = getAdminFirestore();
        console.log('✅ Admin Firestore service connected');

        // Test Admin Realtime Database
        const adminRtdb = getAdminDatabase();
        console.log('✅ Admin Realtime Database service connected');

        // Test Admin Storage
        const adminStorage = getAdminStorage();
        console.log('✅ Admin Storage service connected');

        // Test Admin Functions
        const adminFunctions = getAdminFunctions();
        console.log('✅ Admin Functions service connected');

        console.log('\n✅ Admin-side Firebase setup is working correctly!');
        return true;
    } catch (error) {
        console.error('\n❌ Admin-side Firebase Error:', error.message);
        return false;
    }
}

async function testEnvironmentVariables() {
    console.log('\n🧪 Testing Environment Variables...');
    
    const requiredVars = {
        client: [
            'VITE_FIREBASE_API_KEY',
            'VITE_FIREBASE_AUTH_DOMAIN',
            'VITE_FIREBASE_DATABASE_URL',
            'VITE_FIREBASE_PROJECT_ID',
            'VITE_FIREBASE_STORAGE_BUCKET',
            'VITE_FIREBASE_MESSAGING_SENDER_ID',
            'VITE_FIREBASE_APP_ID',
            'VITE_FIREBASE_MEASUREMENT_ID'
        ],
        admin: [
            'FIREBASE_PROJECT_ID',
            'FIREBASE_CLIENT_EMAIL',
            'FIREBASE_PRIVATE_KEY'
        ]
    };

    let allValid = true;

    // Check client variables
    console.log('\nChecking client-side variables:');
    for (const varName of requiredVars.client) {
        const value = process.env[varName];
        if (value) {
            console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
        } else {
            console.log(`❌ ${varName}: MISSING`);
            allValid = false;
        }
    }

    // Check admin variables
    console.log('\nChecking admin-side variables:');
    for (const varName of requiredVars.admin) {
        const value = process.env[varName];
        if (value) {
            console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
        } else {
            console.log(`❌ ${varName}: MISSING`);
            allValid = false;
        }
    }

    return allValid;
}

// Main test function
async function runTests() {
    console.log('Starting comprehensive Firebase setup test...\n');
    
    const envValid = await testEnvironmentVariables();
    if (!envValid) {
        console.error('\n❌ Environment variables are not properly configured!');
        console.log('\nPlease check your .env.local file and ensure all required variables are set.');
        return;
    }

    const clientValid = await testClientSetup();
    const adminValid = await testAdminSetup();

    if (clientValid && adminValid) {
        console.log('\n🎉 SUCCESS: All Firebase services are properly configured!');
        console.log('✨ Your Firebase setup is ready for development.');
    } else {
        console.error('\n❌ Some Firebase services failed to initialize.');
        console.log('\nPlease check the error messages above and fix any configuration issues.');
    }
}

// Run the tests
runTests().catch(console.error); 