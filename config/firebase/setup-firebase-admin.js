const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Firebase Admin Setup Helper');
console.log('============================\n');

// Function to read service account JSON file
async function readServiceAccountFile() {
    const answer = await new Promise(resolve => {
        rl.question('Enter the path to your Firebase service account JSON file: ', resolve);
    });

    try {
        const filePath = path.resolve(answer);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('❌ Error reading service account file:', error.message);
        return null;
    }
}

// Function to update .env.local file
async function updateEnvFile(serviceAccount) {
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    try {
        // Read existing .env.local if it exists
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Update or add Firebase Admin variables
        const updates = {
            'FIREBASE_PROJECT_ID': serviceAccount.project_id,
            'FIREBASE_CLIENT_EMAIL': serviceAccount.client_email,
            'FIREBASE_PRIVATE_KEY': `"${serviceAccount.private_key}"`
        };

        for (const [key, value] of Object.entries(updates)) {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (envContent.match(regex)) {
                envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
                envContent += `\n${key}=${value}`;
            }
        }

        // Write back to .env.local
        fs.writeFileSync(envPath, envContent.trim() + '\n');
        console.log('✅ Successfully updated .env.local with Firebase Admin credentials');
    } catch (error) {
        console.error('❌ Error updating .env.local:', error.message);
    }
}

// Main function
async function main() {
    console.log('This script will help you set up Firebase Admin credentials.\n');
    console.log('To get your service account credentials:');
    console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
    console.log('2. Click "Generate New Private Key"');
    console.log('3. Save the JSON file securely\n');

    const serviceAccount = await readServiceAccountFile();
    if (serviceAccount) {
        await updateEnvFile(serviceAccount);
    }

    rl.close();
}

main().catch(console.error); 