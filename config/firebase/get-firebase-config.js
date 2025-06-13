const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version');
    return true;
  } catch (error) {
    console.error('❌ Firebase CLI not installed. Please run: npm install -g firebase-tools');
    return false;
  }
}

// Function to check if user is logged in to Firebase
function checkFirebaseLogin() {
  try {
    execSync('firebase login:list', { encoding: 'utf-8' });
    return true;
  } catch (error) {
    console.error('❌ Not logged in to Firebase. Please run: firebase login');
    return false;
  }
}

// Function to check if project is set
function checkFirebaseProject() {
  try {
    execSync('firebase projects:list', { encoding: 'utf-8' });
    return true;
  } catch (error) {
    console.error('❌ No Firebase project selected. Please run: firebase use --add');
    return false;
  }
}

// Function to get Firebase config
function getFirebaseConfig() {
  try {
    const raw = execSync('firebase apps:sdkconfig web --json', { encoding: 'utf-8' });
    const parsed = JSON.parse(raw);
    return parsed.result;
  } catch (error) {
    console.error('❌ Failed to fetch Firebase config:', error.message);
    return null;
  }
}

// Function to save config to JSON file
function saveConfigToJson(config) {
  const jsonPath = path.join(process.cwd(), 'firebase-config.json');
  const configObject = {
    firebase: {
      config: config
    }
  };
  fs.writeFileSync(jsonPath, JSON.stringify(configObject, null, 2));
  console.log('✅ Firebase config saved to firebase-config.json');
}

// Function to create .env file
function createEnvFile(config) {
  const envContent = `# Firebase Configuration
VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_DATABASE_URL=${config.databaseURL || ''}
VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
VITE_FIREBASE_APP_ID=${config.appId}
VITE_FIREBASE_MEASUREMENT_ID=${config.measurementId || ''}
`;

  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Firebase configuration saved to .env file');
}

// Function to create TypeScript config file
function createTypeScriptConfig(config) {
  const tsConfigContent = `// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseAppConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseAppConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Configuration for development vs production
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = !isProduction;

// Security configuration
export const securityConfig = {
  enableSSL: true,
  requireAuth: true,
  maxMessageLength: 10000,
  rateLimitWindow: 60000, // 1 minute
  maxRequestsPerWindow: 50
};
`;

  const tsConfigPath = path.join(process.cwd(), 'src/lib/firebase/config.ts');
  fs.writeFileSync(tsConfigPath, tsConfigContent);
  console.log('✅ Firebase TypeScript configuration updated');
}

// Main execution
async function main() {
  console.log('🔄 Starting Firebase configuration update...');

  // Check prerequisites
  if (!checkFirebaseCLI()) {
    process.exit(1);
  }

  if (!checkFirebaseLogin()) {
    process.exit(1);
  }

  if (!checkFirebaseProject()) {
    process.exit(1);
  }

  // Get and save configuration
  const config = getFirebaseConfig();
  if (config) {
    saveConfigToJson(config);
    createEnvFile(config);
    createTypeScriptConfig(config);
    console.log('✨ Firebase configuration updated successfully!');
    console.log('📋 Three files have been created/updated:');
    console.log('   1. firebase-config.json - Raw Firebase configuration');
    console.log('   2. .env - Environment variables for your application');
    console.log('   3. src/lib/firebase/config.ts - TypeScript configuration');
    console.log('🔄 Please restart your development server to apply the changes.');
  } else {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('❌ An unexpected error occurred:', error);
  process.exit(1);
}); 