<<<<<<< HEAD
#!/usr/bin/env node

/**
 * Firebase Auth Domains Automation
 * Uses Firebase Management API to programmatically update authorized domains
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class FirebaseAuthManager {
    constructor() {
        this.projectId = this.detectFirebaseProject();
        this.domains = this.loadDomains();
        this.accessToken = null;
    }

    detectFirebaseProject() {
        try {
            // Try to get project from .firebaserc
            const firebaseRc = path.join(process.cwd(), '.firebaserc');
            if (fs.existsSync(firebaseRc)) {
                const config = JSON.parse(fs.readFileSync(firebaseRc, 'utf8'));
                return config.projects?.default || null;
            }
            
            // Try firebase use command
            const result = execSync('firebase use', { encoding: 'utf8' });
            const match = result.match(/Active project: (.+?) \(/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('Could not detect Firebase project:', error.message);
            return null;
        }
    }

    loadDomains() {
        try {
            const domainFile = path.join(process.cwd(), 'firebase-domains-quick.txt');
            const content = fs.readFileSync(domainFile, 'utf8');
            return content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('//'));
        } catch (error) {
            console.error('Error loading domains:', error.message);
            return [];
        }
    }

    async getAccessToken() {
        try {
            console.log('🔑 Getting Firebase access token...');
            const result = execSync('gcloud auth print-access-token', { encoding: 'utf8' });
            this.accessToken = result.trim();
            console.log('✅ Access token obtained');
            return this.accessToken;
        } catch (error) {
            console.error('❌ Error getting access token:', error.message);
            console.log('💡 Make sure you are authenticated with: gcloud auth login ubeyo.software@gmail.com');
            return null;
        }
    }

    async getCurrentAuthDomains() {
        if (!this.accessToken) {
            await this.getAccessToken();
        }

        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'identitytoolkit.googleapis.com',
                path: `/admin/v2/projects/${this.projectId}/config`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const config = JSON.parse(data);
                        const authorizedDomains = config.authorizedDomains || [];
                        console.log('📋 Current authorized domains:', authorizedDomains);
                        resolve(authorizedDomains);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', reject);
            req.end();
        });
    }

    async updateAuthDomains() {
        if (!this.projectId) {
            console.error('❌ No Firebase project detected');
            return false;
        }

        if (!this.accessToken) {
            await this.getAccessToken();
        }

        if (!this.accessToken) {
            return false;
        }

        try {
            console.log(`🔥 Updating Firebase Auth domains for project: ${this.projectId}`);
            
            // Get current domains
            const currentDomains = await this.getCurrentAuthDomains();
            
            // Merge with new domains (remove duplicates)
            const allDomains = [...new Set([...currentDomains, ...this.domains])];
            
            console.log('🔄 Domains to set:', allDomains);

            // Update the configuration
            const updateData = {
                authorizedDomains: allDomains
            };

            return new Promise((resolve, reject) => {
                const postData = JSON.stringify(updateData);
                
                const options = {
                    hostname: 'identitytoolkit.googleapis.com',
                    path: `/admin/v2/projects/${this.projectId}/config?updateMask=authorizedDomains`,
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            console.log('✅ Firebase Auth domains updated successfully!');
                            console.log('📋 Updated domains:', allDomains);
                            resolve(true);
                        } else {
                            console.error('❌ Failed to update domains:', res.statusCode, data);
                            resolve(false);
                        }
                    });
                });

                req.on('error', (error) => {
                    console.error('❌ Request error:', error.message);
                    reject(error);
                });

                req.write(postData);
                req.end();
            });

        } catch (error) {
            console.error('❌ Error updating Firebase Auth domains:', error.message);
            return false;
        }
    }

    async run() {
        console.log('🚀 Firebase Auth Domains Automation');
        console.log('====================================');
        console.log(`📁 Project ID: ${this.projectId}`);
        console.log(`🌐 Domains to add: ${this.domains.join(', ')}`);
        console.log('');

        if (!this.projectId) {
            console.log('❌ No Firebase project detected. Please run: firebase use YOUR_PROJECT_ID');
            return false;
        }

        if (this.domains.length === 0) {
            console.log('❌ No domains to add. Check firebase-domains-quick.txt');
            return false;
        }

        const success = await this.updateAuthDomains();
        
        if (success) {
            console.log('');
            console.log('🎉 Firebase Auth domains updated successfully!');
            console.log('✅ You can now test Google Sign-in with your deployment URL');
        } else {
            console.log('');
            console.log('❌ Failed to update Firebase Auth domains');
            console.log('💡 You may need to add domains manually in Firebase Console:');
            console.log('   https://console.firebase.google.com/project/' + this.projectId + '/authentication/settings');
            console.log('');
            console.log('Domains to add manually:');
            this.domains.forEach(domain => console.log(`   - ${domain}`));
        }

        return success;
    }
}

// Run if called directly
if (require.main === module) {
    const manager = new FirebaseAuthManager();
    manager.run().catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}

module.exports = FirebaseAuthManager;
=======
#!/usr/bin/env node

/**
 * Firebase Auth Domains Automation
 * Uses Firebase Management API to programmatically update authorized domains
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class FirebaseAuthManager {
    constructor() {
        this.projectId = this.detectFirebaseProject();
        this.domains = this.loadDomains();
        this.accessToken = null;
    }

    detectFirebaseProject() {
        try {
            // Try to get project from .firebaserc
            const firebaseRc = path.join(process.cwd(), '.firebaserc');
            if (fs.existsSync(firebaseRc)) {
                const config = JSON.parse(fs.readFileSync(firebaseRc, 'utf8'));
                return config.projects?.default || null;
            }
            
            // Try firebase use command
            const result = execSync('firebase use', { encoding: 'utf8' });
            const match = result.match(/Active project: (.+?) \(/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('Could not detect Firebase project:', error.message);
            return null;
        }
    }

    loadDomains() {
        try {
            const domainFile = path.join(process.cwd(), 'firebase-domains-quick.txt');
            const content = fs.readFileSync(domainFile, 'utf8');
            return content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('//'));
        } catch (error) {
            console.error('Error loading domains:', error.message);
            return [];
        }
    }

    async getAccessToken() {
        try {
            console.log('🔑 Getting Firebase access token...');
            const result = execSync('gcloud auth print-access-token', { encoding: 'utf8' });
            this.accessToken = result.trim();
            console.log('✅ Access token obtained');
            return this.accessToken;
        } catch (error) {
            console.error('❌ Error getting access token:', error.message);
            console.log('💡 Make sure you are authenticated with: gcloud auth login ubeyo.software@gmail.com');
            return null;
        }
    }

    async getCurrentAuthDomains() {
        if (!this.accessToken) {
            await this.getAccessToken();
        }

        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'identitytoolkit.googleapis.com',
                path: `/admin/v2/projects/${this.projectId}/config`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const config = JSON.parse(data);
                        const authorizedDomains = config.authorizedDomains || [];
                        console.log('📋 Current authorized domains:', authorizedDomains);
                        resolve(authorizedDomains);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', reject);
            req.end();
        });
    }

    async updateAuthDomains() {
        if (!this.projectId) {
            console.error('❌ No Firebase project detected');
            return false;
        }

        if (!this.accessToken) {
            await this.getAccessToken();
        }

        if (!this.accessToken) {
            return false;
        }

        try {
            console.log(`🔥 Updating Firebase Auth domains for project: ${this.projectId}`);
            
            // Get current domains
            const currentDomains = await this.getCurrentAuthDomains();
            
            // Merge with new domains (remove duplicates)
            const allDomains = [...new Set([...currentDomains, ...this.domains])];
            
            console.log('🔄 Domains to set:', allDomains);

            // Update the configuration
            const updateData = {
                authorizedDomains: allDomains
            };

            return new Promise((resolve, reject) => {
                const postData = JSON.stringify(updateData);
                
                const options = {
                    hostname: 'identitytoolkit.googleapis.com',
                    path: `/admin/v2/projects/${this.projectId}/config?updateMask=authorizedDomains`,
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            console.log('✅ Firebase Auth domains updated successfully!');
                            console.log('📋 Updated domains:', allDomains);
                            resolve(true);
                        } else {
                            console.error('❌ Failed to update domains:', res.statusCode, data);
                            resolve(false);
                        }
                    });
                });

                req.on('error', (error) => {
                    console.error('❌ Request error:', error.message);
                    reject(error);
                });

                req.write(postData);
                req.end();
            });

        } catch (error) {
            console.error('❌ Error updating Firebase Auth domains:', error.message);
            return false;
        }
    }

    async run() {
        console.log('🚀 Firebase Auth Domains Automation');
        console.log('====================================');
        console.log(`📁 Project ID: ${this.projectId}`);
        console.log(`🌐 Domains to add: ${this.domains.join(', ')}`);
        console.log('');

        if (!this.projectId) {
            console.log('❌ No Firebase project detected. Please run: firebase use YOUR_PROJECT_ID');
            return false;
        }

        if (this.domains.length === 0) {
            console.log('❌ No domains to add. Check firebase-domains-quick.txt');
            return false;
        }

        const success = await this.updateAuthDomains();
        
        if (success) {
            console.log('');
            console.log('🎉 Firebase Auth domains updated successfully!');
            console.log('✅ You can now test Google Sign-in with your deployment URL');
        } else {
            console.log('');
            console.log('❌ Failed to update Firebase Auth domains');
            console.log('💡 You may need to add domains manually in Firebase Console:');
            console.log('   https://console.firebase.google.com/project/' + this.projectId + '/authentication/settings');
            console.log('');
            console.log('Domains to add manually:');
            this.domains.forEach(domain => console.log(`   - ${domain}`));
        }

        return success;
    }
}

// Run if called directly
if (require.main === module) {
    const manager = new FirebaseAuthManager();
    manager.run().catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}

module.exports = FirebaseAuthManager;
>>>>>>> 8c79b031eb4114a1769304328d70c79a875a675a
